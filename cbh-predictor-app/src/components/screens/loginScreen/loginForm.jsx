import React, { useState } from 'react'
import Constants from '../../../utilities/Constants';
import styles from "./loginForm.module.css"

function LogInForm(props) {
    const [formData, setFormData] = useState([])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = `${Constants.API_URL_LOGIN_ENTRIES}/SearchForEntry/${formData.email}/${formData.password}`

        fetch(url, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(responseFromServer => {
            props.onLogin(responseFromServer)
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });
    };

    return (
        <div className={styles.body}>
            <form>
                <h1>Login</h1>
        
                <div className="mt-5">
                    <label>E-Mail Adress</label>
                    <input value={formData.email || ''} name="email" type="text" className="form-control" onChange={handleChange} />
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

export default LogInForm