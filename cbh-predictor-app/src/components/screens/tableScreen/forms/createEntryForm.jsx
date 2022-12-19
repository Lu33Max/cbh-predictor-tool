import React, { useState } from 'react'
import Constants from '../../../../utilities/Constants';
import styles from "./forms.module.css"

const CreateEntryForm = (props) => {
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

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const entryToCreate = {
            id: formData.id,
            terms: formData.terms,
            impressions: formData.impressions,
            clicks: formData.clicks,
            month: formData.month,
            year: formData.year
        };

        let url;
        if(props.table === 'Bing') url = Constants.API_URL_BING_ENTRIES;
        else url = Constants.API_URL_GOOGLE_ENTRIES

        fetch(url, {
            method: 'POST',
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

        props.onEntryCreated(entryToCreate);
    };

    const handleLeadSubmit = (e) => {
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

        const url = Constants.API_URL_LEAD_ENTRIES;

        fetch(url, {
            method: 'POST',
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

        props.onEntryCreated(entryToCreate);
    };

    const handleOrderSubmit = (e) => {
        e.preventDefault();

        const entryToCreate = {
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

        const url = Constants.API_URL_ORDER_ENTRIES;

        fetch(url, {
            method: 'POST',
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

        props.onEntryCreated(entryToCreate);
    };

    return(
        <>
            <h1>Create new Entry</h1>
            {(props.table === 'Bing' || props.table === 'Google') && <SearchTermForm handleChange={handleChange} handleSubmit={handleSearchSubmit} formData={formData} props={props}/> }
            {(props.table === 'Lead') && <LeadEntryForm handleChange={handleChange} handleSubmit={handleLeadSubmit} formData={formData} props={props}/> }
            {(props.table === 'Order') && <OrderEntryForm handleChange={handleChange} handleSubmit={handleOrderSubmit} formData={formData} props={props}/> }
        </>
    )
}

const SearchTermForm = (props) => {
    return(
        <form className="w-100 px-5">
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

            <button onClick={props.handleSubmit} className={styles.button_black}>Submit</button>
            <button onClick={() => props.props.onEntryCreated(null)} className={styles.button_gray}>Cancel</button>
        </form>
    )
}

const LeadEntryForm = (props) => {
    return (
        <form className="w-100 px-5">
            <div className="mt-5">
                <label className="h3 form-label">Entry leadID</label>
                <input value={props.formData.leadID} name="leadID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry leadNo</label>
                <input value={props.formData.leadNO} name="leadNO" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry leadStatus</label>
                <input value={props.formData.leadStatus} name="leadStatus" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry leadDate</label>
                <input value={props.formData.leadDate} name="leadDate" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry organisationID</label>
                <input value={props.formData.organisationID} name="organisationID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry countryID</label>
                <input value={props.formData.countryID} name="countryID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry channel</label>
                <input value={props.formData.channel} name="channel" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry fieldOfInterest</label>
                <input value={props.formData.fieldOfInterest} name="fieldOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry specificOfInterest</label>
                <input value={props.formData.specificOfInterest} name="specificOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry paramOfInterest</label>
                <input value={props.formData.paramOfInterest} name="paramOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry diagnosisOfInterest</label>
                <input value={props.formData.diagnosisOfInterest} name="diagnosisOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry matrixOfInterest</label>
                <input value={props.formData.matrixOfInterest} name="matrixOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry quantityOfInterest</label>
                <input value={props.formData.quantityOfInterest} name="quantityOfInterest" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <button onClick={props.handleSubmit} className={styles.button_black}>Submit</button>
            <button onClick={() => props.props.onEntryCreated(null)} className={styles.button_gray}>Cancel</button>
        </form>
    );
}

const OrderEntryForm = (props) => {
    return(
        <form className="w-100 px-5">
            <div className="mt-5">
                <label className="h3 form-label">Entry customerID</label>
                <input value={props.formData.customerID} name="customerID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry orderID</label>
                <input value={props.formData.orderID} name="orderID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-4">
                <label className="h3 form-label">Entry orderDate</label>
                <input value={props.formData.orderDate} name="orderDate" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry orderPrice</label>
                <input value={props.formData.orderPrice} name="orderPrice" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry storageTemp</label>
                <input value={props.formData.storageTemp} name="storageTemp" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry donorID</label>
                <input value={props.formData.donorID} name="donorID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry cbhSampleID</label>
                <input value={props.formData.cbhSampleID} name="cbhSampleID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry matrix</label>
                <input value={props.formData.matrix} name="matrix" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry supplierID</label>
                <input value={props.formData.supplierID} name="supplierID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry supplierSampleID</label>
                <input value={props.formData.supplierSampleID} name="supplierSampleID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry productID</label>
                <input value={props.formData.productID} name="productID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry countryID</label>
                <input value={props.formData.countryID} name="countryID" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry quantity</label>
                <input value={props.formData.quantity} name="quantity" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry unit</label>
                <input value={props.formData.unit} name="unit" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry age</label>
                <input value={props.formData.age} name="age" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry gender</label>
                <input value={props.formData.gender} name="gender" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry ethnicity</label>
                <input value={props.formData.ethnicity} name="ethnicity" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry labParamater</label>
                <input value={props.formData.labParamater} name="labParamter" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry resultNumerical</label>
                <input value={props.formData.resultNumerical} name="resultNumerical" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry resultUnit</label>
                <input value={props.formData.resultUnit} name="terms" type="resultUnit" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry resultInterpretation</label>
                <input value={props.formData.resultInterpretation} name="resultInterpretation" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry testMethod</label>
                <input value={props.formData.testMethod} name="testMethod" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry testKitManufacturer</label>
                <input value={props.formData.testKitManufacturer} name="testKitManufacturer" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry testSystemManufacturer</label>
                <input value={props.formData.testSystemManufaturer} name="testSystemManufacturer" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry diagnosis</label>
                <input value={props.formData.diagnosis} name="diagnosis" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry icd</label>
                <input value={props.formData.icd} name="icd" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry histologicalDiagnosis</label>
                <input value={props.formData.histologicalDiagnosis} name="histologicalDiagnosis" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry organ</label>
                <input value={props.formData.organ} name="organ" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry collectionCountry</label>
                <input value={props.formData.collectionCountry} name="collectionCountry" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <div className="mt-5">
                <label className="h3 form-label">Entry collectionDate</label>
                <input value={props.formData.collectionDate} name="collectionDate" type="text" className="form-control" onChange={props.handleChange} />
            </div>

            <button onClick={props.handleSubmit} className={styles.button_black}>Submit</button>
            <button onClick={() => props.props.onEntryCreated(null)} className={styles.button_gray}>Cancel</button>
        </form>
    )
}

export default CreateEntryForm