import React, { useState, useEffect } from "react";
import { PieChart } from "./charts/pieChart";
import Constants from "../../../utilities/Constants";
import styles from "./graphs.module.css"
import axios from "axios";

var primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']

//// MAPPING FUNCTIONS ////
function getImpressions(entries, minImpr) {
    const data = []
    var others = 0;

    entries.map(function(entry){
        if(entry.impressions >= minImpr) {
            data.push({
                id: entry.terms,
                name: entry.terms, 
                value: entry.impressions
            })
        }
        else {
            others += entry.impressions;
        }
    })

    data.push({
        id: "others",
        name: "others",
        value: others
    })

    return data
}

function getClicks(entries, minClicks) {
    const data = []
    var others = 0;

    entries.map(function(entry){
        if(entry.clicks >= minClicks) {
            data.push({
                id: entry.terms,
                name: entry.terms, 
                value: entry.clicks
            })
        }
        else {
            others += entry.clicks;
        }
    })

    data.unshift({
        id: "others",
        name: "others",
        value: others
    })

    return data
}

function getClickThrough(entries) {
    var clicks = 0, impressions = 0

    entries.map(function(entry){
        clicks += entry.clicks
        impressions += entry.impressions
    })

    return Math.round((clicks/impressions + Number.EPSILON) * 100)
}

//// RENDER VIEW ////
const GoogleChart = () => {
    const [minImpr, setMinImpr] = useState(25)
    const [minClicks, setMinClicks] = useState(5)

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

    return(
        <div className={styles.grid_container}>
            <div className={styles.impressions_wrapper}>
                <h3>Impressions</h3>
                <PieChart data={GetAllEntries('impressions', minImpr)} scheme={primaryScheme}/>
                <div className={styles.min}>Min. Impressions: <input className={styles.min_input} value={minImpr} name="minImpr" type="number" onChange={onInputChange}/> </div>
            </div>
            <div>
                vs. <br/><br/><br/>
                <h5>Click-Through-Rate</h5>
                {GetAllEntries('clickthrough')} %
            </div>
            <div className={styles.clicks_wrapper}>
                <h3>Clicks</h3>
                <PieChart data={GetAllEntries('clicks', minClicks)} scheme={primaryScheme}/>
                <div className={styles.min}>Min. Clicks: <input className={styles.min_input} value={minClicks} name="minClicks" type="number" onChange={onInputChange}/> </div>
            </div>
        </div>
    )
}

//// GETTER METHODS ////
function GetAllEntries(type, props){
    const url = Constants.API_URL_GOOGLE_ENTRIES;
    const [entries, setEntries] = useState([])

    useEffect(() => {
        axios.get(url)
        .then(res => {
            setEntries(res.data);
        })
    }, [])

    switch(type){
        case 'impressions':
            return getImpressions(entries, props)
        case 'clicks':
            return getClicks(entries, props)
        case 'clickthrough':
            return getClickThrough(entries)
    }
}

export default GoogleChart