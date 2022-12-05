import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function BingCreateForm(props) {
    const initialFormData = Object.freeze({
       //Enter possible values here which are already displayed as an example
    });

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const postToCreate = {
            id: formData.id,
            terms: formData.terms,
            impressions: formData.impressions,
            clicks: formData.clicks,
            month: formData.month,
            year: formData.year
        };

        const url = Constants.API_URL_BING_POSTS;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postToCreate)
        })
        .then(response => response.json())
        .then(responseFromServer => {
            console.log(responseFromServer);
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });

        props.onPostCreated(postToCreate);
    };

    return (
        <form className="w-100 px-5">
            <h1 className="mt-5">Create new post</h1>

            <div className="mt-5">
                <label className="h3 form-label">Post terms</label>
                <input value={formData.terms} name="terms" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post impressions</label>
                <input value={formData.impressions} name="impressions" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post clicks</label>
                <input value={formData.clicks} name="clicks" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post month</label>
                <input value={formData.month} name="month" type="text" className="form-control" onChange={handleChange} />
            </div>
            
            <div className="mt-4">
                <label className="h3 form-label">Post year</label>
                <input value={formData.year} name="year" type="text" className="form-control" onChange={handleChange} />
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-lg w-100 mt-5">Submit</button>
            <button onClick={() => props.onPostCreated(null)} className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
        </form>
    );
}