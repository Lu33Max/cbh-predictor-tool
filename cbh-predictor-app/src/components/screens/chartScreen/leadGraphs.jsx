import React, { useState, useEffect } from "react";
import { PieChart } from "./charts/pieChart";
import { LineChart } from "./charts/lineChart";
import Constants from "../../../utilities/Constants";
import styles from "./graphs.module.css"
import axios from "axios";

var primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']
var secondaryScheme = ['#d15454','#e16c7c','#ec86a1','#f4a2c3','#f9bee1','#ffd9fa','#e6b2e3','#cc8bce','#b066bb','#9140a8','#711496']

//// MAPPING FUNCTIONS ////
function GetMedicalField(entries, minField, showOthers) {
    const [data, setData] = useState([])

    useEffect(() => {
        const newData = []
        var others = 0

        entries.map(function(entry){
            if(newData.find(e => e.id === entry.fieldOfInterest)) {
                newData[newData.findIndex((e => e.id === entry.fieldOfInterest))].value++
            } else {
                newData.push({
                    id: entry.fieldOfInterest,
                    name: entry.fieldOfInterest,
                    value: 1
                })
            }
        })

        for(let i = 0; i <= newData.length; i++){
            if(newData[i]){
                if(newData[i].value < minField || newData[i].id === null || newData[i].id === "Other"){
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
    },[entries, minField, showOthers])

    return data
}

function GetLeadStatus(entries, showOthers) {
    const [data, setData] = useState([])

    useEffect(() => {
        const newData = []
        var others = 0    

        entries.map(function(entry){
            if(newData.find(e => e.id === entry.leadStatus)) {
                newData[newData.findIndex((e => e.id === entry.leadStatus))].value++
            } else {
                newData.push({
                    id: entry.leadStatus,
                    name: entry.leadStatus,
                    value: 1
                })
            }
        })

        for(let i = 0; i <= newData.length; i++){
            if(newData[i]){
                if(newData[i].id === null || newData[i].id === "Other"){
                    others += newData[i].value
                    newData.splice(i, 1)
                    i--
                } else {
                    var _value = newData[i].value
                    newData[i].value = Math.trunc(((_value / entries.length - 1) + 1 ) * 100)
                }
            }
        }

        if(showOthers) {
            newData.push({
                id: "others",
                name: "others",
                value: others
            })
            newData[newData.findIndex((e => e.id === "others"))].value = Math.trunc(((_value / entries.length - 1) + 1 ) * 100) 
        }

        setData(newData)
    }, [entries, showOthers])

    return data
}

function GetLeadsOverTime(entries) {
    const [data, setData] = useState([])

    useEffect(() => {
        const newData = [{
            id: "dates",
            color: "hsl(48, 70%, 50%)",
            data: []
        }]

        entries.map(function(entry){
            if(entry.leadDate){
                if(newData[0].data.find(e => e.x === truncateTimeMonth(entry.leadDate))) {
                    newData[0].data[newData[0].data.findIndex((e => e.x === truncateTimeMonth(entry.leadDate)))].y++
                } else {
                    newData[0].data.push({
                        x: truncateTimeMonth(entry.leadDate),
                        y: 1
                    })
                }
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
const LeadChart = (props) => {
    const [minField, setMinField] = useState(10)
    const [showOtherFields, setShowOtherFields] = useState(false)
    const [showOthers, setShowOthers] = useState(true)
    const [allEntries, setAllEntries] = useState([])

    useEffect(() => {
        const url = Constants.API_URL_LEAD_ENTRIES;

        axios.get(url)
        .then(res => {
            setAllEntries(res.data);
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
                    <PieChart data={GetMedicalField(allEntries, minField, showOthers)} scheme={primaryScheme}/>
                    <div className={styles.min}>Min. Occurrences: <input className={styles.min_input} value={minField} name="minField" type="number" onChange={onInputChange}/></div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Lead Status in %</h3>
                    <PieChart data={GetLeadStatus(allEntries, showOthers)} scheme={secondaryScheme}/>
                </div>
                <div className={styles.center_wrapper}>
                    <h3>Lead Requests Over Time</h3>
                    <LineChart data={GetLeadsOverTime(allEntries)} scheme={primaryScheme}/>
                </div>
            </div>
        </>
    )
}

export default LeadChart