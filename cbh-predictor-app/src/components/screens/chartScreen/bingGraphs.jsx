import React, { useState, useEffect } from "react";
import { PieChart } from "./charts/pieChart";
import { LineChart } from "./charts/lineChart";
import Constants from "../../../utilities/Constants";
import styles from "./graphs.module.css"
import axios from "axios";

var primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']
var secondaryScheme = ['#d15454','#e16c7c','#ec86a1','#f4a2c3','#f9bee1','#ffd9fa','#e6b2e3','#cc8bce','#b066bb','#9140a8','#711496']

//// MAPPING FUNCTIONS ////
function GetImpressions(entries, minImpr) {
    const [data, setData] = useState([])

    useEffect(() => {
        setData([])
        var others = 0;

        entries.map(function(entry){
            if(entry.impressions >= minImpr) {
                var newEntry = {
                    id: entry.terms,
                    name: entry.terms, 
                    value: entry.impressions
                }
                setData(data => [...data, newEntry])
            }
            else {
                others += entry.impressions;
            }
        })
    
        var otherEntry = {
            id: "others",
            name: "others",
            value: others
        }
        setData(data => [...data, otherEntry])
    }, [entries, minImpr])

    return data
}

function GetClicks(entries, minClicks) {
    const [data, setData] = useState([])
    
    useEffect(() => {
        setData([])
        var others = 0;

        entries.map(function(entry){
            if(entry.clicks >= minClicks) {
                var newEntry = {
                    id: entry.terms,
                    name: entry.terms, 
                    value: entry.clicks
                }
                setData(data => [...data, newEntry])
            }
            else {
                others += entry.clicks;
            }
        })

        var otherEntry = {
            id: "others",
            name: "others",
            value: others
        }
        setData(data => [...data, otherEntry])

    }, [entries, minClicks])

    return data
}

function GetClickThrough(entries) {
    const [clicks, setClicks] = useState(0)
    const [impressions, setImpressions] = useState(0)

    useEffect(() => {
        setClicks(0)
        setImpressions(0)

        entries.map(function(entry){
            setClicks(clicks => clicks + entry.clicks)
            setImpressions(impressions => impressions + entry.impressions)
        })

    }, [entries])

    return Math.round((clicks/impressions + Number.EPSILON) * 100)
}

function GetClicksAndImpressions(entries, latestDate) {
    const [data, setData] = useState([{
        id: "impressions",
        data: []
    },
    {
        id: "clicks",
        data: []
    }])

    useEffect(() => {
        setData([{
            id: "impressions",
            data: []
        },
        {
            id: "clicks",
            data: []
        }])

        entries.map(function(entry){
            const date = entry.date.split("-")

            if(date[0] == latestDate[0] && date[1] <= latestDate[1] || date[0] == latestDate[0] -1 && date[1] > latestDate[1]) {
                if(data[0].data.find(e => e.x === entry.date)){
                    data[0].data[data[0].data.findIndex((e => e.x === entry.date))].y += entry.impressions
                    data[1].data[data[1].data.findIndex((e => e.x === entry.date))].y += entry.clicks
                } else {
                    data[0].data.push({
                        x: entry.date,
                        y: entry.impressions
                    })
                    data[1].data.push({
                        x: entry.date,
                        y: entry.clicks
                    })
                }
            }
        })
    }, [entries])

    return data
}

//// RENDER VIEW ////
const BingChart = (props) => {
    const [minImpr, setMinImpr] = useState(5)
    const [minClicks, setMinClicks] = useState(3)
    const [allEntries, setAllEntries] = useState([])
    const [latestDate, setLatestDate] = useState([])

    const onInputChange = (e) => {
        switch(e.target.name){
            case 'minImpr':
                setMinImpr(e.target.value)
                return
            case 'minClicks':
                setMinClicks(e.target.value)
                return
            default:
                return
        }
    }

    useEffect(() => {
        const url = Constants.API_URL_BING_ENTRIES;

        axios.get(url)
        .then(res => {
            setAllEntries(res.data);
        })

        axios.get([url,'/GetCurrentMonth'].join(''))
        .then(res => {
            setLatestDate(res.data.split('-'))
        })
    }, [])

    return(
        <>
            <button onClick={() => {props.setShowGraphs(false); props.setActiveTable('')}} className={styles.button_backarrow}>&#60;</button>
            {/* First Block */}
            <div className={styles.grid_container_terms}>
                <div className={styles.settings}>
                    Period:
                    <select>
                        <option defaultValue={true}>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>Last Year</option>
                        <option>All Time</option>
                    </select>
                    Show Others
                    <input type="checkbox"></input>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Impressions</h3>
                    <PieChart data={GetImpressions(allEntries, minImpr)} scheme={primaryScheme}/>
                    <div className={styles.min}>Min. Impressions: <input className={styles.min_input} value={minImpr} name="minImpr" type="number" onChange={onInputChange}/> </div>
                </div>
                <div className={styles.middle_wrapper}>
                    vs. <br/><br/><br/><br/><br/>
                    <h4>Click-Through-Rate:</h4>
                    {GetClickThrough(allEntries)} %
                </div>
                <div className={styles.right_wrapper}>
                    <h3>Clicks</h3>
                    <PieChart data={GetClicks(allEntries, minClicks)} scheme={primaryScheme}/>
                    <div className={styles.min}>Min. Clicks: <input className={styles.min_input} value={minClicks} name="minClicks" type="number" onChange={onInputChange}/> </div>
                </div>
            </div>
            {/* Second Block */}
            <div className={styles.grid_container_2_items}>
                <div className={styles.settings}>
                    Step-size:
                    <select>
                        <option selected="">Month</option>
                        <option>Quarter</option>
                        <option>Year</option>
                    </select>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Impressions & Clicks</h3>
                    <LineChart data={GetClicksAndImpressions(allEntries, latestDate)} scheme={primaryScheme}/>
                </div>
            </div>
        </>
    )
}

export default BingChart