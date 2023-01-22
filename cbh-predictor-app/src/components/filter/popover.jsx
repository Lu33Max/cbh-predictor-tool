import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import styles from "../../pages/table/tablescreen.module.css"
import { useState } from 'react';

function FilterOverlay (handleChange, handleChangeFiltertype, handleSubmit, filtertype, filter, table) {
    return (
        <Popover id="popover-basic">
            <Popover.Header><h5>Filter</h5></Popover.Header>
            <Popover.Body className={styles.popover}>
                <h4>Type:<select className={styles.filterSelect} onChange={handleChangeFiltertype}>
                    <option value="single">Single</option>
                    <option value="range">Range</option>
                    <option value="compare">Compare</option>
                </select></h4>
                {(table === 'Bing' || table === 'Google') &&
                    <>
                        <h5>Column:</h5>
                        <select className={styles.col_select} onChange={handleChange} name="col" type="text">
                            <option value="" selected disabled hidden>Choose here</option>
                            <option value="terms" name="Search Term">Search Term</option>
                            <option value="impressions">Impressions</option>
                            <option value="clicks">Clicks</option>
                            <option value="date">Date</option>
                        </select>
                    </>
                } 
                {table === 'Lead' &&
                    <>
                        <h5>Column:</h5>
                        <select className={styles.col_select} onChange={handleChange} name="col" type="text">
                            <option value="" selected disabled hidden>Choose here</option>
                            <option value="leadID">LeadID</option>
                            <option value="leadNo">LeadNo</option>
                            <option value="leadStatus">LeadStatus</option>
                            <option value="leadDate">LeadDate</option>
                            <option value="organisationID">OrganisationID</option>
                            <option value="countryID">CountryID</option>
                            <option value="channel">Channel</option>
                            <option value="fieldOfInterest">FieldOfInterest</option>
                            <option value="specificOfInterest">SpecificOfInterest</option>
                            <option value="paramOfInterest">ParamOfInterest</option>
                            <option value="diagnosisOfInterest">DiagnosisOfInterest</option>
                            <option value="matrixOfInterest">MatrixOfInterest</option>
                            <option value="quantityOfInterest">QuantityOfInterest</option>
                        </select>
                    </>
                }
                {table === 'Order' &&
                    <>
                        <h5>Column:</h5>
                        <select className={styles.col_select} onChange={handleChange} name="col" type="text">
                            <option value="" selected disabled hidden>Choose here</option>
                            <option value="customerID">CustomerID</option>
                            <option value="orderID">OrderID</option>
                            <option value="orderDate">OrderDate</option>
                            <option value="orderPrice">OrderPrice</option>
                            <option value="storageTemp">StorageTemp</option>
                            <option value="donorID">DonorID</option>
                            <option value="cbhSampleID">CBHSampleID</option>
                            <option value="matrix">Matrix</option>
                            <option value="supplierID">SupplierID</option>
                            <option value="supplierSampleID">SupplierSampleID</option>
                            <option value="productID">ProductID</option>
                            <option value="countryID">CountryID</option>
                            <option value="quantity">Quantity</option>
                            <option value="unit">Unit</option>
                            <option value="age">Age</option>
                            <option value="gender">Gender</option>
                            <option value="ethnicity">Ethnicity</option>
                            <option value="labParameter">LabParameter</option>
                            <option value="resultNumerical">ResultNumerical</option>
                            <option value="resultUnit">ResultUnit</option>
                            <option value="resultInterpretation">ResultInterpretation</option>
                            <option value="testMethod">TestMethod</option>
                            <option value="testKitManufacturer">TestKitManufacturer</option>
                            <option value="testSystemManufacturer">TestSystemManufacturer</option>
                            <option value="diagnosis">Diagnosis</option>
                            <option value="icd">ICD</option>
                            <option value="histologicalDiagnosis">HistologicalDiagnosis</option>
                            <option value="organ">Organ</option>
                            <option value="collectionCountry">CollectionCountry</option>
                            <option value="collectionDate">CollectionDate</option>
                        </select>
                    </>
                }
                    
                {/*different interfaces for filter*/}
                {filtertype === 'single' &&
                    <div>
                        <h5>Value</h5>
                        <input className={styles.filterInput} onChange={handleChange} name="value" value={filter.value || ''} type="text"/>
                        <h5>Exact?<input onChange={handleChange} type="checkbox" name="exact" checked={filter.exact}/></h5>
                    </div>
                }
                {filtertype === 'range' &&
                    <div>
                        <h5>From</h5>
                        <input className={styles.filterInput} onChange={handleChange} name="fromVal" value={filter.fromVal || ''} type="text"/>
                        <h5>To</h5>
                        <input className={styles.filterInput} onChange={handleChange} name="toVal" value={filter.toVal || ''} type="text"/>
                    </div>
                }
                {filtertype === 'compare' &&
                    <div>
                        <h5>Value</h5>
                        <input className={styles.filterInput} onChange={handleChange} name="value" value={filter.value || ''} type="text"/>
                        <h5>Before?<input onChange={handleChange} type="checkbox" name="before" checked={filter.before}/></h5> 
                    </div>
                }
                <button className={styles.button_green} onClick={handleSubmit}>Apply</button>
            </Popover.Body>    
        </Popover>
    )
}

const PopoverButton = (props) => {
    const initialFilter = { col: "", value: "", exact: false, fromVal: "", toVal: "", before: false}

    const [filter,setFilter] = useState(initialFilter)
    const [filtertype, setfiltertype] = useState('single')

    const handleChange = (e) => {

        switch (e.target.name) {
            case "col":
                setFilter({
                    ...filter,
                    col: e.target.value
                })
                break
            case "value":
                setFilter({
                    ...filter,
                    value: e.target.value
                })
                break
            case "exact":
                setFilter({
                    ...filter,
                    exact: !filter.exact
                })
                break
            case "fromVal":
                setFilter({
                    ...filter,
                    fromVal: e.target.value
                })
                break
            case "toVal":
                setFilter({
                    ...filter,
                    toVal: e.target.value
                })
                break
            case "before":
                setFilter({
                    ...filter,
                    before: !filter.before
                })
                break     
            default:
                alert(`Error: Attribute ${e.target.name} of filter not found`)
                break
        }
    };

    const handleChangeFiltertype = (e) => {
        setfiltertype(e.target.value)
    };

    const handleSubmit = () => {
        var newFilter = []
        switch(filtertype){
            case "single":
                if(!filter.col || !filter.value){
                    alert("All inputs have to be valid")
                    return
                } else {
                    if(filter.exact) {
                        newFilter[0] = filter.col + " LIKE '" + filter.value + "'"
                        newFilter[1] = filter.col + " = " + filter.value
                    } else {
                        newFilter[0] = filter.col + " LIKE '%" + filter.value + "%'"
                        newFilter[1] = filter.col + ` = "` + filter.value + `"`
                    }
                }
                break
            case "range":
                if(!filter.col || !filter.fromVal || !filter.toVal){
                    alert("All inputs have to be valid")
                    return
                } else {
                    newFilter[0] = filter.col + " BETWEEN '" + filter.fromVal + "' AND '" + filter.toVal + "'"
                    newFilter[1] = filter.fromVal + " < " + filter.col + " < " + filter.toVal
                }
                break
            case "compare":
                if(!filter.col || !filter.value){
                    alert("All inputs have to be valid")
                    return
                } else {
                    if(filter.before) {
                        newFilter[0] = filter.col + " < '" + filter.value +"'"
                        newFilter[1] = filter.col + " < " + filter.value
                    } else {
                        newFilter[0] = filter.col + " > '" + filter.value +"'"
                        newFilter[1] = filter.col + " > " + filter.value
                    }
                }
                break
            default:
                alert(`Error: Filter ${filtertype} not found`)
                return
        }
        
        props.addFilter(newFilter)
        setFilter(initialFilter)
    }

    return(
        <OverlayTrigger trigger="click" placement="left" rootClose="true" overlay={FilterOverlay(handleChange, handleChangeFiltertype, handleSubmit, filtertype, filter, props.table)}>
            <button className={styles.button_popover}>+</button>
        </OverlayTrigger>
    )
};

export default PopoverButton;
