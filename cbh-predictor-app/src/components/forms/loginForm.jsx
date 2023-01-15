import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import styles from "./forms.module.css"

const LoginForm = () => {
    const [formData, setFormData] = useState([])
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        authService.login(formData.username, formData.password).then(
            () => {
                console.log("login successful")
                navigate("/")
            },
            error => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                console.error(resMessage)
            }
        )
    };

    return (
        <div className={styles.body} style={{paddingTop: "10%"}}>
            <form>
                <h1>Login</h1>
        
                <div className="mt-5">
                    <label>Username</label>
                    <input value={formData.username || ''} name="username" type="text" className="form-control" onChange={handleChange} />
                </div>
        
                <div className="mt-4">
                    <label>Password</label>
                    <input value={formData.password || ''} name="password" type="password" className="form-control" onChange={handleChange} />
                </div>
        
                <button className={styles.button_green} onClick={handleSubmit}>Login</button>
            </form>
        </div>
    );    
}

export default LoginForm