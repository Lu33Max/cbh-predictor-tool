import React, { useState, useEffect, useRef } from "react";

import { PieChart } from "../../components/charts/pieChart";
import { LineChart } from "../../components/charts/lineChart";
import { AreaBump } from "../../components/charts/areabumpChart";
import { BarChart } from "../../components/charts/barChart";

import Constants from "../../utilities/Constants";
import PopoverButton from "../../components/charts/popover";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BiShow } from "react-icons/bi";

import axiosApiInstance from "../../services/interceptor";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";

import styles from "./graphs.module.css"

const primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']
const secondaryScheme = ['#d15454','#e16c7c','#ec86a1','#f4a2c3','#f9bee1','#ffd9fa','#e6b2e3','#cc8bce','#b066bb','#9140a8','#711496']
const contrastScheme = ['#12ec66 ','#00d68f ','#00bcb4 ','#00a0d0 ','#0083dc ','#0064d4 ','#0056c2 ','#0047bc ','#0042b7 ','#0035aa ','#0023a1 ','#001589']
const tempScheme = ['#5fc431','#96e890','#82cc96','#62b37f','#188255']

//// MAPPING FUNCTIONS ////
function GetImpressions(entries, minImpr, showOthers, dates, period) {
    const [data, setData] = useState([])
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }

    useEffect(() => {
        setData([])
        var newData = []
        var others = 0;

        entries.map(function(entry){
            if(interval === -1 || entry.date >= dates[interval]){
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
            }
        })

        for(var i = 0; i < newData.length; i++){
            if(newData[i].value < minImpr){
                others += newData[i].value
                newData.splice(i, 1)
                i--
            }
        }

        newData.sort((a,b) => b.value - a.value)
    
        if(showOthers){
            var otherEntry = {
                id: "others",
                name: "others",
                value: others
            }
            newData.unshift(otherEntry)
        }
        setData(newData)
    }, [entries, minImpr, showOthers, dates, period])

    return data
}

function GetClicks(entries, minClicks, showOthers, dates, period) {
    const [data, setData] = useState([])
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }
    
    useEffect(() => {
        setData([])
        var newData = []
        var others = 0;

        entries.map(function(entry){
            if(interval === -1 || entry.date >= dates[interval]){
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
            }
        })

        for(var i = 0; i < newData.length; i++){
            if(newData[i].value < minClicks){
                others += newData[i].value
                newData.splice(i, 1)
                i--
            }
        }

        newData.sort((a,b) => b.value - a.value)

        if(showOthers){
            var otherEntry = {
                id: "others",
                name: "others",
                value: others
            }
            newData.unshift(otherEntry)
        }
        setData(newData)
    }, [entries, minClicks, showOthers, dates, period])

    return data
}

function GetClickThrough(entries, dates, period) {
    const [clicks, setClicks] = useState(0)
    const [impressions, setImpressions] = useState(0)
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }

    useEffect(() => {
        setClicks(0)
        setImpressions(0)

        entries.map(function(entry){
            if(interval === -1 || entry.date >= dates[interval]){
                setClicks(clicks => clicks + entry.clicks)
                setImpressions(impressions => impressions + entry.impressions)
            }
        })

    }, [entries, dates, period])

    return Math.round((clicks/impressions + Number.EPSILON) * 1000) /10
}

function GetClicksAndImpressionsOverTime(dates, period) {
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
            else filter = [[`date >= '${dates[interval]}'`, null]]

            let sort = "ORDER BY date DESC"

            const url = `${Constants.API_URL_BING_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[dates, period])

    useEffect(() => {
        var newData = [{
            id: "impressions",
            data: [{x: dates[0], y: 0}]
        },
        {
            id: "clicks",
            data: [{x: dates[0], y: 0}]
        }]

        if(entries.length > 0){
            let k = 0
            for(let i = 0; i < entries.length; i++){
                if(entries[i].date === dates[k]){
                    newData[0].data[k].y += entries[i].impressions
                    newData[1].data[k].y += entries[i].clicks
                } else if(k < dates.length -1 && entries[i].date === dates[k+1]){
                    newData[0].data.push({
                        x: entries[i].date,
                        y: entries[i].impressions
                    })
                    newData[1].data.push({
                        x: entries[i].date,
                        y: entries[i].clicks
                    })
                    k++
                } else if(k > 0) {
                    newData[0].data.push({
                        x: dates[k],
                        y: 0
                    })
                    newData[1].data.push({
                        x: dates[k],
                        y: 0
                    })
                    k++
                }
            }

            newData[0].data.reverse()
            newData[1].data.reverse()
        }
        setData(newData)
    }, [entries])

    return data
}

function GetClickThroughOverTime(dates, period) {
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
            else filter = [[`date >= '${dates[interval]}'`, null]]

            let sort = "ORDER BY date DESC"

            const url = `${Constants.API_URL_BING_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[dates, period])

    useEffect(() => {
        var newData = [{ id: "Click-Through", data: []}]
        var clicks = [0] 
        var impressions = [0]

        if(entries.length > 0){
            let k = 0
            for(let i = 0; i < entries.length; i++){
                if(entries[i].date === dates[k]){
                    impressions[k] += entries[i].impressions
                    clicks[k] += entries[i].clicks
                } else if(k < dates.length -1 && entries[i].date === dates[k+1]){
                    impressions.push(entries[i].impressions)
                    clicks.push(entries[i].clicks)
                    k++
                } else if(k > 0) {
                    impressions.push(0)
                    clicks.push(0)
                    k++
                }
            }
            for(let j = 0; j <= interval; j++){
                newData[0].data.push({
                    x: dates[j],
                    y: Math.round((clicks[j]/ impressions[j] + Number.EPSILON) * 1000) /10
                })
            }
            console.log(newData)
            newData[0].data.reverse()
        }
        setData(newData)
    },[entries])

    return data
}

function GetCustomAreaBump(terms, dates, period) {
    const [AreaData, setAreaData] = useState([])
    const [entries, setEntries] = useState([])
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }

    useEffect(() => {
        if(dates.length > 0 && terms.length > 0){
            var filter

            if(period > dates.length) filter = []
            else filter = [[`date >= '${dates[interval]}'`, null]]

            let termfilter = "terms IN ("
            for(let i = 0; i < terms.length; i++){
                termfilter += `'${terms[i]}'`
                if(i !== terms.length -1){
                    termfilter +=","
                }
            }
            termfilter += ")"

            filter.push([termfilter, null])

            const url = `${Constants.API_URL_BING_ENTRIES}/filter/true/null/null`
            getData(url, filter, setEntries)
        }
    },[terms, dates, period])

    useEffect(() => {
        var newEntries = []

        if(entries.length > 0){
            for(let j = 0; j < terms.length; j++){
                newEntries.push({id: terms[j], data: []})
                for(let k = 0; k <= interval; k++){
                    var found = false
                    for(let l = 0; l < entries.length; l++){
                        if(entries[l].date === dates[k] && entries[l].terms === terms[j]){
                            newEntries[j].data.push({
                                x: entries[l].date,
                                y: entries[l].impressions
                            })
                            found = true
                        }
                    }
                    if(!found){
                        newEntries[j].data.push({
                            x: dates[k],
                            y: 0
                        })
                    }
                }
                newEntries[j].data.reverse()
            }
        }

        setAreaData(newEntries)
    }, [entries])

    return(AreaData)
}

function GetCustomBar(terms, dates, period){
    const [barData, setBarData] = useState([])
    const [entries, setEntries] = useState([])
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }

    useEffect(() => {
        if(dates.length > 0 && terms.length > 0){
            var filter

            if(period > dates.length) filter = []
            else filter = [[`date >= '${dates[interval]}'`, null]]

            let termfilter = "terms IN ("
            for(let i = 0; i < terms.length; i++){
                termfilter += `'${terms[i]}'`
                if(i !== terms.length -1){
                    termfilter +=","
                }
            }
            termfilter += ")"

            filter.push([termfilter, null])
            let sort = "ORDER BY date ASC"

            const url = `${Constants.API_URL_BING_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[terms, dates, period])

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
    }, [entries])

    return(barData)
}

function GetCustomLine(terms, dates, period){
    const [LineData, setLineData] = useState([])
    const [entries, setEntries] = useState([])
    let interval = period

    if(interval >= dates.length){
        interval = dates.length -1
    }

    useEffect(() => {
        if(dates.length > 0 && terms.length > 0){
            var filter

            if(period >= dates.length) filter = []
            else filter = [[`date >= '${dates[interval]}'`, null]]

            let termfilter = "terms IN ("
            for(let i = 0; i < terms.length; i++){
                termfilter += `'${terms[i]}'`
                if(i !== terms.length -1){
                    termfilter +=","
                }
            }
            termfilter += ")"
            filter.push([termfilter, null])

            const url = `${Constants.API_URL_BING_ENTRIES}/filter/true/null/null`
            getData(url, filter, setEntries)
        }
    },[terms, dates, period])

    useEffect(() => {
        var newEntries = []

        if(entries.length > 0){
            
            for(let j = 0; j < terms.length; j++){
                newEntries.push({id: terms[j], data: []})
                for(let k = 0; k <= interval; k++){
                    var found = false
                    for(let l = 0; l < entries.length; l++){
                        if(entries[l].date === dates[k] && entries[l].terms === terms[j]){
                            newEntries[j].data.push({
                                x: entries[l].date,
                                y: entries[l].impressions
                            })
                            found = true
                        }
                    }
                    if(!found){
                        newEntries[j].data.push({
                            x: dates[k],
                            y: 0
                        })
                    }
                }
                newEntries[j].data.reverse()
            }
        }

        setLineData(newEntries)
    }, [entries])

    return(LineData)
}

async function getData(url, body, setEntries){
    const result = await axiosApiInstance.post(url, body, {'Content-Type': 'application/json'})
    if(result.status === 200){
        setEntries(result.data)
    }
}

//// RENDER VIEW ////
const BingChart = () => {
    const [showExport, setShowExport] = useState(false)
    const [minImpr, setMinImpr] = useState(10)
    const [minClicks, setMinClicks] = useState(5)
    const [periods, setPeriods] = useState([0, 2, 2])
    const [showOthers, setShowOthers] = useState(true)
    const [allEntries, setAllEntries] = useState([])
    const [dates, setDates] = useState([])
    const [terms, setTerms] = useState(["biobank","biorepository","ffpe tissue"])

    const user = authService.getCurrentUser()
    const printRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        if(!user) navigate("/login")
    },[])

    useEffect(() => {
        var url = `${Constants.API_URL_BING_ENTRIES}/dates`
        getDates(url)
        
        url = Constants.API_URL_BING_ENTRIES
        getEntries(url)
    },[])

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

    const onPeriodChange = (e, index) => {
        let newPeriods = periods.map(period => { return period })
        newPeriods[index] = parseInt(e.target.value)
        setPeriods(newPeriods)
    }

    const handleDownloadPdf = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element, {scale: 3, height: 490, width: 600});
        const data = canvas.toDataURL('image/png');
    
        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    
        pdf.addImage(data, 'PNG', 40, 0, pdfWidth - 80, pdfHeight - 60);
        pdf.save('print.pdf');
    };

    return(
        <div className={styles.body}>
            <button onClick={() => {navigate("/")}} className={styles.button_backarrow}>&#60;</button>
            <div className={styles.export}>
                <button onClick={() => handleDownloadPdf()} className={styles.button_export}>Export</button>
                <button onClick={() => setShowExport(!showExport)} className={styles.button_showexport}><BiShow/></button>
            </div>
            {/* First Block */}
            <div className={styles.grid_container_3_items_small_mid}>
                <div className={styles.settings}>
                    Period:
                    <select onChange={(e) => onPeriodChange(e, 0)}>
                        <option defaultValue={true} value={0}>Last Month</option>
                        <option value={2}>Last 3 Months</option>
                        <option value={11}>Last Year</option>
                        <option value={-1}>All Time</option>
                    </select>
                    Show Others
                    <input type="checkbox" defaultChecked onChange={() => setShowOthers(!showOthers)}></input>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Impressions{showExport ? <input type="checkbox"></input> : <></>}</h3>
                    <PieChart data={GetImpressions(allEntries, minImpr, showOthers, dates, periods[0])} scheme={primaryScheme}/>
                    <div className={styles.min}>Min. Impressions: <input className={styles.min_input} value={minImpr} name="minImpr" type="number" onChange={onInputChange}/> </div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>vs.</h3> <br/><br/><br/><br/>
                    <h4>Click-Through-Rate:</h4>
                    {GetClickThrough(allEntries, dates, periods[0])} %
                </div>
                <div className={styles.right_wrapper}>
                    <h3>Clicks{showExport ? <input type="checkbox"></input> : <></>}</h3>
                    <PieChart data={GetClicks(allEntries, minClicks, showOthers, dates, periods[0])} scheme={primaryScheme}/>
                    <div className={styles.min}>Min. Clicks: <input className={styles.min_input} value={minClicks} name="minClicks" type="number" onChange={onInputChange}/> </div>
                </div>
            </div>
            {/* Second Block */}
            <div className={styles.grid_container_2_items}>
                <div className={styles.settings}>
                    Period:
                    <select onChange={(e) => onPeriodChange(e, 1)}>
                        <option value={2} defaultValue={true}>Last 3 Months</option>
                        <option value={5}>Last 6 Months</option>
                        <option value={11}>Last Year</option>
                    </select>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Impressions & Clicks{showExport ? <input type="checkbox"></input> : <></>}</h3>
                    <LineChart data={GetClicksAndImpressionsOverTime(dates, periods[1])} scheme={[primaryScheme[0], primaryScheme[8]]} axisBottom={"time"} axisLeft={""}/>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Click-Through-Rate{showExport ? <input type="checkbox"></input> : <></>}</h3>
                    <LineChart data={GetClickThroughOverTime(dates, periods[1])} scheme={primaryScheme[10]} axisBottom={"time"} axisLeft={"%"}/>
                </div>
            </div>
            {/* Third Block */}
            <div className={styles.grid_container_2_items_4_rows}>
                <div className={styles.settings}>
                    Period:
                    <select onChange={(e) => onPeriodChange(e, 2)}>
                        <option value={2} defaultValue={true}>Last 3 Month</option>
                        <option value={5}>Last 6 Months</option>
                        <option value={11}>Last Year</option>
                    </select>
                </div>
                <div className={styles.wrapper_2_wide_top}>
                    <h3>Ranking over Time{showExport ? <input type="checkbox"></input> : <></>}</h3>
                    <AreaBump data={GetCustomAreaBump(terms, dates, periods[2])} scheme={tempScheme} axisBottom={"time"} axisLeft={"%"}/>
                </div>
                <div className={styles.wrapper_2_wide_mid}>
                    {terms.map((item,i) => (<label className={styles.terms} key={i}>
                        {item}
                        <button onClick={() => {removeFromTerms(item)}}>X</button>
                    </label>))}
                    <PopoverButton terms={terms} addToTerms={addToTerms}/>
                </div>
                <div className={styles.wrapper_left_bottom}>
                    <h3>Terms per Month{showExport ? <input type="checkbox"></input> : <></>}</h3>
                    <BarChart data={GetCustomBar(terms, dates, periods[2])} scheme={tempScheme} keys={terms} index={"date"} xAxis={"dates"} yAxis={""}/>
                </div>
                <div className={styles.wrapper_right_bottom}>
                    <h3>Terms over Time{showExport ? <input type="checkbox"></input> : <></>}</h3>
                    <LineChart data={GetCustomLine(terms, dates, periods[2])} scheme={tempScheme}/>
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

    async function getEntries(url){
        const result = await axiosApiInstance.get(url)
        if(result.status == 200){
            setAllEntries(result.data)
        }
    }
    async function getDates(url){
        const result = await axiosApiInstance.get(url)
        if(result.status === 200){
            setDates(result.data)
        }
    }
}

export default BingChart