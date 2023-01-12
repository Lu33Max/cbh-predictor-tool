import React, { useState, useEffect } from "react";
import { PieChart } from "../../components/charts/pieChart";
import { LineChart } from "../../components/charts/lineChart";
import { AreaBump } from "../../components/charts/areabumpChart";
import { BarChart } from "../../components/charts/barChart";
import Constants from "../../utilities/Constants";
import PopoverButton from "../../components/charts/popover";
import styles from "./graphs.module.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";

var primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']
var secondaryScheme = ['#d15454','#e16c7c','#ec86a1','#f4a2c3','#f9bee1','#ffd9fa','#e6b2e3','#cc8bce','#b066bb','#9140a8','#711496']

//// MAPPING FUNCTIONS ////
function GetImpressions(entries, minImpr, showOthers) {
    const [data, setData] = useState([])

    useEffect(() => {
        setData([])
        var newData = []
        var others = 0;

        entries.map(function(entry){
            if(newData.find(e => e.name === entry.terms)){
                newData[newData.findIndex(e => e.name === entry.terms)].value += entry.impressions
            } else {
                var newEntry = {
                    id: entry.terms,
                    name: entry.terms, 
                    value: entry.impressions
                }
                newData.push(newEntry)
            }
        })

        for(var i = 0; i < newData.length; i++){
            if(newData[i].value < minImpr){
                others += newData[i].value
                newData.splice(i, 1)
                i--
            }
        }
    
        if(showOthers){
            var otherEntry = {
                id: "others",
                name: "others",
                value: others
            }
            newData.push(otherEntry)
        }
        setData(newData)
    }, [entries, minImpr, showOthers])

    return data
}

function GetClicks(entries, minClicks, showOthers) {
    const [data, setData] = useState([])
    
    useEffect(() => {
        setData([])
        var newData = []
        var others = 0;

        entries.map(function(entry){
            if(newData.find(e => e.name === entry.terms)){
                newData[newData.findIndex(e => e.name === entry.terms)].value += entry.clicks
            } else {
                var newEntry = {
                    id: entry.terms,
                    name: entry.terms, 
                    value: entry.clicks
                }
                newData.push(newEntry)
            }
        })

        for(var i = 0; i < newData.length; i++){
            if(newData[i].value < minClicks){
                others += newData[i].value
                newData.splice(i, 1)
                i--
            }
        }

        if(showOthers){
            var otherEntry = {
                id: "others",
                name: "others",
                value: others
            }
            newData.unshift(otherEntry)
        }
        setData(newData)
    }, [entries, minClicks, showOthers])

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

function GetClicksAndImpressionsOverTime(entries, latestDate) {
    const [data, setData] = useState()

    useEffect(() => {
        var newData = [{
            id: "impressions",
            data: []
        },
        {
            id: "clicks",
            data: []
        }]

        entries.map(function(entry){
            const date = entry.date.split("-")

            if((date[0] === latestDate[0] && parseInt(date[1]) <= parseInt(latestDate[1])) || (date[0] === latestDate[0] -1 && parseInt(date[1]) > parseInt(latestDate[1]))) {
                if(newData[0].data.find(e => e.x === entry.date)){
                    newData[0].data[newData[0].data.findIndex(e => e.x === entry.date)].y += entry.impressions
                    newData[1].data[newData[1].data.findIndex(e => e.x === entry.date)].y += entry.clicks
                } else {
                    newData[0].data.push({
                        x: entry.date,
                        y: entry.impressions
                    })
                    newData[1].data.push({
                        x: entry.date,
                        y: entry.clicks
                    })
                }
            }
        })
        setData(newData)

    }, [entries, latestDate])

    return data
}

function GetClickThroughOverTime(entries, latestDate) {
    const [data, setData] = useState()

    useEffect(() => {
        var newData = [{ id: "Click-Through", data: []}]
        var clicks = [] 
        var impressions = []

        entries.map(function(entry){
            const date = entry.date.split("-")

            if((date[0] === latestDate[0] && parseInt(date[1]) <= parseInt(latestDate[1])) || (date[0] === latestDate[0] -1 && parseInt(date[1]) > parseInt(latestDate[1]))) {
                if(newData[0].data.find(e => e.x === entry.date)){
                    clicks[clicks.findIndex(e => e.date === entry.date)].val += entry.clicks
                    impressions[impressions.findIndex(e => e.date === entry.date)].val += entry.impressions
                } else {
                    newData[0].data.push({
                        x: entry.date,
                        y: 0
                    })
                    clicks.push({
                        date: entry.date,
                        val: entry.clicks
                    })
                    impressions.push({
                        date: entry.date,
                        val: entry.impressions
                    })
                }
            }
        })

        for(var i = 0; i < newData[0].data.length; i++){
            newData[0].data[i].y = Math.round((clicks[i].val / impressions[i].val + Number.EPSILON) * 100)
        }

        setData(newData)

    },[entries, latestDate])

    return data
}

function GetCustomAreaBump(entries, terms) {
    const [areaData, setAreaData] = useState()

    useEffect(() => {
        var newAreaData = []

        entries.map(function(entry){
            if(terms.find(e => e === entry.terms)){
                if(newAreaData.find(e => e.id === entry.terms)){
                    newAreaData[newAreaData.findIndex(e => e.id === entry.terms)].data.push({
                        x: entry.date,
                        y: entry.impressions
                    })
                } else {
                    newAreaData.push({
                        id: entry.terms,
                        data: [{
                            x: entry.date,
                            y: entry.impressions
                        }]
                    })
                }
            }
        })
        setAreaData(newAreaData)
    }, [entries, terms])

    return(areaData)
}

function GetCustomBar(entries, terms){
    const [barData, setBarData] = useState()

    useEffect(() => {
        var newBarData = []

        entries.map(function(entry){
            if(terms.find(e => e === entry.terms)){
                if(newBarData.find(e => e.date === entry.date)){
                    newBarData[newBarData.findIndex(e => e.date === entry.date)][entry.terms] = entry.impressions
                } else {
                    newBarData.push({
                        "date": entry.date,
                        [entry.terms]: entry.impressions,
                    })
                }
            }
        })
        setBarData(newBarData)
    }, [entries, terms])

    return(barData)
}

function GetCustomLine(entries, terms){
    const [LineData, setLineData] = useState()

    useEffect(() => {
        var newLineData = []

        entries.map(function(entry){
            if(terms.find(e => e === entry.terms)){
                if(newLineData.find(e => e.id === entry.terms)){
                    newLineData[newLineData.findIndex(e => e.id === entry.terms)].data.push({
                        x: entry.date,
                        y: entry.impressions
                    })
                } else {
                    newLineData.push({
                        id: entry.terms,
                        data: [{
                            x: entry.date,
                            y: entry.impressions
                        }]
                    })
                }
            }
        })
        setLineData(newLineData)
    }, [entries, terms])

    return(LineData)
}

//// RENDER VIEW ////
const BingChart = () => {
    const [minImpr, setMinImpr] = useState(5)
    const [minClicks, setMinClicks] = useState(3)
    const [showOthers, setShowOthers] = useState(true)
    const [allEntries, setAllEntries] = useState([])
    const [latestDate, setLatestDate] = useState([])
    const [terms, setTerms] = useState(["biobank","ffpe tissue","biorepository"])

    const navigate = useNavigate()

    useEffect(() => {
        const url = Constants.API_URL_BING_ENTRIES;

        axios.get(url)
        .then(res => {
            setAllEntries(res.data);
        })

    }, [])

    useEffect(() => {
        const url = Constants.API_URL_BING_ENTRIES;

        if(allEntries.length > 0){
            axios.get([url,'/GetCurrentMonth'].join(''))
            .then(res => {
                setLatestDate(res.data.split('-'))
            })
        }

    },[allEntries])

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
        <div className={styles.body}>
            <button onClick={() => {navigate("/")}} className={styles.button_backarrow}>&#60;</button>
            {/* First Block */}
            <div className={styles.grid_container_3_items}>
                <div className={styles.settings}>
                    Period:
                    <select>
                        <option defaultValue={true} value={0}>Last Month</option>
                        <option value={2}>Last 3 Months</option>
                        <option value={11}>Last Year</option>
                        <option value={-1}>All Time</option>
                    </select>
                    Show Others
                    <input type="checkbox" onChange={() => setShowOthers(!showOthers)}></input>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Impressions</h3>
                    <PieChart data={GetImpressions(allEntries, minImpr, showOthers)} scheme={primaryScheme}/>
                    <div className={styles.min}>Min. Impressions: <input className={styles.min_input} value={minImpr} name="minImpr" type="number" onChange={onInputChange}/> </div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>vs.</h3> <br/><br/><br/><br/>
                    <h4>Click-Through-Rate:</h4>
                    {GetClickThrough(allEntries)} %
                </div>
                <div className={styles.right_wrapper}>
                    <h3>Clicks</h3>
                    <PieChart data={GetClicks(allEntries, minClicks, showOthers)} scheme={primaryScheme}/>
                    <div className={styles.min}>Min. Clicks: <input className={styles.min_input} value={minClicks} name="minClicks" type="number" onChange={onInputChange}/> </div>
                </div>
            </div>
            {/* Second Block */}
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
                    <h3>Impressions & Clicks</h3>
                    <LineChart data={GetClicksAndImpressionsOverTime(allEntries, latestDate)} scheme={[primaryScheme[0], secondaryScheme[0]]} axisBottom={"time"} axisLeft={""}/>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Click-Through-Rate</h3>
                    <LineChart data={GetClickThroughOverTime(allEntries, latestDate)} scheme={primaryScheme} axisBottom={"time"} axisLeft={"%"}/>
                </div>
            </div>
            {/* Third Block */}
            <div className={styles.grid_container_2_items_4_rows}>
                <div className={styles.settings}>
                    Period:
                    <select>
                        <option defaultValue={true}>Last 3 Month</option>
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                    </select>
                </div>
                <div className={styles.wrapper_2_wide_top}>
                    <h3>Specific Terms over Time</h3>
                    <AreaBump data={GetCustomAreaBump(allEntries, terms)} scheme={primaryScheme} axisBottom={"time"} axisLeft={"%"}/>
                </div>
                <div className={styles.wrapper_2_wide_mid}>
                    {terms.map((item,i) => (<label className={styles.terms} key={i}>
                        {item}
                        <button onClick={() => {removeFromTerms(item)}}>X</button>
                    </label>))}
                    <PopoverButton terms={terms} addToTerms={addToTerms}/>
                </div>
                <div className={styles.wrapper_left_bottom}>
                    <BarChart data={GetCustomBar(allEntries, terms)} scheme={primaryScheme} keys={terms} index={"date"} xAxis={"dates"} yAxis={""}/>
                </div>
                <div className={styles.wrapper_right_bottom}>
                    <LineChart data={GetCustomLine(allEntries, terms)} scheme={primaryScheme}/>
                </div>
            </div>
        </div>
    )

    function addToTerms(term){
        if(!allEntries.find(e => e.terms === term)){
            alert("Term " + term + " does not exist")
            return
        }

        let newTerms = []
        for(let newTerm in terms){
            newTerms.push(terms[newTerm])
        }
        newTerms.push(term)
        setTerms(newTerms)
    }

    function removeFromTerms(item){
        setTerms(
            terms.filter(a =>
              a !== item
            )
        );
    }
}

export default BingChart