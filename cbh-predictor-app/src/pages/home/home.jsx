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
    const [funnelData, setFunnelData] = useState([[{id: "", value:1, label: ""}]])
    const [dates, setDates] = useState([])
    const [activeDate, setActiveDate] = useState(0)
    const [cycle, setCycle] = useState(false)

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
                console.log(dateIndex)
                dateIndex++
                if(dateIndex >= dates.length){
                    dateIndex = 0
                }
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
                                B:&nbsp;&nbsp;#1 biorepository&nbsp;&nbsp;&thinsp;&thinsp;#2 ffpe tissue<br/>
                                G:&thinsp;&thinsp;#1 ffpe&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#2 biobank
                            </div>
                            <div className={styles.rb_bot_right}>
                                Diag:&nbsp;&nbsp;#1 healthy&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#2 diabetes<br/>
                                Para:&nbsp;&nbsp;#1 Procalcit... #2 ALP
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

            let max = 6
            while(max >= resultBingImpr.data.length || max >= resultGoogleImpr.data.length || max >= resultOrders.data.length){
                max--
            }

            for(let i = 0; i < max; i++){
                newDates.push(resultBingImpr.data[i].month)
                newFunnel.push([
                    {id: "impressions", value: (resultBingImpr.data[i].value + resultGoogleImpr.data[i].value) /10, label: (resultBingImpr.data[i].value + resultGoogleImpr.data[i].value)},
                    {id: "clicks", value: resultBingClicks.data[i].value + resultGoogleClicks.data[i].value, label: resultBingClicks.data[i].value + resultGoogleClicks.data[i].value},
                    {id: "orders", value: resultOrders.data[i+1].value * 5, label: resultOrders.data[i+1].value}
                ])
            }
            newDates.reverse()
            newFunnel.reverse()
            
            setDates(newDates)
            setFunnelData(newFunnel)
            setCycle(true)
        }
    }
}



export default HomeScreen