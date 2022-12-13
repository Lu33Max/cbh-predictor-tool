import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function LeadCreateForm(props) {
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

        const entryToCreate = {
            id: formData.id,
            leadID: formData.leadID,
            leadNO: formData.leadNO,
            leadStatus: formData.leadStatus,
            leadDate: formData.leadDate,
            organisationID: formData.organisationID,
            countryID: formData.countryID,
            channel: formData.channel,
            fieldOfInterest: formData.fieldOfInterest,
            specificOfInterest: formData.specificOfInterest,
            paramOfInterest: formData.paramOfInterest,
            diagnosisOfInterest: formData.diagnosisOfInterest,
            matrixOfInterest: formData.matrixOfInterest,
            quantityOfInterest: formData.quantityOfInterest
        };

        const url = Constants.API_URL_LEAD_entries;

        fetch(url, {
            method: 'entry',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entryToCreate)
        })
            .then(response => response.json())
            .then(responseFromServer => {
                console.log(responseFromServer);
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });

        props.onentryCreated(entryToCreate);
    };

    return (
        <form className="w-100 px-5">
            <h1 className="mt-5">Create new entry</h1>

            <div className="mt-5">
                <label className="h3 form-label">entry leadID</label>
                <input value={formData.leadID} name="leadID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry leadNo</label>
                <input value={formData.leadNO} name="leadNO" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry leadStatus</label>
                <input value={formData.leadStatus} name="leadStatus" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry leadDate</label>
                <input value={formData.leadDate} name="leadDate" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry organisationID</label>
                <input value={formData.organisationID} name="organisationID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry countryID</label>
                <input value={formData.countryID} name="countryID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry channel</label>
                <input value={formData.channel} name="channel" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry fieldOfInterest</label>
                <input value={formData.fieldOfInterest} name="fieldOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry specificOfInterest</label>
                <input value={formData.specificOfInterest} name="specificOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry paramOfInterest</label>
                <input value={formData.paramOfInterest} name="paramOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry diagnosisOfInterest</label>
                <input value={formData.diagnosisOfInterest} name="diagnosisOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry matrixOfInterest</label>
                <input value={formData.matrixOfInterest} name="matrixOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">entry quantityOfInterest</label>
                <input value={formData.quantityOfInterest} name="quantityOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-lg w-100 mt-5">Submit</button>
            <button onClick={() => props.onentryCreated(null)} className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
        </form>
    );
}
