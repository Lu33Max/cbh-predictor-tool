import React, { useState } from 'react'
import Constants from '../../utilities/Constants';
import styles from "./forms.module.css"

const UpdateEntryForm = (props) => {
    let initialFormData;
    switch(props.table){
        case 'Bing':
        case 'Google':
            initialFormData = Object.freeze({
                id: props.entry.id,
                terms: props.entry.terms,
                impressions: props.entry.impressions,
                clicks: props.entry.clicks,
                month: props.entry.date ? getMonth(props.entry.date) : "",
                year: props.entry.date ? props.entry.date.slice(0, props.entry.date.indexOf('-')) : ""
            });
            break;
        case 'Lead':
            initialFormData = Object.freeze({
                id: props.entry.id,
                leadID: props.entry.leadID,
                leadNo: props.entry.leadNo,
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
            break;
        case 'Order':
            initialFormData = Object.freeze({
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
            break;
        default:
            break;
    }

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const months = [{name: "Jan", index: "01"},{name: "Feb", index: "02"},{name: "Mar", index: "03"},{name: "Apr", index: "04"},{name: "May", index: "05"},{name: "Jun", index: "06"},
        {name: "Jul", index: "07"},{name: "Aug", index: "08"},{name: "Sep", index: "09"},{name: "Oct", index: "10"},{name: "Nov", index: "11"},{name: "Dec", index: "12"}]

        const entryToUpdate = {
            id: formData.id,
            terms: formData.terms,
            impressions: formData.impressions,
            clicks: formData.clicks,
            date: formData.year + "-" + months[months.findIndex(e => e.name === formData.month)].index
        };

        let url;
        if(props.table === 'Bing') url = `${Constants.API_URL_BING_ENTRIES}/${props.entry.id}`;
        else url = `${Constants.API_URL_GOOGLE_ENTRIES}/${props.entry.id}`;

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

    const handleLeadSubmit = (e) => {
        e.preventDefault();

        const entryToUpdate = {
            id: formData.id,
            leadID: formData.leadID,
            leadNo: formData.leadNo,
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

    const handleOrderSubmit = (e) => {
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
        <div className={styles.body}>
            <h1>Update Entry</h1>
            {(props.table === 'Bing' || props.table === 'Google') && <SearchTermForm props={props} handleChange={handleChange} handleSubmit={handleSearchSubmit} formData={formData}/>}
            {(props.table === 'Lead') && <LeadEntryForm props={props} handleChange={handleChange} handleSubmit={handleLeadSubmit} formData={formData}/>}
            {(props.table === 'Order') && <OrderEntryForm props={props} handleChange={handleChange} handleSubmit={handleOrderSubmit} formData={formData}/>}
        </div>
    );
}

const SearchTermForm = (props) => {
    return (
        <form>
            <div className="mt-5">
                <label className="h3 form-label">Entry terms</label>
                <input value={props.formData.terms || ''} name="terms" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry impressions</label>
                <input value={props.formData.impressions || ''} name="impressions" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry clicks</label>
                <input value={props.formData.clicks || ''} name="clicks" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry month</label>
                <input value={props.formData.month || ''} name="month" type="text" className="form-control" onChange={props.handleChange} />
            </div>
            
            <div className="mt-4">
                <label className="h3 form-label">Entry year</label>
                <input value={props.formData.year || ''} name="year" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <button onClick={props.handleSubmit} className={styles.button_green}>Submit</button>
            <button onClick={() => props.props.onEntryUpdated(null)} className={styles.button_gray}>Cancel</button>
        </form>
    );
}

const LeadEntryForm = (props) => {
    return(
        <form>
            <div className="mt-5">
                <label className="h3 form-label">Entry leadID</label>
                <input value={props.formData.leadID || ''} name="leadID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry leadNo</label>
                <input value={props.formData.leadNo || ''} name="leadNO" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry leadStatus</label>
                <input value={props.formData.leadStatus || ''} name="leadStatus" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry leadDate</label>
                <input value={props.formData.leadDate || ''} name="leadDate" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry organisationID</label>
                <input value={props.formData.organisationID || ''} name="organisationID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry countryID</label>
                <input value={props.formData.countryID || ''} name="countryID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry channel</label>
                <input value={props.formData.channel || ''} name="channel" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry fieldOfInterest</label>
                <input value={props.formData.fieldOfInterest || ''} name="fieldOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry specificOfInterest</label>
                <input value={props.formData.specificOfInterest || ''} name="specificOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry paramOfInterest</label>
                <input value={props.formData.paramOfInterest || ''} name="paramOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry diagnosisOfInterest</label>
                <input value={props.formData.diagnosisOfInterest || ''} name="diagnosisOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry matrixOfInterest</label>
                <input value={props.formData.matrixOfInterest || ''} name="matrixOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry quantityOfInterest</label>
                <input value={props.formData.quantityOfInterest || ''} name="quantityOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <button onClick={props.handleSubmit} className={styles.button_green}>Submit</button>
            <button onClick={() => props.props.onEntryUpdated(null)} className={styles.button_gray}>Cancel</button>
        </form>
    )
}

const OrderEntryForm = (props) => {
    return(
        <form>
            <div className="mt-5">
                <label className="h3 form-label">Entry customerID</label>
                <input value={props.formData.customerID || ''} name="customerID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry orderID</label>
                <input value={props.formData.orderID || ''} name="orderID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry orderDate</label>
                <input value={props.formData.orderDate || ''} name="orderDate" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry orderPrice</label>
                <input value={props.formData.orderPrice || ''} name="orderPrice" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry storageTemp</label>
                <input value={props.formData.storageTemp || ''} name="storageTemp" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry donorID</label>
                <input value={props.formData.donorID || ''} name="donorID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry cbhSampleID</label>
                <input value={props.formData.cbhSampleID || ''} name="cbhSampleID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry matrix</label>
                <input value={props.formData.matrix || ''} name="matrix" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry supplierID</label>
                <input value={props.formData.supplierID || ''} name="supplierID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry supplierSampleID</label>
                <input value={props.formData.supplierSampleID || ''} name="supplierSampleID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry productID</label>
                <input value={props.formData.productID || ''} name="productID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry countryID</label>
                <input value={props.formData.countryID || ''} name="countryID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry quantity</label>
                <input value={props.formData.quantity || ''} name="quantity" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry unit</label>
                <input value={props.formData.unit || ''} name="unit" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry age</label>
                <input value={props.formData.age || ''} name="age" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry gender</label>
                <input value={props.formData.gender || ''} name="gender" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry ethnicity</label>
                <input value={props.formData.ethnicity || ''} name="ethnicity" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry labParamater</label>
                <input value={props.formData.labParamater || ''} name="labParamter" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry resultNumerical</label>
                <input value={props.formData.resultNumerical || ''} name="resultNumerical" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry resultUnit</label>
                <input value={props.formData.resultUnit || ''} name="terms" type="resultUnit" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry resultInterpretation</label>
                <input value={props.formData.resultInterpretation || ''} name="resultInterpretation" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry testMethod</label>
                <input value={props.formData.testMethod || ''} name="testMethod" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry testKitManufacturer</label>
                <input value={props.formData.testKitManufacturer || ''} name="testKitManufacturer" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry testSystemManufacturer</label>
                <input value={props.formData.testSystemManufaturer || ''} name="testSystemManufacturer" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry diagnosis</label>
                <input value={props.formData.diagnosis || ''} name="diagnosis" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry icd</label>
                <input value={props.formData.icd || ''} name="icd" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry histologicalDiagnosis</label>
                <input value={props.formData.histologicalDiagnosis || ''} name="histologicalDiagnosis" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry organ</label>
                <input value={props.formData.organ || ''} name="organ" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry collectionCountry</label>
                <input value={props.formData.collectionCountry || ''} name="collectionCountry" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry collectionDate</label>
                <input value={props.formData.collectionDate || ''} name="collectionDate" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <button onClick={props.handleSubmit} className={styles.button_green}>Submit</button>
            <button onClick={() => props.props.onEntryUpdated(null)} className={styles.button_gray}>Cancel</button>
        </form>
    )
}

function getMonth(date) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const month = date.split('-')[1]
    return months[month - 1]
}

export default UpdateEntryForm