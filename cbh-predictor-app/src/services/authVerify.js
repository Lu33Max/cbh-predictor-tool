import authService from "./auth.service";
import axios from "axios";
import Constants from "../utilities/Constants";
import { useNavigate } from "react-router-dom";

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]))
    } catch (e) {
        return null
    }
}

const AuthVerify = () => {
    const user = authService.getCurrentUser()
    const decodedToken = parseJwt(user.token)

    console.log(user.token + " | " + user.refreshToken)

    if(user.token && !(decodedToken.exp * 1000 < Date.now())) {
        console.log(decodedToken)
        return true
    }

    const isRefreshSuccess = tryRefreshingTokens(user.token, user.refreshToken);
    return isRefreshSuccess
}

function tryRefreshingTokens(token, refreshToken) {
    if(!token || !refreshToken) return false

    const url = "http://localhost:5210/api/token/refresh"
    let isRefreshSuccess

    axios.post(url, {"accessToken": token, "refreshToken": refreshToken})
    .then(response => {
        if (response.data.token && response.data.refreshToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log(response.data)
            axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.token}`}
            isRefreshSuccess = true
        }
        return response.data;
    })
    .catch(err => {
        console.log(err)
        isRefreshSuccess = false
        console.log("Refresh failed")
    })

    return isRefreshSuccess
}

export default AuthVerify