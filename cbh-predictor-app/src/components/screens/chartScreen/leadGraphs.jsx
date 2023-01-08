import React, { useState, useEffect } from "react";
import { PieChart } from "./charts/pieChart";
import { LineChart } from "./charts/lineChart";
import Constants from "../../../utilities/Constants";
import styles from "./graphs.module.css"
import axios from "axios";

var primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']
var secondaryScheme = ['#d15454','#e16c7c','#ec86a1','#f4a2c3','#f9bee1','#ffd9fa','#e6b2e3','#cc8bce','#b066bb','#9140a8','#711496']

//// MAPPING FUNCTIONS ////
function getMedicalField(entries, minField, showOthers) {
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
            if(data[i].id === "Other"){
                others +=  data[i].value
                data.splice(i, 1)
                i--
            }
        }
    }

    if(showOthers) {
        data.push({
            id: "others",
            name: "others",
            value: others
        })
    }

    return data
}

function getLeadStatus(entries, showOthers) {
    const data = []
    var others = 0    

    entries.map(function(entry){
        if(data.find(e => e.id === entry.leadStatus)) {
            data[data.findIndex((e => e.id === entry.leadStatus))].value++
        } else {
            data.push({
                id: entry.leadStatus,
                name: entry.leadStatus,
                value: 1
            })
        }
    })

    for(let i = 0; i <= data.length; i++){
        if(data[i]){
            if(data[i].id === null){
                others += data[i].value
                data.splice(i, 1)
                i--
            }
            if(data[i].id === "Other"){
                others +=  data[i].value
                data.splice(i, 1)
                //i--
            }
            var _value = data[i].value
            data[i].value = Math.trunc(((_value / entries.length - 1) + 1 ) * 100) 
        }
    }

    if(showOthers) {
        data.push({
            id: "others",
            name: "others",
            value: others
        })
        data[data.findIndex((e => e.id === "others"))].value = Math.trunc(((_value / entries.length - 1) + 1 ) * 100) 
    }

    return data
}

function getLeadsOverTime(entries) {
    const data = [{
        id: "dates",
        color: "hsl(48, 70%, 50%)",
        data: []
    }]

    entries.map(function(entry){
        if(data[0].data.find(e => e.x === truncateTime(entry.leadDate))) {
            data[0].data[data[0].data.findIndex((e => e.x === truncateTime(entry.leadDate)))].y++
        } else {
            data[0].data.push({
                x: truncateTime(entry.leadDate),
                y: 1
            })
        }
    })
      data.sort((a,b) => a[1] - b[1]);

    return data
}

function truncateTime(str) {
    return str.slice(0, 10)
} 

//// RENDER VIEW ////
const LeadChart = (props) => {
    const [minField, setMinField] = useState(10)
    const [showOtherFields, setShowOtherFields] = useState(false)
    const [showOthers, setShowOthers] = useState(true)
    const [allEntries, setAllEntries] = useState([])
    const [latestDate, setLatestDate] = useState([])

    useEffect(() => {
        const url = Constants.API_URL_LEAD_ENTRIES;

        axios.get(url)
        .then(res => {
            setAllEntries(res.data);
        })

        axios.get([url,'/GetCurrentMonth'].join(''))
        .then(res => {
            setLatestDate(res.data.split('-'))
        })
    }, [])

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
        <>
            <button onClick={() => {props.setShowGraphs(false); props.setActiveTable('')}} className={styles.button_backarrow}>&#60;</button>
            <div className={styles.grid_container_2_items_3_rows}>
                <div className={styles.settings}>
                    Period:
                    <select>
                        <option defaultValue={true}>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>Last Year</option>
                        <option>All Time</option>
                    </select>
                    Show Others
                    <input type="checkbox" onChange={() => setShowOthers(!showOthers)}></input>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Customer Fields</h3>
                    <PieChart data={getMedicalField(allEntries, minField, showOthers)} scheme={primaryScheme}/>
                    <div className={styles.min}>Min. Occurrences: <input className={styles.min_input} value={minField} name="minField" type="number" onChange={onInputChange}/></div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Status in %</h3>
                    <PieChart data={getLeadStatus(allEntries, showOthers)} scheme={secondaryScheme}/>
                </div>
                <div className={styles.center_wrapper}>
                    <h3>Lead Requests Over Time</h3>
                    <LineChart data={getLeadsOverTime(allEntries)} scheme={primaryScheme}/>
                </div>
            </div>
        </>
    )
}

export default LeadChart