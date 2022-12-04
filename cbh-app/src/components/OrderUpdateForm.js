import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function OrderUpdateForm(props) {
    const initialFormData = Object.freeze({
        id: props.post.id,
        customerID: props.post.customerID,
        orderID: props.post.customerID,
        orderDate: props.post.orderDate,
        orderPrice: props.post.orderPrice,
        storageTemp: props.post.storageTemp,
        donorID: props.post.donorID,
        cbhSampleID: props.post.cbhSampleID,
        matrix: props.post.matrix,
        supplierID: props.post.supplierID,
        supplierSampleID: props.post.supplierSampleID,
        productID: props.post.productID,
        countryID: props.post.countryID,
        quantity: props.post.quantity,
        unit: props.post.unit,
        age: props.post.age,
        gender: props.post.gender,
        ethnicity: props.post.ethnicity,
        labParamater: props.post.labParamater,
        resultNumerical: props.post.resultNumerical,
        resultUnit: props.post.resultUnit,
        resultInterpretation: props.post.resultInterpretation,
        testMethod: props.post.testMethod,
        testKitManufacturer: props.post.testKitManufacturer,
        testSystemManufaturer: props.post.testSystemManufaturer,
        diagnosis: props.post.diagnosis,
        icd: props.post.icd,
        histologicalDiagnosis: props.post.histologicalDiagnosis,
        organ: props.post.organ,
        collectionCountry: props.post.collectionCountry,
        collectionDate: props.post.collectionDate
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
            id: formData.id,
            customerID: formData.customerID,
            orderID: formData.orderID,
            orderDate: formData.orderDate,
            orderPrice: formData.orderPrice,
            storageTemp: formData.storageTemp,
            donorID: formData.donorID,
            cbhSampleID: formData.cbhSampleID,
            matrix: formData.matrix,
            supplierID: formData.supplierID,
            supplierSampleID: formData.supplierSampleID,
            productID: formData.productID,
            countryID: formData.countryID,
            quantity: formData.quantity,
            unit: formData.unit,
            age: formData.age,
            gender: formData.gender,
            ethnicity: formData.ethnicity,
            labParamater: formData.labParamater,
            resultNumerical: formData.resultNumerical,
            resultUnit: formData.resultUnit,
            resultInterpretation: formData.resultInterpretation,
            testMethod: formData.testMethod,
            testKitManufacturer: formData.testKitManufacturer,
            testSystemManufaturer: formData.testSystemManufaturer,
            diagnosis: formData.diagnosis,
            icd: formData.icd,
            histologicalDiagnosis: formData.histologicalDiagnosis,
            organ: formData.organ,
            collectionCountry: formData.collectionCountry,
            collectionDate: formData.collectionDate
        };

        const url = `${Constants.API_URL_ORDER_POSTS}/${props.post.id}`;

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
            <h1 className="mt-5">Updating the post with id "{props.post.id}".</h1>

            <div className="mt-5">
                <label className="h3 form-label">Post customerID</label>
                <input value={formData.customerID} name="customerID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post orderID</label>
                <input value={formData.orderID} name="orderID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Post orderDate</label>
                <input value={formData.orderDate} name="orderDate" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post orderPrice</label>
                <input value={formData.orderPrice} name="orderPrice" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post storageTemp</label>
                <input value={formData.storageTemp} name="storageTemp" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post donorID</label>
                <input value={formData.donorID} name="donorID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post cbhSampleID</label>
                <input value={formData.cbhSampleID} name="cbhSampleID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post matrix</label>
                <input value={formData.matrix} name="matrix" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post supplierID</label>
                <input value={formData.supplierID} name="supplierID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post supplierSampleID</label>
                <input value={formData.supplierSampleID} name="supplierSampleID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post productID</label>
                <input value={formData.productID} name="productID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post countryID</label>
                <input value={formData.countryID} name="countryID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post quantity</label>
                <input value={formData.quantity} name="quantity" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post unit</label>
                <input value={formData.unit} name="unit" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post age</label>
                <input value={formData.age} name="age" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post gender</label>
                <input value={formData.gender} name="gender" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post ethnicity</label>
                <input value={formData.ethnicity} name="ethnicity" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post labParamater</label>
                <input value={formData.labParamater} name="labParamter" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post resultNumerical</label>
                <input value={formData.resultNumerical} name="resultNumerical" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post resultUnit</label>
                <input value={formData.resultUnit} name="terms" type="resultUnit" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post resultInterpretation</label>
                <input value={formData.resultInterpretation} name="resultInterpretation" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post testMethod</label>
                <input value={formData.testMethod} name="testMethod" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post testKitManufacturer</label>
                <input value={formData.testKitManufacturer} name="testKitManufacturer" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post testSystemManufacturer</label>
                <input value={formData.testSystemManufaturer} name="testSystemManufacturer" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post diagnosis</label>
                <input value={formData.diagnosis} name="diagnosis" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post icd</label>
                <input value={formData.icd} name="icd" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post histologicalDiagnosis</label>
                <input value={formData.histologicalDiagnosis} name="histologicalDiagnosis" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post organ</label>
                <input value={formData.organ} name="organ" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post collectionCountry</label>
                <input value={formData.collectionCountry} name="collectionCountry" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Post collectionDate</label>
                <input value={formData.collectionDate} name="collectionDate" type="text" className="form-control" onChange={handleChange} />
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-lg w-100 mt-5">Submit</button>
            <button onClick={() => props.onPostUpdated(null)} className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
        </form>
    );
}    