import axios from "axios";
import Constants from "../utilities/Constants";

const API_URL = Constants.API_URL_AUTHENTICATION;

class AuthService {
    login(username, password) {
        return axios.post(API_URL + "/login", {username, password})
        .then(response => {
            if (response.data.token && response.data.refreshToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
                console.log(response.data)
                axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.token}`}
            }
            return response.data;
        });
    }

    logout() {
        localStorage.removeItem("user");
        window.location.reload(false)
    }

    register(username, email, password) {
        return axios.post(API_URL + "/signup", {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));;
    }
}

export default new AuthService();