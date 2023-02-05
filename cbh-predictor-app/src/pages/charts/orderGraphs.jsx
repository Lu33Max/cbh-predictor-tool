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
    const initialExport = [false, false, false, false, false, false]
    const headers = ["Frequent Matrices","Frequent Diagnoses","Frequent Sample Sizes (ml)","Lab Parameters","Lab Results (%)","Orders over Time"]
    const [includeExport, setIncludeExport] = useState(initialExport)
    const [showExport, setShowExport] = useState(false)

    const [min, setMin] = useState([150, 150, 150, 150])
    const [max, setMax] = useState([7000, 1000, 800])
    const [showOthers1, setShowOthers1] = useState(true)
    const [showOthers2, setShowOthers2] = useState(true)    
    const [periods, setPeriods] = useState([0, 0, 2])
    const [dates, setDates] = useState([])

    const user = authService.getCurrentUser()
    const printRef = useRef(new Array())
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

                if(i !== 5)
                {
                    const pageWidth = pdf.internal.pageSize.getWidth()
                    const pageHeight = pdf.internal.pageSize.getHeight()

                    const widthRatio = pageWidth / canvas.width
                    const heightRatio = pageHeight / canvas.height
                    const ratio = widthRatio > heightRatio ? heightRatio : widthRatio

                    let canvasHeight, canvasWidth

                    if(i <= 2)
                    {
                        canvasWidth = (canvas.width * ratio) - (350 * ratio)
                        canvasHeight = (canvas.height * ratio) - (350 * ratio)
                    }
                    else 
                    {
                        canvasWidth = (canvas.width * ratio) + (200 * ratio)
                        canvasHeight = (canvas.height * ratio) + (200 * ratio)
                    }

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
        pdf.save('Orders.pdf')
        setIncludeExport(initialExport)
    };

    return(
        <div className={styles.body}>
            <button onClick={() => navigate("/")} className={styles.button_backarrow}>&#60;</button>      
            <div className={styles.export}>
                <button onClick={() => {setShowExport(false); handleDownloadPdf()}} className={styles.button_export}>Export</button>
                <button onClick={() => setShowExport(!showExport)} className={styles.button_showexport}><BiShow/></button>
            </div>  
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
                    <h3>Frequent Matrices{showExport ? <input type="checkbox" onChange={() => onIncludeChange(0)}></input> : <></>}</h3>
                    <div style={{width: "100%", height: "100%"}} ref={ref => !printRef.current.includes(ref) && printRef.current.push(ref)}>
                        <PieChart data={GetMatrices(min[0], max[0], showOthers1, dates, periods[0])} scheme={primaryScheme}/>
                    </div>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={min[0]} name={0} type="number" onChange={minChange}/> Max: <input className={styles.min_input} value={max[0]} name={0} type="number" onChange={maxChange}/></div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Frequent Diagnoses{showExport ? <input type="checkbox" onChange={() => onIncludeChange(1)}></input> : <></>}</h3>
                    <div style={{width: "100%", height: "100%"}} ref={ref => !printRef.current.includes(ref) && printRef.current.push(ref)}>
                        <PieChart data={GetDiagnosis(min[1], max[1], showOthers1, dates, periods[0])} scheme={primaryScheme}/>
                    </div>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={min[1]} name={1} type="number" onChange={minChange}/> Max: <input className={styles.min_input} value={max[1]} name={1} type="number" onChange={maxChange}/></div>
                </div>
                <div className={styles.right_wrapper}>
                    <h3>Frequ. Sample Sizes (in ml){showExport ? <input type="checkbox" onChange={() => onIncludeChange(2)}></input> : <></>}</h3>
                    <div style={{width: "100%", height: "100%"}} ref={ref => !printRef.current.includes(ref) && printRef.current.push(ref)}>
                        <PieChart data={GetSampleSizes(min[2], showOthers1, dates, periods[0])} scheme={primaryScheme}/>
                    </div>
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
                    <h3>Lab Parameters{showExport ? <input type="checkbox" onChange={() => onIncludeChange(3)}></input> : <></>}</h3>
                    <div style={{width: "100%", height: "100%"}} ref={ref => !printRef.current.includes(ref) && printRef.current.push(ref)}>
                        <PieChart data={GetLabParameter(min[3], max[2], showOthers2, dates, periods[1])} scheme={secondaryScheme}/>
                    </div>
                    <div className={styles.min}>Min: <input className={styles.min_input} value={min[3]} name={3} type="number" onChange={minChange}/> Max: <input className={styles.min_input} value={max[2]} name={2} type="number" onChange={maxChange}/></div>
                </div>
                <div className={styles.middle_wrapper}>
                    <h3>Lab Results (in %){showExport ? <input type="checkbox" onChange={() => onIncludeChange(4)}></input> : <></>}</h3>
                    <div style={{width: "100%", height: "100%"}} ref={ref => !printRef.current.includes(ref) && printRef.current.push(ref)}>
                        <PieChart data={GetLabResult(showOthers2, dates, periods[1])} scheme={secondaryScheme}/>
                    </div>
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
                    <h3>Orders Over Time{showExport ? <input type="checkbox" onChange={() => onIncludeChange(5)}></input> : <></>}</h3>
                    <div style={{width: "100%", height: "100%"}} ref={ref => !printRef.current.includes(ref) && printRef.current.push(ref)}>
                        <LineChart data={GetOrders(dates, periods[2])} scheme={primaryScheme}/>
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

export default OrderChart