import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function LogInForm(props) {
    const initialFormData = Object.freeze({
        //Enter possible values here which are already displayed as an example
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const entryToCreate = {
           email: formData.email,
           password: formData.password
        };

        const url = `${Constants.API_URL_LOGIN_ENTRIES}/SearchForEntry/${formData.email}/${formData.password}`

        fetch(url, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(responseFromServer => {
            console.log(responseFromServer);
        props.onLogIn(responseFromServer);
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });

        props.onEntryCreated(entryToCreate);
    };
 
    const [formData, setFormData] = useState(initialFormData);

    return (
        <form className="w-100 px-5">
            <h1 className="mt-5">Login</h1>
    
            <div className="mt-5">
                <label className="h3 form-label">E-Mail Adresse</label>
                <input value={formData.email} name="email" type="text" className="form-control" onChange={handleChange} />
            </div>
    
            <div className="mt-4">
                <label className="h3 form-label">Passwort</label>
                <input value={formData.password} name="password" type="password" className="form-control" onChange={handleChange} />
            </div>
    
            <button onClick={handleSubmit} className="btn btn-success btn-lg w-100 mt-5">Log in</button>
            <button onClick={() => props.onEntryCreated(null)} className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
        </form>
    );    
    }