import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function LeadUpdateForm(props) {
    const initialFormData = Object.freeze({
        id: props.entry.id,
        leadID: props.entry.leadID,
        leadNO: props.entry.leadNO,
        leadStatus: props.entry.leadStatus,
        leadDate: props.entry.leadDate,
        organisationID: props.entry.organisationID,
        countryID: props.entry.countryID,
        channel: props.entry.channel,
        fieldOfInterest: props.entry.fieldOfInterest,
        specificOfInterest: props.entry.specificOfInterest,
        paramOfInterest: props.entry.paramOfInterest,
        diagnosisOfInterest: props.entry.diagnosisOfInterest,
        matrixOfInterest: props.entry.matrixOfInterest,
        quantityOfInterest: props.entry.quantityOfInterest
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

        const url = `${Constants.API_URL_LEAD_ENTRIES}/${props.entry.id}`;

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

        props.onEntryUpdated(entryToUpdate);
    };

    return (
        <form className="w-100 px-5">
            <h1 className="mt-5">Updating the Entry with id "{props.entry.id}".</h1>

            <div className="mt-5">
                <label className="h3 form-label">Entry leadID</label>
                <input value={formData.leadID} name="leadID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry leadNo</label>
                <input value={formData.leadNO} name="leadNO" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry leadStatus</label>
                <input value={formData.leadStatus} name="leadStatus" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry leadDate</label>
                <input value={formData.leadDate} name="leadDate" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry organisationID</label>
                <input value={formData.organisationID} name="organisationID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry countryID</label>
                <input value={formData.countryID} name="countryID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry channel</label>
                <input value={formData.channel} name="channel" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry fieldOfInterest</label>
                <input value={formData.fieldOfInterest} name="fieldOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry specificOfInterest</label>
                <input value={formData.specificOfInterest} name="specificOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry paramOfInterest</label>
                <input value={formData.paramOfInterest} name="paramOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry diagnosisOfInterest</label>
                <input value={formData.diagnosisOfInterest} name="diagnosisOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry matrixOfInterest</label>
                <input value={formData.matrixOfInterest} name="matrixOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry quantityOfInterest</label>
                <input value={formData.quantityOfInterest} name="quantityOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-lg w-100 mt-5">Submit</button>
            <button onClick={() => props.onEntryUpdated(null)} className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
        </form>
    );
}
