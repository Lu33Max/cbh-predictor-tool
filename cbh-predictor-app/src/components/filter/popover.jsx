import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import styles from "../../pages/table/tablescreen.module.css"
import { useState } from 'react';

function FilterOverlay (handleChange,handleChangeFiltertype, handleSubmit, filtertype, filter) {
    return (
        <Popover id="popover-basic">
            <Popover.Header><h5>Filter</h5></Popover.Header>
            <Popover.Body className={styles.popover}>
                <h4>Type:<select className={styles.filterSelect} onChange={handleChangeFiltertype}>
                    <option value="single">Single</option>
                    <option value="range">Range</option>
                    <option value="compare">Compare</option>
                </select></h4>
                {/*different interfaces for filter*/}
                {filtertype === 'single' &&
                <div>
                    <h5>Column</h5>
                    <input className={styles.filterInput} onChange={handleChange} name="col" value={filter.col || ''} type="text"/> 
                    <h5>Value</h5>
                    <input className={styles.filterInput} onChange={handleChange} name="value" value={filter.value || ''} type="text"/>
                    <h5>Exact?<input onChange={handleChange} type="checkbox" name="exact" checked={filter.exact}/></h5>
                </div>
                }
                {filtertype === 'range' &&
                    <div>
                    <h5>Column</h5>
                    <input className={styles.filterInput} onChange={handleChange} name="col" value={filter.col || ''} type="text"/> 
                    <h5>From</h5>
                    <input className={styles.filterInput} onChange={handleChange} name="fromVal" value={filter.fromVal || ''} type="text"/>
                    <h5>To</h5>
                    <input className={styles.filterInput} onChange={handleChange} name="toVal" value={filter.toVal || ''} type="text"/>
                </div>
                }
                {filtertype === 'compare' &&
                    <div>
                    <h5>Column</h5>
                    <input className={styles.filterInput} onChange={handleChange} name="col" value={filter.col || ''} type="text"/> 
                    <h5>Value</h5>
                    <input className={styles.filterInput} onChange={handleChange} name="value" value={filter.value || ''} type="text"/>
                    <h5>Before?<input onChange={handleChange} type="checkbox" name="before" checked={filter.before}/></h5>
                    
                </div>
                }
                <button className={styles.button_green} onClick={handleSubmit}>Apply</button>
            </Popover.Body>    
        </Popover>
    )
}

const PopoverButton = (props) => {
    const initialFilter = { col: "", value: "", exact: false, fromVal: "", toVal: "", before: false}

    const [filter,setFilter] = useState(initialFilter)
    const [filtertype, setfiltertype] = useState('single')

    const handleChange = (e) => {
        switch (e.target.name) {
            case "col":
                setFilter({
                    ...filter,
                    col: e.target.value
                })
                break
            case "value":
                setFilter({
                    ...filter,
                    value: e.target.value
                })
                break
            case "exact":
                setFilter({
                    ...filter,
                    exact: !filter.exact
                })
                break
            case "fromVal":
                setFilter({
                    ...filter,
                    fromVal: e.target.value
                })
                break
            case "toVal":
                setFilter({
                    ...filter,
                    toVal: e.target.value
                })
                break
            case "before":
                setFilter({
                    ...filter,
                    before: !filter.before
                })
                break     
            default:
                alert(`Error: Attribute ${e.target.name} of filter not found`)
                break
        }
    };

    const handleChangeFiltertype = (e) => {
        setfiltertype(e.target.value)
    };

    const handleSubmit = () => {
        var newFilter
        switch(filtertype){
            case "single":
                if(!filter.col || !filter.value){
                    alert("All inputs have to be valid")
                    return
                } else {
                    newFilter = { type: "single", val1: filter.col, val2: filter.value, val3: filter.exact }
                }
                break
            case "range":
                if(!filter.col || !filter.fromVal || !filter.toVal){
                    alert("All inputs have to be valid")
                    return
                } else {
                    newFilter = {type: "range", val1: filter.col, val2: filter.fromVal, val3: filter.toVal }
                }
                break
            case "compare":
                if(!filter.col || !filter.value){
                    alert("All inputs have to be valid")
                    return
                } else {
                    newFilter = { type: "compare", val1: filter.col, val2: filter.value, val3: filter.before }
                }
                break
            default:
                alert(`Error: Filter ${filtertype} not found`)
                return
        }
        
        props.addFilter(newFilter)
        setFilter(initialFilter)
    }

    /*const handleSubmit = () => {

        var url
        switch (table) {
            case 'Bing':
                url = `${Constants.API_URL_BING_ENTRIES}`;
                break;
            case 'Google':
                url = `${Constants.API_URL_GOOGLE_ENTRIES}`;
                break;
            case 'Lead':
                url = `${Constants.API_URL_LEAD_ENTRIES}`;
                break;
            case 'Order':
                url = `${Constants.API_URL_ORDER_ENTRIES}`;
                break;
            default:
                alert(`Error: Table with name "${table}" does not exist`)
                return;
        }
        
        switch (filtertype) {
            case "single":
                url = url + `/AddSingleFilter/${filter.col}/${filter.value}/${filter.exact}`;
                break;
            case "range":
                url = url + `/AddRangeFilter/${filter.col}/${filter.fromVal}/${filter.toVal}`;
                break;
            case "compare":
                url = url + `/AddCompareFilter/${filter.col}/${filter.value}/${filter.before}`;
                break;        
            default:
                break;
        }
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(responseFromServer => {
            console.log(responseFromServer);
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });

        switch (table) {
            case 'Bing':
                url = `${Constants.API_URL_BING_ENTRIES}/ApplyFilter/AND`;
                break;
            case 'Google':
                url = `${Constants.API_URL_GOOGLE_ENTRIES}/ApplyFilter/AND`;
                break;
            case 'Lead':
                url = `${Constants.API_URL_LEAD_ENTRIES}/ApplyFilter/AND`;
                break;
            case 'Order':
                url = `${Constants.API_URL_ORDER_ENTRIES}/ApplyFilter/AND`;
                break;
            default:
                alert(`Error: Table with name "${table}" does not exist`)
                return;
        }

        fetch(url, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(entriesFromServer => {
            setEntries(entriesFromServer);
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });
    }*/

    return(
        <OverlayTrigger trigger="click" placement="left" overlay={FilterOverlay(handleChange, handleChangeFiltertype, handleSubmit, filtertype, filter)}>
            <button className={styles.button_popover}>+</button>
        </OverlayTrigger>
    )
};

export default PopoverButton;
