import React, { useState, useEffect } from "react";
import { PieChart } from "./charts/pieChart";
import Constants from "../../../utilities/Constants";
import styles from "./graphs.module.css"
import axios from "axios";

var primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']

//// MAPPING FUNCTIONS ////
function getMatrices(entries, minMatrix, showOtherMatrices) {
    const data = []
    var others = 0

    entries.map(function(entry){
        if(data.find(e => e.id === entry.matrix)) {
            data[data.findIndex((e => e.id === entry.matrix))].value++
        } else {
            data.push({
                id: entry.matrix,
                name: entry.matrix,
                value: 1
            })
        }
    })

    for(let i = 0; i <= data.length; i++){
        if(data[i]){
            if(data[i].value < minMatrix){
                others += data[i].value
                data.splice(i, 1)
                i--
            }
        }
    }

    if(showOtherMatrices) {
        data.push({
            id: "others",
            name: "others",
            value: others
        })
    }
    return data
}

function getLabParameter(entries, minParam, showOtherParam) {
    const data = []
    var others = 0

    entries.map(function(entry){
        if(data.find(e => e.id === entry.labParameter)) {
            data[data.findIndex((e => e.id === entry.labParameter))].value++
        } else if (entry.labParameter != null) {
            data.push({
                id: entry.labParameter,
                name: entry.labParameter,
                value: 1
            })
        }
    })

    for(let i = 0; i <= data.length; i++){
        if(data[i]){
            if(data[i].value < minParam){
                others += data[i].value
                data.splice(i, 1)
                i--
            }
        }
    }

    if(showOtherParam) {
        data.push({
            id: "others",
            name: "others",
            value: others
        })
    }

    return data
}

function getDiagnosis(entries, minDiag, showOtherDiag) {
    const data = []
    var others = 0

    entries.map(function(entry){
        if(data.find(e => e.id === entry.diagnosis)) {
            data[data.findIndex((e => e.id === entry.diagnosis))].value++
        } else if(entry.diagnosis != null) {             
            data.push({
                id: entry.diagnosis,
                name: entry.diagnosis,
                value: 1
            })            
        }
    })

    for(let i = 0; i <= data.length; i++){
        if(data[i]){
            if(data[i].value < minDiag){
                others += data[i].value
                data.splice(i, 1)
                i--
            }
        }
    }

    if(showOtherDiag) {
        data.push({
            id: "others",
            name: "others",
            value: others
        })
    }

    return data
}

//// RENDER VIEW ////
const OrderChart = () => {
    const [minMatrix, setMinMatrix] = useState(150)
    const [showOtherMatrices, setShowOtherMatrices] = useState(false)
    const [minParam, setMinParam] = useState(150)
    const [showOtherParam, setShowOtherParam] = useState(false)
    const [minDiag, setMinDiag] = useState(150)
    const [showOtherDiag, setShowOtherDiag] = useState(false)

    const onInputChange = (e) => {
        switch(e.target.name){
            case 'minMatrix':
                setMinMatrix(e.target.value)
                return
            case 'minParam':
                setMinParam(e.target.value)
                return
            case 'minDiag':
                setMinDiag(e.target.value)
                return
            case 'showOtherMatrices':
                setShowOtherMatrices(!showOtherMatrices)
                return
            case 'showOtherParam':
                setShowOtherParam(!showOtherParam)
                return
            case 'showOtherDiag':
                setShowOtherDiag(!showOtherDiag)
                return
            default:
                return
        }
    }

    return(
        <div className={styles.grid_container}>
            <div className={styles.impressions_wrapper}>
                <h3>Matrix</h3>
                <PieChart data={GetAllEntries('matrix', minMatrix, showOtherMatrices)} scheme={primaryScheme}/>
                <div className={styles.min}>Min. Occurrences: <input className={styles.min_input} value={minMatrix} name="minMatrix" type="number" onChange={onInputChange}/> <input type="checkbox" className={styles.min_input} value={showOtherMatrices} name="showOtherMatrices" onChange={onInputChange}/> </div>
            </div>
            <div className={styles.clicks_wrapper}>
                <h3>Lab Parameters</h3>
                <PieChart data={GetAllEntries('labParameter', minParam, showOtherParam)} scheme={primaryScheme}/>
                <div className={styles.min}>Min. Occurrences: <input className={styles.min_input} value={minParam} name="minParam" type="number" onChange={onInputChange}/> <input type="checkbox" className={styles.min_input} value={showOtherParam} name="showOtherParam" onChange={onInputChange}/> </div>
            </div>
            <div className={styles.impressions_wrapper}>
                <br/><br/><br/><br/>
                <h3>Diagnosis</h3>
                <PieChart data={GetAllEntries('diagnosis', minDiag, showOtherDiag)} scheme={primaryScheme}/>
                <div className={styles.min}>Min. Occurrences: <input className={styles.min_input} value={minDiag} name="minDiag" type="number" onChange={onInputChange}/> <input type="checkbox" className={styles.min_input} value={showOtherDiag} name="showOtherDiag" onChange={onInputChange}/> </div>
            </div>
        </div>       
    )
}

//// GETTER METHODS ////
function GetAllEntries(type, prop1, prop2){
    const url = Constants.API_URL_ORDER_ENTRIES;
    const [entries, setEntries] = useState([])

    useEffect(() => {
        axios.get(url)
        .then(res => {
            setEntries(res.data);
        })
    }, [])

    switch(type){
        case 'matrix':
            return getMatrices(entries, prop1, prop2)
        case 'labParameter':
            return getLabParameter(entries, prop1, prop2)
        case 'diagnosis':
            return getDiagnosis(entries, prop1, prop2)
        default:
            return
    }
}

export default OrderChart