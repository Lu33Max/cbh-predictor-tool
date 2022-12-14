import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function LogInForm() {
    const initialFormData = Object.freeze({
        //Enter possible values here which are already displayed as an example
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
 
    const [formData, setFormData] = useState(initialFormData);

    return (
        <form className="w-100 px-5">
            <h1 className="mt-5">Login</h1>
    
            <div className="mt-5">
                <label className="h3 form-label">E-Mail Adresse</label>
                <input value={formData.terms} name="email" type="text" className="form-control" onChange={handleChange} />
            </div>
    
            <div className="mt-4">
                <label className="h3 form-label">Passwort</label>
                <input value={formData.impressions} name="password" type="text" className="form-control" onChange={handleChange} />
            </div>
    
            <button className="btn btn-dark btn-lg w-100 mt-5">Log in</button>
            <button className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
        </form>
    );
    }