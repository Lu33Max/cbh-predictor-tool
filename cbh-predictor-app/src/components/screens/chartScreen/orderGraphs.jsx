import React, { useState, useEffect } from "react";
import { PieChart } from "./charts/pieChart";
import Constants from "../../../utilities/Constants";
import styles from "./graphs.module.css"
import axios from "axios";

var primaryScheme = ['#5fc431','#71d055','#83dc73','#96e890','#abf4ab','#c0ffc6','#a1e5ad','#82cc96','#62b37f','#429a6a','#188255','#429a6a','#62b37f','#82cc96','#a1e5ad','#c0ffc6','#abf4ab','#96e890','#83dc73','#71d055']

//// MAPPING FUNCTIONS ////
function getMatrices(entries, minOcc) {
    const data = []
    var others = 0

    entries.map(function(entry){
        if(data.find(e => e.id === entry.matrix)) {
            data[data.findIndex((e => e.id === entry.matrix))].value++
        } else {
            data.push({
                id: entry.matrix,
                name: entry.matrix,
                value: 1
            })
        }
    })

    for(let i = 0; i <= data.length; i++){
        if(data[i]){
            if(data[i].value < minOcc){
                others += data[i].value
                data.splice(i, 1)
                i--
            }
        }
    }

    data.push({
        id: "others",
        name: "others",
        value: others
    })

    return data
}

//// RENDER VIEW ////
const OrderChart = () => {
    const [minOcc, setMinOcc] = useState(150)

    const onInputChange = (e) => {
        switch(e.target.name){
            case 'minOcc':
                setMinOcc(e.target.value)
                return
            default:
                return
        }
    }

    return(
        <div className={styles.grid_container}>
            <div className={styles.impressions_wrapper}>
                <h3>Matrix</h3>
                <PieChart data={GetAllEntries('matrix', minOcc)} scheme={primaryScheme}/>
                <div className={styles.min}>Min. Occurrences: <input className={styles.min_input} value={minOcc} name="minOcc" type="number" onChange={onInputChange}/> </div>
            </div>
        </div>
    )
}

//// GETTER METHODS ////
function GetAllEntries(type, props){
    const url = Constants.API_URL_ORDER_ENTRIES;
    const [entries, setEntries] = useState([])

    useEffect(() => {
        axios.get(url)
        .then(res => {
            setEntries(res.data);
        })
    }, [])

    switch(type){
        case 'matrix':
            return getMatrices(entries, props)
        default:
            return
    }
}

export default OrderChart