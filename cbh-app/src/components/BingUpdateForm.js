import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function BingUpdateForm(props) {
    const initialFormData = Object.freeze({
        id: props.entry.id,
        terms: props.entry.terms,
        impressions: props.entry.impressions,
        clicks: props.entry.clicks,
        month: props.entry.month,
        year: props.entry.year
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

        const entryToUpdate = {
            id: formData.id,
            terms: formData.terms,
            impressions: formData.impressions,
            clicks: formData.clicks,
            month: formData.month,
            year: formData.year
        };

        const url = `${Constants.API_URL_BING_entries}/${props.entry.id}`;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entryToUpdate)
        })
        .then(response => response.json())
        .then(responseFromServer => {
            console.log(responseFromServer);
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });

        props.onentryUpdated(entryToUpdate);
    };

    return (
        <form className="w-100 px-5">
            <h1 className="mt-5">Updating the entry with id "{props.entry.id}".</h1>

            <div className="mt-5">
                <label className="h3 form-label">entry terms</label>
                <input value={formData.terms} name="terms" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry impressions</label>
                <input value={formData.impressions} name="impressions" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry clicks</label>
                <input value={formData.clicks} name="clicks" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry month</label>
                <input value={formData.month} name="month" type="text" className="form-control" onChange={handleChange} />
            </div>
            
            <div className="mt-4">
                <label className="h3 form-label">entry year</label>
                <input value={formData.year} name="year" type="text" className="form-control" onChange={handleChange} />
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-lg w-100 mt-5">Submit</button>
            <button onClick={() => props.onentryUpdated(null)} className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
        </form>
    );
}