import React, { useState, useEffect, useRef } from "react";

import { PieChart } from "../../components/charts/pieChart";
import { LineChart } from "../../components/charts/lineChart";

import Constants from "../../utilities/Constants";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BiShow } from "react-icons/bi";

import axiosApiInstance from "../../services/interceptor";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";

import styles from "./graphs.module.css"

var primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']
var secondaryScheme = ['#d15454','#e16c7c','#ec86a1','#f4a2c3','#f9bee1','#ffd9fa','#e6b2e3','#cc8bce','#b066bb','#9140a8','#711496']

//// MAPPING FUNCTIONS ////
function GetMedicalField(minField, showOthers, dates, period) {
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
            else filter = [[`leadDate >= '${dates[interval]}-01'`, null]]

            let sort = "ORDER BY leadDate DESC"

            const url = `${Constants.API_URL_LEAD_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[dates, period])

    useEffect(() => {
        const newData = []
        var others = 0

        if(entries.length > 0){
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

            newData.sort((a,b) => b.value - a.value)

            if(showOthers) {
                newData.push({
                    id: "others",
                    name: "others",
                    value: others
                })
            }
        }
        setData(newData)
    },[entries, minField, showOthers])

    return data
}

function GetLeadStatus(showOthers, dates, period) {
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
            else filter = [[`leadDate >= '${dates[interval]}-01'`, null]]

            let sort = "ORDER BY leadDate DESC"

            const url = `${Constants.API_URL_LEAD_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[dates, period])

    useEffect(() => {
        const newData = []
        var others = 0    

        if(entries.length > 0){
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

            newData.sort((a,b) => b.value - a.value)

            if(showOthers) {
                newData.push({
                    id: "others",
                    name: "others",
                    value: others
                })
                newData[newData.findIndex((e => e.id === "others"))].value = Math.trunc(((_value / entries.length - 1) + 1 ) * 100) 
            }
        }
        setData(newData)
    }, [entries, showOthers])

    return data
}

function GetLeadsOverTime(dates, period) {
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
            else filter = [[`leadDate >= '${dates[interval]}-01'`, null]]

            let sort = "ORDER BY leadDate DESC"

            const url = `${Constants.API_URL_LEAD_ENTRIES}/filter/true/${sort}/null`
            getData(url, filter, setEntries)
        }
    },[dates, period])

    useEffect(() => {
        let newData = [{
            id: "dates",
            color: "hsl(48, 70%, 50%)",
            data: []
        }]

        if(entries.length > 0){
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
            newData[0].data.reverse()
        }
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
const LeadChart = () => {
    const initialExport = [false, false, false]
    const headers = ["Customer Fields","Lead Status (%)","Lead Requests over time"]
    const [includeExport, setIncludeExport] = useState(initialExport)
    const [showExport, setShowExport] = useState(false)

    const [minField, setMinField] = useState(10)
    const [showOtherFields, setShowOtherFields] = useState(false)
    const [showOthers, setShowOthers] = useState(true)
    const [periods, setPeriods] = useState([2])
    const [dates, setDates] = useState([])

    const user = authService.getCurrentUser()
    const printRef = useRef(new Array())
    const navigate = useNavigate()

    useEffect(() => {
        if(!user) navigate("/login")

        const url = `${Constants.API_URL_LEAD_ENTRIES}/dates`
        getDates(url)
    },[])

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

    const onPeriodChange = (e, index) => {
        let newPeriods = periods.map(period => { return period })
        newPeriods[index] = parseInt(e.target.value)
        setPeriods(newPeriods)
    }

    const onIncludeChange = (index) => {
        let newIncludes = [...includeExport]
        newIncludes[index] = !newIncludes[index]
        setIncludeExport(newIncludes)
    }

    const handleDownloadPdf = async () => {
        const pdf = new jsPDF();
        let count = 0;
        let exportnum = 0

        for(let i = 0; i < includeExport.length; i++){
            if(includeExport[i]) exportnum++
        }

        if(exportnum === 0){
            alert("Nothing select for export")
            return
        }

        for(let i = 0; i < includeExport.length; i++){
            if(includeExport[i] === true){
                count++

                const element = printRef.current[i]
                const canvas = await html2canvas(element, {scale: 3})
                const data = canvas.toDataURL('image/png')

                if(i !== 2)
                {
                    const pageWidth = pdf.internal.pageSize.getWidth()
                    const pageHeight = pdf.internal.pageSize.getHeight()

                    const widthRatio = pageWidth / canvas.width;
                    const heightRatio = pageHeight / canvas.height;
                    const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

                    const canvasWidth = (canvas.width * ratio) - (70 * ratio)
                    const canvasHeight = (canvas.height * ratio) - (70 * ratio)

                    const marginX = (pageWidth - canvasWidth) / 2

                    pdf.setFontSize(30)

                    if(count % 2 === 1)
                    {
                        pdf.text(headers[i], pageWidth / 2, 15, { align: "center"})
                        pdf.addImage(data, 'PNG', marginX, 17, canvasWidth, canvasHeight)
                    }
                    else 
                    {
                        pdf.text(headers[i], pageWidth / 2, (pageHeight / 2) + 10, { align: "center"})
                        pdf.addImage(data, 'PNG', marginX, (pageHeight / 2) + 12, canvasWidth, canvasHeight)
                    }

                    if(count % 2 === 0 && count !== exportnum)
                        pdf.addPage("a4", "portrait")
                }
                else
                {
                    if(count % 2 === 1){
                        pdf.deletePage(pdf.internal.pages.length -1)
                        count++
                        exportnum++
                    }
                    pdf.addPage("a4", "landscape")

                    const pageWidth = pdf.internal.pageSize.getWidth()
                    const pageHeight = pdf.internal.pageSize.getHeight()

                    const widthRatio = pageWidth / canvas.width;
                    const heightRatio = pageHeight / canvas.height;
                    const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

                    const canvasWidth = (canvas.width * ratio) - (70 * ratio)
                    const canvasHeight = (canvas.height * ratio) - (70 * ratio)

                    const marginX = (pageWidth - canvasWidth) / 2
                    const marginY = (pageHeight - canvasHeight) / 2

                    pdf.setFontSize(30)
                    
                    pdf.text(headers[i], pageWidth / 2, 60, { align: "center"})
                    pdf.addImage(data, 'PNG', marginX, marginY, canvasWidth, canvasHeight)

                    if(count !== exportnum)
                        pdf.addPage("a4", "portrait")
                }
            }
        }
        pdf.save('Leads.pdf')
        setIncludeExport(initialExport)
    };

    return(
        <div className={styles.body}>
            <button onClick={() => navigate("/")} className={styles.button_backarrow}>&#60;</button>
            <div className={styles.export}>
                <button onClick={() => {setShowExport(false); handleDownloadPdf()}} className={styles.button_export}>Export</button>
                <button onClick={() => setShowExport(!showExport)} className={styles.button_showexport}><BiShow/></button>
            </div>
            <div className={styles.grid_container_2_items_3_rows}>
                <div className={styles.settings}>
                    Period:
                    <select onChange={(e) => onPeriodChange(e, 0)}>
                        <option value={2} defaultValue={true}>Last 3 Months</option>
                        <option value={5}>Last 6 Months</option>
                        <option value={11}>Last Year</option>
                    </select>
                    Show Others
                    <input type="checkbox" defaultChecked onChange={() => setShowOthers(!showOthers)}></input>
                </div>
                <div className={styles.left_wrapper}>
                    <h3>Customer Fields{showExport ? <input type="checkbox" onChange={() => onIncludeChange(0)}></input> : <></>}</h3>
                    <div style={{width: "100%", height: "100%"}} ref={ref => !printRef.current.includes(ref) && printRef.current.push(ref)}>
                        <PieChart data={GetMedicalField(minField, showOthers, dates, periods[0])} scheme={primaryScheme}/>
                    </div>
                    <div className={styles.min}>Min. Occurrences: <input className={styles.min_input} value={minField} name="minField" type="number" onChange={onInputChange}/></div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Lead Status in %{showExport ? <input type="checkbox" onChange={() => onIncludeChange(1)}></input> : <></>}</h3>
                    <div style={{width: "100%", height: "100%"}} ref={ref => !printRef.current.includes(ref) && printRef.current.push(ref)}>
                        <PieChart data={GetLeadStatus(showOthers, dates, periods[0])} scheme={secondaryScheme}/>
                    </div>
                </div>
                <div className={styles.center_wrapper}>
                    <h3>Lead Requests Over Time{showExport ? <input type="checkbox" onChange={() => onIncludeChange(2)}></input> : <></>}</h3>
                    <div style={{width: "100%", height: "100%"}} ref={ref => !printRef.current.includes(ref) && printRef.current.push(ref)}>
                        <LineChart data={GetLeadsOverTime(dates, periods[0])} scheme={primaryScheme}/>
                    </div>
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

export default LeadChart