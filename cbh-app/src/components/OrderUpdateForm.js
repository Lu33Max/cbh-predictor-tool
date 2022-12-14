import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function OrderUpdateForm(props) {
    const initialFormData = Object.freeze({
        id: props.entry.id,
        customerID: props.entry.customerID,
        orderID: props.entry.customerID,
        orderDate: props.entry.orderDate,
        orderPrice: props.entry.orderPrice,
        storageTemp: props.entry.storageTemp,
        donorID: props.entry.donorID,
        cbhSampleID: props.entry.cbhSampleID,
        matrix: props.entry.matrix,
        supplierID: props.entry.supplierID,
        supplierSampleID: props.entry.supplierSampleID,
        productID: props.entry.productID,
        countryID: props.entry.countryID,
        quantity: props.entry.quantity,
        unit: props.entry.unit,
        age: props.entry.age,
        gender: props.entry.gender,
        ethnicity: props.entry.ethnicity,
        labParamater: props.entry.labParamater,
        resultNumerical: props.entry.resultNumerical,
        resultUnit: props.entry.resultUnit,
        resultInterpretation: props.entry.resultInterpretation,
        testMethod: props.entry.testMethod,
        testKitManufacturer: props.entry.testKitManufacturer,
        testSystemManufaturer: props.entry.testSystemManufaturer,
        diagnosis: props.entry.diagnosis,
        icd: props.entry.icd,
        histologicalDiagnosis: props.entry.histologicalDiagnosis,
        organ: props.entry.organ,
        collectionCountry: props.entry.collectionCountry,
        collectionDate: props.entry.collectionDate
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

        const url = `${Constants.API_URL_ORDER_ENTRIES}/${props.entry.id}`;

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
            <h1 className="mt-5">Updating the entry with id "{props.entry.id}".</h1>

            <div className="mt-5">
                <label className="h3 form-label">Entry customerID</label>
                <input value={formData.customerID} name="customerID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry orderID</label>
                <input value={formData.orderID} name="orderID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry orderDate</label>
                <input value={formData.orderDate} name="orderDate" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry orderPrice</label>
                <input value={formData.orderPrice} name="orderPrice" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry storageTemp</label>
                <input value={formData.storageTemp} name="storageTemp" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry donorID</label>
                <input value={formData.donorID} name="donorID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry cbhSampleID</label>
                <input value={formData.cbhSampleID} name="cbhSampleID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry matrix</label>
                <input value={formData.matrix} name="matrix" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry supplierID</label>
                <input value={formData.supplierID} name="supplierID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry supplierSampleID</label>
                <input value={formData.supplierSampleID} name="supplierSampleID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry productID</label>
                <input value={formData.productID} name="productID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry countryID</label>
                <input value={formData.countryID} name="countryID" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry quantity</label>
                <input value={formData.quantity} name="quantity" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry unit</label>
                <input value={formData.unit} name="unit" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry age</label>
                <input value={formData.age} name="age" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry gender</label>
                <input value={formData.gender} name="gender" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry ethnicity</label>
                <input value={formData.ethnicity} name="ethnicity" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry labParamater</label>
                <input value={formData.labParamater} name="labParamter" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry resultNumerical</label>
                <input value={formData.resultNumerical} name="resultNumerical" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry resultUnit</label>
                <input value={formData.resultUnit} name="terms" type="resultUnit" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry resultInterpretation</label>
                <input value={formData.resultInterpretation} name="resultInterpretation" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry testMethod</label>
                <input value={formData.testMethod} name="testMethod" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry testKitManufacturer</label>
                <input value={formData.testKitManufacturer} name="testKitManufacturer" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry testSystemManufacturer</label>
                <input value={formData.testSystemManufaturer} name="testSystemManufacturer" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry diagnosis</label>
                <input value={formData.diagnosis} name="diagnosis" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry icd</label>
                <input value={formData.icd} name="icd" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry histologicalDiagnosis</label>
                <input value={formData.histologicalDiagnosis} name="histologicalDiagnosis" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry organ</label>
                <input value={formData.organ} name="organ" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry collectionCountry</label>
                <input value={formData.collectionCountry} name="collectionCountry" type="text" className="form-control" onChange={handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry collectionDate</label>
                <input value={formData.collectionDate} name="collectionDate" type="text" className="form-control" onChange={handleChange} />
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-lg w-100 mt-5">Submit</button>
            <button onClick={() => props.onEntryUpdated(null)} className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
        </form>
    );
}    