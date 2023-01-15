import authService from './auth.service'
import axios from 'axios'

const axiosApiInstance = axios.create()

axiosApiInstance.interceptors.request.use(
    async config => {
        const user = authService.getCurrentUser()
        config.headers = {
            'Authorization': `Bearer ${user.token}`
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

axiosApiInstance.interceptors.response.use((response) => {
    return response
}, async function(error) {
    const originalRequest = error.config
    console.log(error)
    if((error.response.status === 403 || error.response.status === 401) && !originalRequest._retry) {
        originalRequest._retry = true
        const accessToken = await tryRefreshingTokens()
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
        return axiosApiInstance(originalRequest)
    }
    return Promise.reject(error)
})

async function tryRefreshingTokens() {
    const user = authService.getCurrentUser()
    const url = "http://localhost:5210/api/token/refresh"

    await axios.post(url, {"accessToken": user.token, "refreshToken": user.refreshToken})
    .then(response => {
        if (response.data.token && response.data.refreshToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log(response.data)
        }
        return response.data.token;
    })
    .catch(err => {
        console.error(err)
        authService.logout()
        return Promise.reject(err)
    })
}

export default axiosApiInstance