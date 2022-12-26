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
            var i = data.findIndex((e => e.id == entry.matrix))
            data[i].value++;
        } else {
            data.push({
                id: entry.matrix, 
                value: 1
            })
        }
    })

    function remove() {
        var i = data.findIndex((e => e.value < minOcc))
        data.splice(i, 1);
    }

    data.forEach(remove)

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

    return getMatrices(entries)
}

export default OrderChart