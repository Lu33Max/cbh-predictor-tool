import React, { useState, useEffect } from "react";
import { PieChart } from "./charts/pieChart";
import { LineChart } from "./charts/lineChart";
import Constants from "../../../utilities/Constants";
import styles from "./graphs.module.css";
import axios from "axios";

var primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']
var secondaryScheme = ['#d15454','#e16c7c','#ec86a1','#f4a2c3','#f9bee1','#ffd9fa','#e6b2e3','#cc8bce','#b066bb','#9140a8','#711496']

//// MAPPING FUNCTIONS ////
function getMatrices(entries, minMatrix, maxMatrix, showOtherMatrices) {
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
            if(data[i].value < minMatrix || data[i].value > maxMatrix){
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

function getLabParameter(entries, minParams, maxParams, showOtherParams) {
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
            if(data[i].value < minParams || data[i].value > maxParams){
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

function getDiagnosis(entries, minDiagnoses, maxDiagnoses, showOtherDiagnoses) {
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
            if(data[i].value < minDiagnoses || data[i].value > maxDiagnoses){
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

function getAverageQuantity(entries, minDiagnoses, maxDiagnoses, showOtherDiagnoses) {
    const data = []
    var others = 0

    entries.map(function(entry){
        if(data.find(e => e.id === entry.unit)) {
            data[data.findIndex((e => e.id === entry.unit))].occurrences++
        } else if(entry.unit != null) {             
            data.push({
                id: entry.unit,
                name: entry.unit,
                value: 1,
                occurrences: 1
            })            
        }
    })

    // for(let i = 0; i <= data.length; i++){
    //     if(data[i]){
    //         if(data[i].id === "ml"){
    //             others += data[i].value
    //             data.splice(i, 1)
    //             i--
    //         }
    //     }
    // }

    // if(showOtherDiagnoses) {
    //     data.push({
    //         id: "others",
    //         name: "others",
    //         value: others
    //     })
    // }

    return data
}

function getResult(entries) {
    const data = []

    entries.map(function(entry){
        if(data.find(e => e.id === entry.resultInterpretation)) {
            data[data.findIndex((e => e.id === entry.resultInterpretation))].value++
        } else if(entry.resultInterpretation != null) {             
            data.push({
                id: entry.resultInterpretation,
                name: entry.resultInterpretation,
                value: 1
            })            
        }
    })

    for(let i = 0; i <= data.length; i++){
        if(data[i]){
            if(data[i].id === null || data[i].id === "detected" || data[i].id === "Detected" || data[i].id === "not detected"){
                data.splice(i, 1)
                i--
            }
            if(data[i].id === "Positive"){
                data[data.findIndex((e => e.id === "positive"))].value +=  data[i].value
                data.splice(i, 1)
                //i--
            }
            if(data[i].id === "Negative"){
                data[data.findIndex((e => e.id === "negative"))].value +=  data[i].value
                data.splice(i, 1)
                //i--
            }
            var _value = data[i].value
            //data[i].value = Math.trunc(((_value / entries.length - 1) + 1 ) * 100) 
        }
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
        if(data[0].data.find(e => e.x === truncateTime(entry.orderDate))) {
            data[0].data[data[0].data.findIndex((e => e.x === truncateTime(entry.orderDate)))].y++
        } else {
            data[0].data.push({
                x: truncateTime(entry.orderDate),
                y: 1
            })
        }
    })
    data[0].data.sort((a,b) => a[1] - b[1]);

    return data
}

function truncateTime(str) {
    return str.slice(0, 10)
} 

//// RENDER VIEW ////
const OrderChart = (props) => {
    const [minMatrix, setMinMatrix] = useState(150)
    const [maxMatrix, setMaxMatrix] = useState(400)
    const [showOtherMatrices, setShowOtherMatrices] = useState(false)
    const [minParams, setMinParams] = useState(150)
    const [maxParams, setMaxParams] = useState(1000)
    const [showOtherParams, setShowOtherParam] = useState(false)
    const [minDiagnoses, setMinDiagnoses] = useState(150)
    const [maxDiagnoses, setMaxDiagnoses] = useState(400)
    const [showOtherDiagnoses, setShowOtherDiagnoses] = useState(false)

    const onInputChange = (e) => {
        switch(e.target.name){
            case 'minMatrix':
                setMinMatrix(e.target.value)
                return
            case 'maxMatrix':
                setMaxMatrix(e.target.value)
                return
            case 'showOtherMatrices':
                setShowOtherMatrices(!showOtherMatrices)
                return
            case 'minParams':
                setMinParams(e.target.value)
                return
            case 'maxParams':
                setMaxParams(e.target.value)
                return
            case 'showOtherParams':
                setShowOtherParam(!showOtherParams)
                return
            case 'minDiagnoses':
                setMinDiagnoses(e.target.value)
                return
            case 'maxDiagnoses':
                setMaxDiagnoses(e.target.value)
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
            {/* First Block */}
            <div className={styles.grid_container_2_items}>
                <div className={styles.settings}>
                    Period:
                    <select>
                        <option defaultValue={true}>Last 3 Months</option>
                        <option>Last Year</option>
                        <option>All Time</option>
                    </select>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Matrix</h3>
                    <PieChart data={GetAllEntries('matrix', minMatrix, maxMatrix, showOtherMatrices)} scheme={primaryScheme}/>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={minMatrix} name="minMatrix" type="number" onChange={onInputChange}/> Max: <input className={styles.min_input} value={maxMatrix} name="maxMatrix" type="number" onChange={onInputChange}/></div>
                    <div className={styles.min}>Show Others: <input type="checkbox" value={showOtherMatrices} name="showOtherMatrices" onChange={onInputChange}/> </div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Diagnosis</h3>
                    <PieChart data={GetAllEntries('diagnosis', minDiagnoses, maxDiagnoses, showOtherDiagnoses)} scheme={primaryScheme}/>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={minDiagnoses} name="minDiagnoses" type="number" onChange={onInputChange}/> Max: <input className={styles.min_input} value={maxDiagnoses} name="maxDiagnoses" type="number" onChange={onInputChange}/></div>
                    <div className={styles.min}>Show Others: <input type="checkbox" value={showOtherDiagnoses} name="showOtherDiagnoses" onChange={onInputChange}/> </div>
                </div>
            </div>        
            {/* Second Block */}
            <div className={styles.grid_container_2_items}>
                <div className={styles.settings}>
                    Period:
                    <select>
                        <option defaultValue={true}>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>Last Year</option>
                    <   option>All Time</option>
                    </select>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Lab Parameters</h3>
                    <PieChart data={GetAllEntries('labParameter', minParams, maxParams, showOtherParams)} scheme={secondaryScheme}/>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={minParams} name="minParams" type="number" onChange={onInputChange}/> Max: <input className={styles.min_input} value={maxParams} name="maxParams" type="number" onChange={onInputChange}/></div>
                    <div className={styles.min}>Show Others: <input type="checkbox" value={showOtherParams} name="showOtherParams" onChange={onInputChange}/> </div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Lab Result</h3>
                    <PieChart data={GetAllEntries('Result_Interpretation', minDiagnoses, maxDiagnoses, showOtherDiagnoses)} scheme={primaryScheme}/>
                </div>
            </div>
            <div className={styles.grid_container_3_items_1_rows}>
            <div className={styles.settings}>
                    Period:
                    <select>
                        <option defaultValue={true}>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>Last Year</option>
                    <   option>All Time</option>
                    </select>
                </div>
                <div className={styles.center_wrapper_top}>
                <br/>
                <h3>Orders Over Time</h3>
                <LineChart data={GetAllEntries('date')} scheme={primaryScheme}/>
            </div>
        </div>
    </>
    )
}

//// GETTER METHODS ////
function GetAllEntries(type, prop1, prop2, prop3){
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
            return getMatrices(entries, prop1, prop2, prop3)
        case 'labParameter':
            return getLabParameter(entries, prop1, prop2, prop3)
        case 'diagnosis':
            return getDiagnosis(entries, prop1, prop2, prop3)
        case 'Result_Interpretation':
            return getResult(entries)
        case 'date':
            return getOrders(entries)
        default:
            return
    }
}

export default OrderChart