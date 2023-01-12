import { useState, useEffect } from "react"
import axios from "axios";
import { saveAs } from "file-saver"
import Table from "../../components/table/table"
import FileUploadForm from "../../components/forms/fileUploadForm"
import CreateEntryForm from "../../components/forms/createEntryForm"
import UpdateEntryForm from "../../components/forms/updateEntryForm"
import PopoverButton from "../../components/filter/popover";
import Constants from "../../utilities/Constants"
import styles from "./tablescreen.module.css"
import { useNavigate } from "react-router-dom";

const TableScreen = (props) => {
    const [entries, setEntries] = useState([])
    const [allEntries, setAllEntries] = useState([])
    const [activeTable, setActiveTable] = useState(props.table)
    const [showFileUpload, setShowFileUpload] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [entryToUpdate, setEntryToUpdate ] = useState(null)
    const [rows, setRows] = useState(100)
    const [filters, setFilters] = useState([])
    const [andRelation, setAndRelation] = useState(true)
    const navigate = useNavigate()

    console.log("Table Render")

    useEffect(() => {
        setActiveTable(props.table)
    },[props.table])

    useEffect(() => {
        getAllEntries()
    },[activeTable])

    useEffect(() => {
        if(Object.keys(filters).length !== 0){

            var newEntries = []
            var filtered = []

            for(var i = 0; i < filters.length; i++){
                if(i === 0 || !andRelation){
                    switch (filters[i].type){
                        case "single":
                            for(var j = 0; j < allEntries.length; j++){
                                if(filters[i].val3 === true){
                                    if(allEntries[j][filters[i].val1] == filters[i].val2){
                                        if(!newEntries.find(e => e.id === allEntries[j].id)){
                                            newEntries.push(allEntries[j])
                                        }
                                    }
                                } else {
                                    if((allEntries[j][filters[i].val1] + "").toLowerCase().includes(filters[i].val2)){
                                        if(!newEntries.find(e => e.id === allEntries[j].id)){
                                            newEntries.push(allEntries[j])
                                        }
                                    }
                                }
                            }
                            break
                        case "range":
                            for(var k = 0; k < allEntries.length; k++){
                                if(allEntries[k][filters[i].val1] >= filters[i].val2 && allEntries[k][filters[i].val1] <= filters[i].val3){
                                    if(!newEntries.find(e => e.id === allEntries[k].id)){
                                        newEntries.push(allEntries[k])
                                    }
                                }
                            }
                            break
                        case "compare":
                            for(var l = 0; l < allEntries.length; l++){
                                if(filters[i].val3){
                                    if(allEntries[l][filters[i].val1] <= filters[i].val2){
                                        if(!newEntries.find(e => e.id === allEntries[l].id)){
                                            newEntries.push(allEntries[l])
                                        }
                                    }
                                } else {
                                    if(allEntries[l][filters[i].val1] >= filters[i].val2){
                                        if(!newEntries.find(e => e.id === allEntries[l].id)){
                                            newEntries.push(allEntries[l])
                                        }
                                    }
                                }
                            }
                            break
                        default:
                            alert(`Error: Filtertype ${filters[i].type} not found`)
                            return
                    }
                } else {
                    newEntries = []
                    switch (filters[i].type){
                        case "single":
                            for(var m = 0; m < filtered.length; m++){
                                if(filters[i].val3 === true){
                                    if(filtered[m][filters[i].val1] == filters[i].val2){
                                        if(!newEntries.find(e => e.id === filtered[m].id)){
                                            newEntries.push(filtered[m])
                                        }
                                    }
                                } else {
                                    if((filtered[m][filters[i].val1] + "").toLowerCase().includes(filters[i].val2)){
                                        if(!newEntries.find(e => e.id === filtered[m].id)){
                                            newEntries.push(filtered[m])
                                        }
                                    }
                                }
                            }
                            break
                        case "range":
                            for(var n = 0; n < filtered.length; n++){
                                if(filtered[n][filters[i].val1] >= filters[i].val2 && filtered[n][filters[i].val1] <= filters[i].val3){
                                    if(!newEntries.find(e => e.id === filtered[n].id)){
                                        newEntries.push(filtered[n])
                                    }
                                }
                            }
                            break
                        case "compare":
                            for(var o = 0; o < filtered.length; o++){
                                if(filters[i].val3){
                                    if(filtered[o][filters[i].val1] <= filters[i].val2){
                                        if(!newEntries.find(e => e.id === filtered[o].id)){
                                            newEntries.push(filtered[o])
                                        }
                                    }
                                } else {
                                    if(filtered[o][filters[i].val1] >= filters[i].val2){
                                        if(!newEntries.find(e => e.id === filtered[o].id)){
                                            newEntries.push(filtered[o])
                                        }
                                    }
                                }
                            }
                            break
                        default:
                            alert(`Error: Filtertype ${filters[i].type} not found`)
                            return
                    }
                }
                filtered = newEntries
            }

            if(andRelation && filters.length > 1) {
                setEntries(filtered)
            } else {
                setEntries(newEntries)
            }
            
        } else {
            setEntries(allEntries)
        }

    },[filters, allEntries, andRelation])

    const handleRowChange = (e) => {
        setRows(e.target.value)
        getAllEntries()
    };

    const DelButton = (props) => {
        return(
            <button onClick={() => {removeFilter(props.index)}}>X</button>
        )
    }

    return(
        <div className={styles.body}>
            {(showFileUpload === true) && (<FileUploadForm onFileUploaded={onFileUploaded} table={activeTable}/>)}
            {(showCreateForm === true) && (<CreateEntryForm onEntryCreated={onEntryCreated} table={activeTable}/> )}
            {(activeTable !== '' && showFileUpload === false && showCreateForm === false) && (
                <>
                    {(entryToUpdate === null) && (
                        <>
                            <button onClick={() => navigate("/")} className={styles.button_backarrow}>&#60;</button>
                            <button onClick={() => setShowCreateForm(true)} className={styles.button_newentry}>Create New Entry</button>
                            <button onClick={() => deleteAllEntries()} className={styles.button_deleteentries}>Delete All Entries</button>
                            {(Object.keys(allEntries).length === 0) && (
                                <div>
                                    Please upload a table to view its content
                                </div>
                            )}
                            {(Object.keys(allEntries).length !== 0) && (
                                <div styles={styles.tableview}>
                                    <div className={styles.grid}>
                                        <input className={styles.rowInput} value={rows} name="rows" type="text" onChange={handleRowChange}/><label className={styles.rows}>Rows</label>
                                        <div className={styles.filter_container}>
                                            {showFilter()}
                                        </div>
                                        <button onClick={() => setAndRelation(!andRelation)} className={styles.button_relation}>{(andRelation) ? "and" : "or"}</button>
                                        <PopoverButton addFilter={addFilter} table={activeTable}/>  
                                    </div>
                                    <div className={styles.container}>
                                        <Table data={entries} rowsPerPage={rows} type={activeTable} getAllEntries={getAllEntries} deleteEntry={deleteSingleEntry} updateEntry={updateEntry}/>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {(entryToUpdate !== null) && <UpdateEntryForm entry={entryToUpdate} table={activeTable} onEntryUpdated={onEntryUpdated}/>}
                </>
            )}            
        </div>
    )

    //// FILTER METHODS ////
    function showFilter(){
        return(
            <>
                {filters.map((filter) => (
                    <>
                        {(filter.type === 'single') && (
                            <>
                                {(filter.val3) && (
                                    <label>{filter.val1} = {filter.val2}<DelButton index={filter}/></label>
                                )}
                                {(!filter.val3) && (
                                    <label>{filter.val1} = "{filter.val2}"<DelButton index={filter}/></label>
                                )}
                            </>
                        )}
                        {(filter.type === 'range') && (
                            <label>{filter.val2} &#60; {filter.val1} &#60; {filter.val3}<DelButton index={filter}/></label>
                        )}
                        {(filter.type === 'compare') && (
                            <>
                                {(filter.val3) ? (<label>{filter.val1} &#60; {filter.val2}<DelButton index={filter}/></label>) : (<label>{filter.val1} &#62; {filter.val2}<DelButton index={filter}/></label>)}
                            </>
                        )}
                    </>
                ))}
            </>
        )
    }
    function addFilter(newFilter){
        setFilters([newFilter, ...filters])
    }
    function removeFilter(index){
        setFilters(
            filters.filter(
                a => a !== index
            )
        )
    }

    //// INTERNAL METHODS ////
    function onFileUploaded(created){
        if(created) alert(`Sucessfully uploaded the file contents to "${activeTable}" Table.`)
        setShowFileUpload(false)
        setActiveTable('')
    }
    function onEntryCreated(created){
        if (created !== null) alert(`Entry succesfully created. After clicking OK, your new Entry will show up in the table below.`);
        setShowCreateForm(false)
        getAllEntries();
    }
    function updateEntry(entry){
        setEntryToUpdate(entry)
    }
    function onEntryUpdated(updatedEntry){
        setEntryToUpdate(null);
        if (updatedEntry === null) return;
        alert(`Entry successfully updated. After clicking OK, look for the Entry in the table below to see the updates.`);
        getAllEntries();
    }

    //// SERVER REQUESTS ////
    function getAllEntries(){
        var url;
  
        switch (activeTable) {
        case 'Bing':
            url = Constants.API_URL_BING_ENTRIES;
            break;
        case 'Google':
            url = Constants.API_URL_GOOGLE_ENTRIES;
            break;
        case 'Lead':
            url = Constants.API_URL_LEAD_ENTRIES;
            break;
        case 'Order':
            url = Constants.API_URL_ORDER_ENTRIES;
            break;
        default:
            alert(`Error: Table with name "${activeTable}" does not exist`)
            return;
        }
      
        fetch(url, {
          method: 'GET'
        })
        .then(response => response.json())
        .then(entriesFromServer => {
          setAllEntries(entriesFromServer);
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
        
    }

    function deleteAllEntries(){
        var url;
    
        switch (activeTable) {
          case 'Bing':
            url = Constants.API_URL_BING_ENTRIES;
            break;
          case 'Google':
            url = Constants.API_URL_GOOGLE_ENTRIES;
            break;
          case 'Lead':
            url = Constants.API_URL_LEAD_ENTRIES;
            break;
          case 'Order':
            url = Constants.API_URL_ORDER_ENTRIES;
            break;
          default:
            alert(`Error: Table with name "${activeTable}" does not exist`)
            return;
        }
    
        fetch(url, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(responseFromServer => {
          console.log(responseFromServer);
          alert(`Sucessfully deleted Entries from "${activeTable}" Table.`);
          getAllEntries()
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    }

    function deleteSingleEntry(id){
        var url;

        switch (activeTable) {
        case 'Bing':
            url = `${Constants.API_URL_BING_ENTRIES}/${id}`;
            break;
        case 'Google':
            url = `${Constants.API_URL_GOOGLE_ENTRIES}/${id}`;
            break;
        case 'Lead':
            url = `${Constants.API_URL_LEAD_ENTRIES}/${id}`;
            break;
        case 'Order':
            url = `${Constants.API_URL_ORDER_ENTRIES}/${id}`;
            break;
        default:
            alert(`Error: Table with name "${activeTable}" does not exist`)
            return;
        }

        fetch(url, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(responseFromServer => {
            console.log(responseFromServer);
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });

        alert('Entry successfully deleted. After clicking OK, look at the table below to see your Entry disappear.');
        getAllEntries();
    }

    function exportToExcel(table) {
        var base;

        switch (table) {
        case 'Bing':
            base = Constants.API_URL_BING_ENTRIES;
            break;
        case 'Google':
            base = Constants.API_URL_GOOGLE_ENTRIES;
            break;
        case 'Lead':
            base = Constants.API_URL_LEAD_ENTRIES;
            break;
        case 'Order':
            base = Constants.API_URL_ORDER_ENTRIES;
            break;
        default:
            alert(`Error: Table with name "${table}" does not exist`)
            return;
        }

        let instance = axios.create({  baseURL: base });  
        let options = { 
          url: 'ExportToExcel',
          method: 'GET',
          responseType: 'blob'
        };
        return instance.request(options)
          .then(response => { 
            let filename = response.headers['content-disposition']
              .split(';')
              .find((n) => n.includes('filename='))
              .replace('filename=', '')
              .trim();      
            let url = window.URL
              .createObjectURL(new Blob([response.data]));     
            saveAs(url, filename);    
        });
    }
}

export default TableScreen