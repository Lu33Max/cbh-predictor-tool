import React, { useState, useEffect } from "react";
import { PieChart } from "./charts/pieChart";
import Constants from "../../../utilities/Constants";
import styles from "./graphs.module.css"
import axios from "axios";

var primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']

//// MAPPING FUNCTIONS ////
function getMedicalField(entries, minField, showOtherFields) {
    const data = []
    var others = 0

    entries.map(function(entry){
        if(data.find(e => e.id === entry.fieldOfInterest)) {
            data[data.findIndex((e => e.id === entry.fieldOfInterest))].value++
        } else {
            data.push({
                id: entry.fieldOfInterest,
                name: entry.fieldOfInterest,
                value: 1
            })
        }
    })

    for(let i = 0; i <= data.length; i++){
        if(data[i]){
            if(data[i].value < minField || data[i].id === null){
                others += data[i].value
                data.splice(i, 1)
                i--
            }
        }
    }

    if(showOtherFields) {
        data.push({
            id: "others",
            name: "others",
            value: others
        })
    }

    return data
}

//// RENDER VIEW ////
const LeadChart = () => {
    const [minField, setMinField] = useState(10)
    const [showOtherFields, setShowOtherFields] = useState(false)

    const onInputChange = (e) => {
        switch(e.target.name){
            case 'minField':
                setMinField(e.target.value)
                return
            case 'showOtherFields':
                setShowOtherFields(!showOtherFields)
                return
            default:
                return
        }
    }

    return(
        <div className={styles.grid_container}>
            <div className={styles.left_wrapper}>
                <h3>Customer Fields</h3>
                <PieChart data={GetAllEntries('Field_of_interest', minField, showOtherFields)} scheme={primaryScheme}/>
                <div className={styles.min}>Min. Occurrences: <input className={styles.min_input} value={minField} name="minField" type="number" onChange={onInputChange}/> <input type="checkbox" className={styles.min_input} value={showOtherFields} name="showOtherFields" onChange={onInputChange}/> </div>
            </div>
        </div>
    )
}

//// GETTER METHODS ////
function GetAllEntries(type, prop1, prop2){
    const url = Constants.API_URL_LEAD_ENTRIES;
    const [entries, setEntries] = useState([])

    useEffect(() => {
        axios.get(url)
        .then(res => {
            setEntries(res.data);
        })
    }, [])

    switch(type){
        case 'Field_of_interest':
            return getMedicalField(entries, prop1, prop2)
    }
}

export default LeadChart