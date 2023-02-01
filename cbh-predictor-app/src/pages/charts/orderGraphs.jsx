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
function GetMatrices(minMatrix, maxMatrix, showOthers, dates, period) {
    const [data, setData] = useState([])
    const [entries, setEntries] = useState([])
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }

    useEffect(() => {
        if(dates.length > 0){
            var filter

            if(period > dates.length || period === -1) filter = []
            else filter = [[`orderDate >= '${dates[interval]}-01'`, null]]

            let sort = "ORDER BY orderDate DESC"

            const url = `${Constants.API_URL_ORDER_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[dates, period])

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

        newData.sort((a,b) => b.value - a.value)

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

function GetDiagnosis(minDiagnoses, maxDiagnoses, showOthers, dates, period) {
    const [data, setData] = useState([])
    const [entries, setEntries] = useState([])
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }

    useEffect(() => {
        if(dates.length > 0){
            var filter

            if(period > dates.length || period === -1) filter = []
            else filter = [[`orderDate >= '${dates[interval]}-01'`, null]]

            let sort = "ORDER BY orderDate DESC"

            const url = `${Constants.API_URL_ORDER_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[dates, period])

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

        newData.sort((a,b) => b.value - a.value)

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

function GetSampleSizes(minSampleSize, showOthers, dates, period) {
    const [data, setData] = useState([])
    const [entries, setEntries] = useState([])
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }

    useEffect(() => {
        if(dates.length > 0){
            var filter

            if(period > dates.length || period === -1) filter = []
            else filter = [[`orderDate >= '${dates[interval]}-01'`, null]]

            let sort = "ORDER BY orderDate DESC"

            const url = `${Constants.API_URL_ORDER_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[dates, period])

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

        newData.sort((a,b) => b.value - a.value)

        if(showOthers) {
            newData.push({
                id: "others",
                name: "others",
                value: others
            })
        }

        setData(newData)
    }, [entries, minSampleSize])

    return data
}

function GetLabParameter(minParams, maxParams, showOthers, dates, period) {
    const [data, setData] = useState([])
    const [entries, setEntries] = useState([])
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }

    useEffect(() => {
        if(dates.length > 0){
            var filter

            if(period > dates.length || period === -1) filter = []
            else filter = [[`orderDate >= '${dates[interval]}-01'`, null]]

            let sort = "ORDER BY orderDate DESC"

            const url = `${Constants.API_URL_ORDER_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[dates, period])

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

        newData.sort((a,b) => b.value - a.value)

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

function GetLabResult(showOthers, dates, period) {
    const [data, setData] = useState([])
    const [entries, setEntries] = useState([])
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }

    useEffect(() => {
        if(dates.length > 0){
            var filter

            if(period > dates.length || period === -1) filter = []
            else filter = [[`orderDate >= '${dates[interval]}-01'`, null]]

            let sort = "ORDER BY orderDate DESC"

            const url = `${Constants.API_URL_ORDER_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[dates, period])

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
        
        newData.sort((a,b) => b.value - a.value)
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

function GetOrders(dates, period) {
    const [data, setData] = useState([])
    const [entries, setEntries] = useState([])
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }

    useEffect(() => {
        if(dates.length > 0){
            var filter

            if(period > dates.length) filter = []
            else filter = [[`orderDate >= '${dates[interval]}-01'`, null]]

            let sort = "ORDER BY orderDate DESC"

            const url = `${Constants.API_URL_ORDER_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[dates, period])

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
        newData[0].data.reverse()

        setData(newData)
    }, [entries])
    return data
}

function truncateTimeMonth(str) {
    return str.slice(0, 7)
}

async function getData(url, body, setEntries){
    const result = await axiosApiInstance.post(url, body, {'Content-Type': 'application/json'})
    if(result.status === 200){
        setEntries(result.data)
    }
}

//// RENDER VIEW ////
const OrderChart = () => {
    const [min, setMin] = useState([150, 150, 150, 150])
    const [max, setMax] = useState([7000, 1000, 800])
    const [showOthers1, setShowOthers1] = useState(true)
    const [showOthers2, setShowOthers2] = useState(true)    
    const [periods, setPeriods] = useState([0, 0, 2])
    const [dates, setDates] = useState([])

    const user = authService.getCurrentUser()
    const navigate = useNavigate()

    useEffect(() => {
        if(!user) navigate("/login")

        const url = `${Constants.API_URL_ORDER_ENTRIES}/dates`
        getDates(url)
    },[])

    const minChange = (e) => {
        let newMin = [...min]
        newMin[e.target.name] = e.target.value
        setMin(newMin)
    }

    const maxChange = (e) => {
        let newMax = [...max]
        newMax[e.target.name] = e.target.value
        setMax(newMax)
    }

    const onPeriodChange = (e, index) => {
        let newPeriods = periods.map(period => { return period })
        newPeriods[index] = parseInt(e.target.value)
        setPeriods(newPeriods)
    }

    return(
        <div className={styles.body}>
            <button onClick={() => navigate("/")} className={styles.button_backarrow}>&#60;</button>        
            {/* First Block */}
            <div className={styles.grid_container_3_items}>
                <div className={styles.settings}>
                    Period:
                    <select onChange={(e) => onPeriodChange(e, 0)}>
                        <option defaultValue={true} value={0}>Last Month</option>
                        <option value={2}>Last 3 Months</option>
                        <option value={11}>Last Year</option>
                        <option value={-1}>All Time</option>
                    </select>
                    Show Others
                    <input type="checkbox" defaultChecked onChange={() => setShowOthers1(!showOthers1)}></input>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Frequent Matrices</h3>
                    <PieChart data={GetMatrices(min[0], max[0], showOthers1, dates, periods[0])} scheme={primaryScheme}/>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={min[0]} name={0} type="number" onChange={minChange}/> Max: <input className={styles.min_input} value={max[0]} name={0} type="number" onChange={maxChange}/></div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Frequent Diagnoses</h3>
                    <PieChart data={GetDiagnosis(min[1], max[1], showOthers1, dates, periods[0])} scheme={primaryScheme}/>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={min[1]} name={1} type="number" onChange={minChange}/> Max: <input className={styles.min_input} value={max[1]} name={1} type="number" onChange={maxChange}/></div>
                </div>
                <div className={styles.right_wrapper}>
                    <h3>Frequent Sample Sizes (in ml)</h3>
                    <PieChart data={GetSampleSizes(min[2], showOthers1, dates, periods[0])} scheme={primaryScheme}/>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={min[2]} name={2} type="number" onChange={minChange}/> </div>
                </div>
            </div>
            {/* Second Block */}
            <div className={styles.grid_container_2_items}>
                <div className={styles.settings}>
                Period:
                    <select onChange={(e) => onPeriodChange(e, 1)}>
                        <option defaultValue={true} value={0}>Last Month</option>
                        <option value={2}>Last 3 Months</option>
                        <option value={11}>Last Year</option>
                        <option value={-1}>All Time</option>
                    </select>
                    Show Others
                    <input type="checkbox" defaultChecked onChange={() => setShowOthers2(!showOthers2)}></input>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Lab Parameters</h3>
                    <PieChart data={GetLabParameter(min[3], max[2], showOthers2, dates, periods[1])} scheme={secondaryScheme}/>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={min[3]} name={3} type="number" onChange={minChange}/> Max: <input className={styles.min_input} value={max[2]} name={2} type="number" onChange={maxChange}/></div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Lab Results (in %)</h3>
                    <PieChart data={GetLabResult(showOthers2, dates, periods[1])} scheme={secondaryScheme}/>
                </div>
            </div>
            {/* Third Block */}
            <div className={styles.grid_container_3_items_1_row}>
                <div className={styles.settings}>
                Period:
                    <select onChange={(e) => onPeriodChange(e, 2)}>
                        <option defaultValue={true} value={2}>Last 3 Months</option>
                        <option value={5}>Last 6 Months</option>
                        <option value={11}>Last Year</option>
                    </select>
                </div>
                <div className={styles.center_wrapper_top}>
                    <br/>
                    <h3>Orders Over Time</h3>
                    <LineChart data={GetOrders(dates, periods[2])} scheme={primaryScheme}/>
                </div>
            </div>
        </div>
    )

    async function getDates(url){
        const result = await axiosApiInstance.get(url)
        if(result.status === 200){
            setDates(result.data)
        }
    }
}

export default OrderChart