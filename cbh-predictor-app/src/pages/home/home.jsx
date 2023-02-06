import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../../services/auth.service"
import axiosApiInstance from "../../services/interceptor"
import Constants from "../../utilities/Constants"

import { CalendarChart } from "../../components/charts/calendarChart"
import { FunnelChart } from "../../components/charts/funnelChart"
import { SwarmPlot } from "../../components/charts/swarmPlot"

import styles from "./home.module.css"

const HomeScreen = () => {
    const [bingCount, setBingCount] = useState(0)
    const [googleCount, setGoogleCount] = useState(0)
    const [leadCount, setLeadCount] = useState(0)
    const [orderCount, setOrderCount] = useState(0)
    const [allCount, setAllCount] = useState(0)
    const [calendarData, setCalendarData] = useState([])
    const [swarmData, setSwarmData] = useState([])
    const [funnelData, setFunnelData] = useState([[{id: "NaN", value: 1, label: "NaN"}]])
    const [dates, setDates] = useState([])
    const [activeDate, setActiveDate] = useState(0)
    const [cycle, setCycle] = useState(false)
    const [bingTop, setBingTop] = useState(["NaN","NaN"])
    const [googleTop, setGoogleTop] = useState(["NaN","NaN"])

    const user = authService.getCurrentUser()
    const navigate = useNavigate()
    let dateIndex = 0

    useEffect(() => {
        if(!user) navigate("/login")
    },[])

    useEffect(() => {
        getRowCounts()
        getFunnelData()
    },[])

    useEffect(() => {
        setAllCount(bingCount + googleCount + leadCount + orderCount)
    },[bingCount, googleCount, leadCount, orderCount])

    const showMonths = () => {
        return(
            <>
                {dates.map((date, index) => (
                    <label key={index} className={(index === activeDate) ? styles.l_header_active : styles.l_header_label}>{date}</label>
                ))}
            </>
        )
    }

    useEffect(() => {
        if(cycle){
            const interval = setInterval(() => {
                dateIndex++
                
                if(dateIndex >= dates.length)
                    dateIndex = 0
                
                setActiveDate(dateIndex)
            }, 10000);
            return () => {
                clearInterval(interval);
            };
        }
    },[funnelData])

    return(
        <div className={styles.body}>
            <div className={styles.outer_grid}>
                <div className={styles.header_row}>
                    <label>
                        <h3>Total Entries:</h3><h3>{allCount}</h3><h3>|</h3>
                        <div>Bing: {bingCount}</div>
                        <div>Google: {googleCount}</div>
                        <div>Lead: {leadCount}</div>
                        <div>Order: {orderCount}</div>
                    </label>
                </div>
                <div className={styles.left_container}>
                    <div className={styles.left_container_bg}>
                        <div className={styles.l_grid}>
                            <div className={styles.l_header}>
                                {showMonths()}
                            </div>
                            <div className={styles.top_line}></div>
                            <div className={styles.bottom_line}></div>
                            <div className={styles.l_left_top_container}>
                                <div className={styles.circle}><h3>1</h3></div>
                            </div>
                            <div className={styles.l_left_mid_container}>
                                <div className={styles.circle}><h3>2</h3></div>
                            </div>
                            <div className={styles.l_left_bot_container}>
                                <div className={styles.circle}><h3>3</h3></div>
                            </div>
                            <div className={styles.l_funnel_container}>
                                <FunnelChart data={funnelData[activeDate]}/>
                            </div>
                            <div className={styles.l_right_text_top}>
                                Impressions
                            </div>
                            <div className={styles.l_right_text_mid}>
                                Clicks
                            </div>
                            <div className={styles.l_right_text_bot}>
                                Orders
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.right_top_container}>
                    <div className={styles.right_top_container_bg}>
                        <div className={styles.rt_grid}>
                            <div className={styles.rt_left_container}>
                                <CalendarChart data={calendarData}/>
                            </div>
                            <div className={styles.rt_right_container}>
                                <SwarmPlot data={swarmData}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.right_bottom_container}>
                    <div className={styles.right_bottom_container_bg}>
                        <div className={styles.rb_grid}>
                            <div className={styles.rb_line}></div>
                            <div className={styles.rb_top_left}>
                                Top Searches Last Month
                            </div>
                            <div className={styles.rb_top_right}>
                                Top Orders Last Month
                            </div>
                            <div className={styles.rb_bot_left}>
                                <div style={{gridColumnStart: "1", gridColumnEnd: "2", gridRowStart: "1", gridRowEnd: "2", textAlign: "center", fontSize: "2.2vh"}}>
                                    B:
                                </div>
                                <div style={{gridColumnStart: "2", gridColumnEnd: "3", gridRowStart: "1", gridRowEnd: "2", textAlign: "left", fontSize: "2.2vh"}}>
                                    #1 {bingTop[0]}
                                </div>
                                <div style={{gridColumnStart: "3", gridColumnEnd: "4", gridRowStart: "1", gridRowEnd: "2", textAlign: "left", fontSize: "2.2vh"}}>
                                    #2 {bingTop[1]}
                                </div>
                                <div style={{gridColumnStart: "1", gridColumnEnd: "2", gridRowStart: "2", gridRowEnd: "3", textAlign: "center", fontSize: "2.2vh"}}>
                                    G:
                                </div>
                                <div style={{gridColumnStart: "2", gridColumnEnd: "3", gridRowStart: "2", gridRowEnd: "3", textAlign: "left", fontSize: "2.2vh"}}>
                                    #1 {googleTop[0]}
                                </div>
                                <div style={{gridColumnStart: "3", gridColumnEnd: "4", gridRowStart: "2", gridRowEnd: "3", textAlign: "left", fontSize: "2.2vh"}}>
                                    #2 {googleTop[1]}
                                </div>
                            </div>
                            <div className={styles.rb_bot_right}>
                                <div style={{gridColumnStart: "1", gridColumnEnd: "2", gridRowStart: "1", gridRowEnd: "2", textAlign: "left", fontSize: "2.2vh"}}>
                                    Diag:
                                </div>
                                <div style={{gridColumnStart: "2", gridColumnEnd: "3", gridRowStart: "1", gridRowEnd: "2", textAlign: "left", fontSize: "2.2vh"}}>
                                    #1 {orderCount == 0 ? "NaN" : "healthy"}
                                </div>
                                <div style={{gridColumnStart: "3", gridColumnEnd: "4", gridRowStart: "1", gridRowEnd: "2", textAlign: "left", fontSize: "2.2vh"}}>
                                    #2 {orderCount == 0 ? "NaN" : "diabetes"}
                                </div>
                                <div style={{gridColumnStart: "1", gridColumnEnd: "2", gridRowStart: "2", gridRowEnd: "3", textAlign: "left", fontSize: "2.2vh"}}>
                                    Para:
                                </div>
                                <div style={{gridColumnStart: "2", gridColumnEnd: "3", gridRowStart: "2", gridRowEnd: "3", textAlign: "left", fontSize: "2.2vh"}}>
                                    #1 {orderCount == 0 ? "NaN" : "Procalcit..."}
                                </div>
                                <div style={{gridColumnStart: "3", gridColumnEnd: "4", gridRowStart: "2", gridRowEnd: "3", textAlign: "left", fontSize: "2.2vh"}}>
                                    #2 {orderCount == 0 ? "NaN" : "ALP"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    async function getRowCounts(){
        ///// Counter /////
        const urlBing = `${Constants.API_URL_BING_ENTRIES}/count`
        const resultBing = await axiosApiInstance.get(urlBing)
        if(resultBing.status === 200){
            setBingCount(resultBing.data)
        }
        const urlGoogle = `${Constants.API_URL_GOOGLE_ENTRIES}/count`
        const resultGoogle = await axiosApiInstance.get(urlGoogle)
        if(resultGoogle.status === 200){
            setGoogleCount(resultGoogle.data)
        }
        const urlLead = `${Constants.API_URL_LEAD_ENTRIES}/count`
        const resultLead = await axiosApiInstance.get(urlLead)
        if(resultLead.status === 200){
            setLeadCount(resultLead.data)
        }
        const urlOrder = `${Constants.API_URL_ORDER_ENTRIES}/count`
        const resultOrder = await axiosApiInstance.get(urlOrder)
        if(resultOrder.status === 200){
            setOrderCount(resultOrder.data)
        }

        //// Calendar /////
        const urlCalendar = `${Constants.API_URL_ORDER_ENTRIES}/date-count`
        const resultCalendar = await axiosApiInstance.get(urlCalendar)
        if(resultCalendar.status === 200){
            setCalendarData(resultCalendar.data)
        }

        ///// Swarm Plot /////
        const urlSwarm1 = `${Constants.API_URL_ORDER_ENTRIES}/price-count`
        const resultSwarm1 = await axiosApiInstance.get(urlSwarm1)

        const urlSwarm2 = `${Constants.API_URL_ORDER_ENTRIES}/orderprice-count`
        const resultSwarm2 = await axiosApiInstance.get(urlSwarm2)

        if(resultSwarm1.status === 200 && resultSwarm2.status === 200){
            setSwarmData([...resultSwarm1.data, ...resultSwarm2.data])
        }

        //// Top Terms ////
        const urlBingTop = `${Constants.API_URL_BING_ENTRIES}/topterms`
        const resultBingTop = await axiosApiInstance.get(urlBingTop)
        if(resultBingTop.status === 200 && resultBingTop.data.length === 2){
            if(resultBingTop.data[0].length > 10){
                resultBingTop.data[0] = resultBingTop.data[0].slice(0, 9)
                resultBingTop.data[0] += "..."
            }
            if(resultBingTop.data[1].length > 10){
                resultBingTop.data[1] = resultBingTop.data[1].slice(0, 9)
                resultBingTop.data[1] += "..."
            }
            setBingTop(resultBingTop.data)
        }

        const urlGoogleTop = `${Constants.API_URL_GOOGLE_ENTRIES}/topterms`
        const resultGoogleTop = await axiosApiInstance.get(urlGoogleTop)
        if(resultGoogleTop.status === 200 && resultGoogleTop.data.length === 2){
            if(resultGoogleTop.data[0].length > 10){
                resultGoogleTop.data[0] = resultGoogleTop.data[0].slice(0, 9)
                resultGoogleTop.data[0] += "..."
            }
            if(resultGoogleTop.data[1].length > 10){
                resultGoogleTop.data[1] = resultGoogleTop.data[1].slice(0, 9)
                resultGoogleTop.data[1] += "..."
            }
            setGoogleTop(resultGoogleTop.data)
        }
    }

    async function getFunnelData(){
        const urlBingImpr = `${Constants.API_URL_BING_ENTRIES}/impressions`
        const resultBingImpr = await axiosApiInstance.get(urlBingImpr)
        const urlBingClicks = `${Constants.API_URL_BING_ENTRIES}/clicks`
        const resultBingClicks = await axiosApiInstance.get(urlBingClicks)

        const urlGoogleImpr = `${Constants.API_URL_GOOGLE_ENTRIES}/impressions`
        const resultGoogleImpr = await axiosApiInstance.get(urlGoogleImpr)
        const urlGoogleClicks = `${Constants.API_URL_GOOGLE_ENTRIES}/clicks`
        const resultGoogleClicks = await axiosApiInstance.get(urlGoogleClicks)

        const urlOrders = `${Constants.API_URL_ORDER_ENTRIES}/month-count`
        const resultOrders = await axiosApiInstance.get(urlOrders)

        if(resultBingClicks.status === 200 && resultBingImpr.status === 200 && resultGoogleClicks.status === 200 && resultGoogleImpr.status === 200 && resultOrders.status === 200){
            var newFunnel = []
            var newDates = []

            let bi = 0, bc = 0, gi = 0, gc = 0, o = 0

            for(let i = 0; i < 6; i++){
                if(bi < resultBingImpr.data.length && bc < resultBingClicks.data.length && gi < resultGoogleImpr.data.length && gc < resultGoogleClicks.data.length && o < resultOrders.data.length){
                    if(resultBingImpr.data[bi].month === resultBingClicks.data[bc].month){
                        if(resultGoogleImpr.data[gi].month === resultGoogleClicks.data[gc].month){
                            if(resultBingImpr.data[bi].month === resultGoogleImpr.data[gi].month){
                                if(resultBingImpr.data[bi].month === resultOrders.data[o].month){
                                    newDates.push(resultBingImpr.data[i].month)
                                    newFunnel.push([
                                        {id: "impressions", value: (resultBingImpr.data[bi].value + resultGoogleImpr.data[gi].value) /10, label: (resultBingImpr.data[bi].value + resultGoogleImpr.data[gi].value)},
                                        {id: "clicks", value: resultBingClicks.data[bc].value + resultGoogleClicks.data[gc].value, label: resultBingClicks.data[bc].value + resultGoogleClicks.data[gc].value},
                                        {id: "orders", value: resultOrders.data[o].value * 5, label: resultOrders.data[i+1].value}
                                    ])
                                    bi++; bc++; gi++; gc++; o++;
                                } else {
                                    if(resultBingImpr.data[bi].month < resultOrders.data[o].month){
                                        while(resultBingImpr.data[bi].month < resultOrders.data[o].month){
                                            o++
                                            if(!(o < resultOrders.data.length)){
                                                break
                                            }
                                        }
                                    }
                                    if(resultBingImpr.data[bi].month > resultOrders.data[o].month){
                                        while(resultBingImpr.data[bi].month > resultOrders.data[o].month){
                                            bi++; bc++; gi++; gc++;
                                            if(!(bi < resultBingImpr.data.length) || !(bc < resultBingClicks.data.length) || !(gi < resultGoogleImpr.data.length) || !(gc < resultGoogleClicks.data.length)){
                                                break
                                            }
                                        }
                                    }
                                    i--
                                }
                            } else {
                                if(resultBingImpr.data[bi].month < resultGoogleImpr.data[gi].month){
                                    while(resultBingImpr.data[bi].month < resultGoogleImpr.data[gi].month){
                                        gi++; gc++;
                                        if(!(gi < resultGoogleImpr.data.length) || !(gc < resultGoogleClicks.data.length)){
                                            break
                                        }
                                    }
                                }
                                if(resultBingImpr.data[bi].month > resultGoogleImpr.data[gi].month){
                                    while(resultBingImpr.data[bi].month > resultGoogleImpr.data[gi].month){
                                        bi++; bc++;
                                        if(!(bi < resultBingImpr.data.length) || !(bc < resultBingClicks.data.length)){
                                            break
                                        }
                                    }
                                }
                                i--
                            }
                        } else {
                            if(resultGoogleImpr.data[gi].month < resultGoogleClicks.data[gc].month){
                                while(resultGoogleImpr.data[gi].month < resultGoogleClicks.data[gc].month){
                                    gc++
                                    if(!(gc < resultGoogleClicks.data.length)){
                                        break
                                    }
                                }
                            }
                            if(resultGoogleImpr.data[gi].month > resultGoogleClicks.data[gc].month){
                                while(resultGoogleImpr.data[gi].month > resultGoogleClicks.data[gc].month){
                                    gi++
                                    if(!(gi < resultGoogleImpr.data.length)){
                                        break
                                    }
                                }
                            }
                            i--
                        }
                    } else {
                        if(resultBingImpr.data[bi].month < resultBingClicks.data[bc].month){
                            while(resultBingImpr.data[bi].month < resultBingClicks.data[bc].month){
                                bc++
                                if(!(bc < resultBingClicks.data.length)){
                                    break
                                }
                            }
                        }
                        if(resultBingImpr.data[bi].month > resultBingClicks.data[bc].month){
                            while(resultBingImpr.data[bi].month > resultBingClicks.data[bc].month){
                                bi++
                                if(!(bi < resultBingImpr.data.length)){
                                    break
                                }
                            }
                        }
                        i--
                    }                  
                } else {
                    break
                }
            }

            if(newDates.length > 0 && newFunnel.length > 0){
                newDates.reverse()
                newFunnel.reverse()
                
                setDates(newDates)
                setFunnelData(newFunnel)
                setCycle(true)
            }
        }
    }
}



export default HomeScreen