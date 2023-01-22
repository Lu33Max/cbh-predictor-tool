import React, { useState, useEffect } from "react";
import { PieChart } from "../../components/charts/pieChart";
import { LineChart } from "../../components/charts/lineChart";
import Constants from "../../utilities/Constants";
import styles from "./graphs.module.css";
import axiosApiInstance from "../../services/interceptor";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";

var primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']
var secondaryScheme = ['#d15454','#e16c7c','#ec86a1','#f4a2c3','#f9bee1','#ffd9fa','#e6b2e3','#cc8bce','#b066bb','#9140a8','#711496']

//// MAPPING FUNCTIONS ////
function GetMatrices(entries, minMatrix, maxMatrix, showOthers) {
    const [data, setData] = useState([])

    useEffect(() => {
        const newData = []
        var others = 0

        entries.map(function(entry){
            if(newData.find(e => e.id === entry.matrix)) {
                newData[newData.findIndex((e => e.id === entry.matrix))].value++
            } else {
                newData.push({
                    id: entry.matrix,
                    name: entry.matrix,
                    value: 1
                })
            }
        })

        for(let i = 0; i <= newData.length; i++){
            if(newData[i]){
                if(newData[i].value < minMatrix || newData[i].value > maxMatrix){
                    others += newData[i].value
                    newData.splice(i, 1)
                    i--
                }
            }
        }

        if(showOthers) {
            newData.push({
                id: "others",
                name: "others",
                value: others
            })
        }

        setData(newData)
    }, [entries, minMatrix, maxMatrix, showOthers])

    return data
}

function GetDiagnosis(entries, minDiagnoses, maxDiagnoses, showOthers) {
    const [data, setData] = useState([])

    useEffect(() => {
        const newData = []
        var others = 0

        entries.map(function(entry){
            if(newData.find(e => e.id === entry.diagnosis)) {
                newData[newData.findIndex((e => e.id === entry.diagnosis))].value++
            } else if(entry.diagnosis != null) {             
                newData.push({
                    id: entry.diagnosis,
                    name: entry.diagnosis,
                    value: 1
                })            
            }
        })

        for(let i = 0; i <= newData.length; i++){
            if(newData[i]){
                if(newData[i].value < minDiagnoses || newData[i].value > maxDiagnoses){
                    others += newData[i].value
                    newData.splice(i, 1)
                    i--
                }
            }
        }

        if(showOthers) {
            newData.push({
                id: "others",
                name: "others",
                value: others
            })
        }

        setData(newData)
    }, [entries, minDiagnoses, maxDiagnoses, showOthers])

    return data
}

function GetLabParameter(entries, minParams, maxParams, showOthers) {
    const [data, setData] = useState([])

    useEffect(() => {
        const newData = []
        var others = 0

        entries.map(function(entry){
            if(newData.find(e => e.id === entry.labParameter)) {
                newData[newData.findIndex((e => e.id === entry.labParameter))].value++
            } else if (entry.labParameter != null) {
                newData.push({
                    id: entry.labParameter,
                    name: entry.labParameter,
                    value: 1
                })
            }
        })

        for(let i = 0; i <= newData.length; i++){
            if(newData[i]){
                if(newData[i].value < minParams || newData[i].value > maxParams){
                    others += newData[i].value
                    newData.splice(i, 1)
                    i--
                }
            }
        }

        if(showOthers) {
            newData.push({
                id: "others",
                name: "others",
                value: others
            })
        }

        setData(newData)
    }, [entries, minParams, maxParams, showOthers])

    return data
}

function GetSampleSizes(entries, minSampleSize) {
    const [data, setData] = useState([])

    useEffect(() => {
        const newData = []
        var others = 0

        entries.map(function(entry){
            if(newData.find(e => e.id === entry.quantity)) {
                newData[newData.findIndex((e => e.id === entry.quantity))].value++
            } else if(entry.quantity != null) {             
                newData.push({
                    id: entry.quantity,
                    name: entry.quantity,
                    value: 1,
                })            
            }
        })

        for(let i = 0; i <= newData.length; i++){
            if(newData[i]){
                if(newData[i].value < minSampleSize){
                    others += newData[i].value
                    newData.splice(i, 1)
                    i--
                }
            }
        }

        setData(newData)
    }, [entries, minSampleSize])

    return data
}

function GetLabResult(entries, showOthers) {
    const [data, setData] = useState([])

    useEffect(() => {
        const newData = []

        entries.map(function(entry){
            if(newData.find(e => e.id === entry.resultInterpretation)) {
                newData[newData.findIndex((e => e.id === entry.resultInterpretation))].value++
            } else if(entry.resultInterpretation != null) {             
                newData.push({
                    id: entry.resultInterpretation,
                    name: entry.resultInterpretation,
                    value: 1
                })            
            } 
        })

        for(let i = 0; i <= newData.length; i++){
            if(newData[i]){
                if(!(newData[i].id.toLowerCase() === "positive") && !(newData[i].id.toLowerCase() === "negative")){
                    newData.splice(i, 1)
                    i--
                } else if(newData[i].id === "Positive"){
                    newData[newData.findIndex((e => e.id === "positive"))].value +=  newData[i].value
                    newData.splice(i, 1)
                    i--
                } else if(newData[i].id === "Negative"){
                    newData[newData.findIndex((e => e.id === "negative"))].value +=  newData[i].value
                    newData.splice(i, 1)
                    i--
                }
            }
        }
        var others = 0

        for(let i = 0; i <= newData.length; i++){
            if(newData[i]){
                newData[i].value = Math.round((newData[i].value/entries.length + Number.EPSILON) * 100)
                others += newData[i].value
            }
        }
        
        others = 100 - others
        
        if(showOthers) {
            newData.push({
                id: "others",
                name: "others",
                value: others
            })
        }

        setData(newData)
    }, [entries, showOthers])

    return data
}

function GetOrders(entries) {
    const [data, setData] = useState([])

    useEffect(() => {
        const newData = [{
            id: "dates",
            color: "hsl(48, 70%, 50%)",
            data: []
        }]

        entries.map(function(entry){
            if(newData[0].data.find(e => e.x === truncateTimeMonth(entry.orderDate))) {
                newData[0].data[newData[0].data.findIndex((e => e.x === truncateTimeMonth(entry.orderDate)))].y++
            } else {
                newData[0].data.push({
                    x: truncateTimeMonth(entry.orderDate),
                    y: 1
                })
            }
        })
        setData(newData)
    }, [entries])
    return data
}

function truncateTimeMonth(str) {
    return str.slice(0, 7)
} 

//// RENDER VIEW ////
const OrderChart = () => {
    const [minMatrix, setMinMatrix] = useState(150)
    const [maxMatrix, setMaxMatrix] = useState(7000)
    const [minParams, setMinParams] = useState(150)
    const [maxParams, setMaxParams] = useState(1000)
    const [minDiagnoses, setMinDiagnoses] = useState(150)
    const [maxDiagnoses, setMaxDiagnoses] = useState(800)
    const [minSampleSize, setMinSampleSize] = useState(250)
    const [showOthers1, setShowOthers1] = useState(true)
    const [showOthers2, setShowOthers2] = useState(true)    
    const [allEntries, setAllEntries] = useState([])

    const user = authService.getCurrentUser()
    const navigate = useNavigate()

    useEffect(() => {
        if(!user) navigate("/login")
    },[])

    useEffect(() => {
        const url = Constants.API_URL_ORDER_ENTRIES;
        getEntries(url)
    }, [])

    const onInputChange = (e) => {
        switch(e.target.name){
            case 'minMatrix':
                setMinMatrix(e.target.value)
                return
            case 'maxMatrix':
                setMaxMatrix(e.target.value)
                return
            case 'minParams':
                setMinParams(e.target.value)
                return
            case 'maxParams':
                setMaxParams(e.target.value)
                return
            case 'minDiagnoses':
                setMinDiagnoses(e.target.value)
                return
            case 'maxDiagnoses':
                setMaxDiagnoses(e.target.value)
                return
            case 'minSampleSize':
                setMinSampleSize(e.target.value)
                return
            default:
                return
        }
    }

    return(
        <div className={styles.body}>
            <button onClick={() => navigate("/")} className={styles.button_backarrow}>&#60;</button>        
            {/* First Block */}
            <div className={styles.grid_container_3_items}>
                <div className={styles.settings}>
                    Period:
                    <select>
                        <option defaultValue={true}>Last 3 Months</option>
                        <option>Last Year</option>
                        <option>All Time</option>
                    </select>
                    Show Others
                    <input type="checkbox" defaultChecked onChange={() => setShowOthers1(!showOthers1)}></input>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Frequent Matrices</h3>
                    <PieChart data={GetMatrices(allEntries, minMatrix, maxMatrix, showOthers1)} scheme={primaryScheme}/>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={minMatrix} name="minMatrix" type="number" onChange={onInputChange}/> Max: <input className={styles.min_input} value={maxMatrix} name="maxMatrix" type="number" onChange={onInputChange}/></div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Frequent Diagnoses</h3>
                    <PieChart data={GetDiagnosis(allEntries, minDiagnoses, maxDiagnoses, showOthers1)} scheme={primaryScheme}/>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={minDiagnoses} name="minDiagnoses" type="number" onChange={onInputChange}/> Max: <input className={styles.min_input} value={maxDiagnoses} name="maxDiagnoses" type="number" onChange={onInputChange}/></div>
                </div>
                <div className={styles.right_wrapper}>
                    <h3>Frequent Sample Sizes (in ml)</h3>
                    <PieChart data={GetSampleSizes(allEntries, minSampleSize, showOthers1)} scheme={primaryScheme}/>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={minSampleSize} name="minSampleSize" type="number" onChange={onInputChange}/> </div>
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
                        <option>All Time</option>
                    </select>
                    Show Others
                    <input type="checkbox" defaultChecked onChange={() => setShowOthers2(!showOthers2)}></input>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Lab Parameters</h3>
                    <PieChart data={GetLabParameter(allEntries, minParams, maxParams, showOthers2)} scheme={secondaryScheme}/>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={minParams} name="minParams" type="number" onChange={onInputChange}/> Max: <input className={styles.min_input} value={maxParams} name="maxParams" type="number" onChange={onInputChange}/></div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Lab Results (in %)</h3>
                    <PieChart data={GetLabResult(allEntries, showOthers2)} scheme={secondaryScheme}/>
                </div>
            </div>
            {/* Third Block */}
            <div className={styles.grid_container_3_items_1_row}>
                <div className={styles.settings}>
                    Period:
                    <select>
                        <option defaultValue={true}>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>Last Year</option>
                        <option>All Time</option>
                    </select>
                </div>
                <div className={styles.center_wrapper_top}>
                    <br/>
                    <h3>Orders Over Time</h3>
                    <LineChart data={GetOrders(allEntries)} scheme={primaryScheme}/>
                </div>
            </div>
        </div>
    )

    async function getEntries(url){
        const result = await axiosApiInstance.get(url)
        setAllEntries(result.data)
    }
}

export default OrderChart