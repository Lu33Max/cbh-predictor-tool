import React, { useState, useEffect } from "react";
import { PieChart } from "./charts/pieChart";
import { LineChart } from "./charts/lineChart";
import Constants from "../../../utilities/Constants";
import styles from "./graphs.module.css";
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

function getLabParameter(entries, minParams, showOtherParams) {
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
            if(data[i].value < minParams){
                others += data[i].value
                data.splice(i, 1)
                i--
            }
        }
    }

    if(showOtherParams) {
        data.push({
            id: "others",
            name: "others",
            value: others
        })
    }

    return data
}

function getDiagnosis(entries, minDiagnoses, showOtherDiagnoses) {
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
            if(data[i].value < minDiagnoses){
                others += data[i].value
                data.splice(i, 1)
                i--
            }
        }
    }

    if(showOtherDiagnoses) {
        data.push({
            id: "others",
            name: "others",
            value: others
        })
    }

    return data
}

function getOrders(entries) {
    const data = [{
        id: "dates",
        color: "hsl(48, 70%, 50%)",
        data: []
    }]

    entries.map(function(entry){
        if(data[0].data.find(e => e.x === entry.orderDate)) {
            data[0].data[data[0].data.findIndex((e => e.x === entry.orderDate))].y++
        } else {
            data[0].data.push({
                x: entry.orderDate,
                y: 1
            })
        }
    })

    return data
}

//// RENDER VIEW ////
const OrderChart = (props) => {
    const [minMatrix, setMinMatrix] = useState(150)
    const [showOtherMatrices, setShowOtherMatrices] = useState(false)
    const [minParams, setMinParams] = useState(150)
    const [showOtherParams, setShowOtherParam] = useState(false)
    const [minDiagnoses, setMinDiagnoses] = useState(150)
    const [showOtherDiagnoses, setShowOtherDiagnoses] = useState(false)

    const onInputChange = (e) => {
        switch(e.target.name){
            case 'minMatrix':
                setMinMatrix(e.target.value)
                return
            case 'showOtherMatrices':
                setShowOtherMatrices(!showOtherMatrices)
                return
            case 'minParams':
                setMinParams(e.target.value)
                return
            case 'showOtherParams':
                setShowOtherParam(!showOtherParams)
                return
            case 'minDiagnoses':
                setMinDiagnoses(e.target.value)
                return
            case 'showOtherDiagnoses':
                setShowOtherDiagnoses(!showOtherDiagnoses)
                return
            default:
                return
        }
    }

    return(
        <>
        <button onClick={() => {props.setShowGraphs(false); props.setActiveTable('')}} className={styles.button_backarrow}>&#60;</button>
        <div className={styles.grid_container_order}>
            <div className={styles.left_wrapper}>
                <h3>Matrix</h3>
                <PieChart data={GetAllEntries('matrix', minMatrix, showOtherMatrices)} scheme={primaryScheme}/>
                <div className={styles.min}>Min. Occurrences: <input className={styles.min_input} value={minMatrix} name="minMatrix" type="number" onChange={onInputChange}/></div>
                <div className={styles.min}>Show Section "others": <input type="checkbox" value={showOtherMatrices} name="showOtherMatrices" onChange={onInputChange}/> </div>
            </div>
            <div className={styles.middle_wrapper}>
                <h3>Lab Parameters</h3>
                <PieChart data={GetAllEntries('labParameter', minParams, showOtherParams)} scheme={primaryScheme}/>
                <div className={styles.min}>Min. Occurrences: <input className={styles.min_input} value={minParams} name="minParams" type="number" onChange={onInputChange}/> </div>
                <div className={styles.min}>Show Section "others": <input type="checkbox" value={showOtherParams} name="showOtherParams" onChange={onInputChange}/> </div>

            </div>
            <div className={styles.right_wrapper}>
                <h3>Diagnosis</h3>
                <PieChart data={GetAllEntries('diagnosis', minDiagnoses, showOtherDiagnoses)} scheme={primaryScheme}/>
                <div className={styles.min}>Min. Occurrences: <input className={styles.min_input} value={minDiagnoses} name="minDiagnoses" type="number" onChange={onInputChange}/> </div>
                <div className={styles.min}>Show Section "others": <input type="checkbox" value={showOtherDiagnoses} name="showOtherDiagnoses" onChange={onInputChange}/> </div>
            </div>
            <div className={styles.center_wrapper}>
                <h3>Test</h3>
                <LineChart data={GetAllEntries('date')} scheme={primaryScheme}/>
                <div className={styles.min}>Test: </div>
            </div>
        </div>
    </>
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
        case 'date':
            return getOrders(entries)
        default:
            return
    }
}

export default OrderChart