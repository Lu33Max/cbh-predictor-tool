import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function PostUpdateForm(props) {
    const initialFormData = Object.freeze({
        leadID: props.post.leadID,
        leadNO: props.post.leadNO,
        leadStatus: props.post.leadStatus,
        leadDate: props.post.leadDate,
        organisationID: props.post.organisationID,
        countryID: props.post.countryID,
        channel: props.post.channel,
        fieldOfInterest: props.post.fieldOfInterest,
        specificOfInterest: props.post.specificOfInterest,
        paramOfInterest: props.post.paramOfInterest,
        diagnosisOfInterest: props.post.diagnosisOfInterest,
        matrixOfInterest: props.post.matrixOfInterest,
        quantityOfInterest: props.post.quantityOfInterest
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

        const postToUpdate = {
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

        const url = Constants.API_URL_UPDATE_POST;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postToUpdate)
        })
            .then(response => response.json())
            .then(responseFromServer => {
                console.log(responseFromServer);
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });

        props.onPostUpdated(postToUpdate);
    };

    return (
        <form className="w-100 px-5">
            <h1 className="mt-5">Updating the post with id "{props.post.leadID}".</h1>

            <div className="mt-5">
                <label className="h3 form-label">Post leadID</label>
                <input value={formData.leadID} name="leadID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post leadNo</label>
                <input value={formData.leadNO} name="leadNO" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post leadStatus</label>
                <input value={formData.leadStatus} name="leadStatus" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post leadDate</label>
                <input value={formData.leadDate} name="leadDate" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post organisationID</label>
                <input value={formData.organisationID} name="organisationID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post countryID</label>
                <input value={formData.countryID} name="countryID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post channel</label>
                <input value={formData.channel} name="channel" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post fieldOfInterest</label>
                <input value={formData.fieldOfInterest} name="fieldOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post specificOfInterest</label>
                <input value={formData.specificOfInterest} name="specificOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post paramOfInterest</label>
                <input value={formData.paramOfInterest} name="paramOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post diagnosisOfInterest</label>
                <input value={formData.diagnosisOfInterest} name="diagnosisOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post matrixOfInterest</label>
                <input value={formData.matrixOfInterest} name="matrixOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post quantityOfInterest</label>
                <input value={formData.quantityOfInterest} name="quantityOfInterest" type="text" className="form-control" onChange={handleChange} />
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-lg w-100 mt-5">Submit</button>
            <button onClick={() => props.onPostUpdated(null)} className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
        </form>
    );
}
