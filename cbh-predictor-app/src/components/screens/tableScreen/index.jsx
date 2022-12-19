import { useState } from "react"
import axios from "axios";
import { saveAs } from "file-saver";
import Table from "./table/table"
import FileUploadForm from "./forms/fileUploadForm";
import CreateEntryForm from "./forms/createEntryForm";
import UpdateEntryForm from "./forms/updateEntryForm";
import Constants from "../../../utilities/Constants";
import styles from "./index.module.css"

const TableScreen = () => {
    const [entries, setEntries] = useState([])
    const [activeTable, setActiveTable] = useState('')
    const [showFileUpload, setShowFileUpload] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [entryToUpdate, setEntryToUpdate ] = useState(null)
    const [rows, setRows] = useState(100)
    
    const handleRowChange = (e) => {
        setRows(e.target.value)
        getAllEntries(activeTable)
    };

    return(
        <div className={styles.body}>
            {(activeTable === '' && showFileUpload === false && showCreateForm === false) && (
                <div>
                    <div>
                        <h3>Bing Search Terms</h3>
                        <button className={styles.button_black}>Graphical Analysis</button>
                        <button onClick={() => getAllEntries('Bing')} className={styles.button_green}>Show Table</button>
                        <button onClick={() => {setShowFileUpload(true); setActiveTable('Bing');}} className={styles.button_gray}>Upload Excel File</button>
                        <button onClick={() => exportToExcel('Bing')} className={styles.button_gray}>Export to Excel File</button>
                    </div>
                    <div className={styles.table}>
                        <h3>Google Search Terms</h3>
                        <button className={styles.button_black}>Graphical Analysis</button>
                        <button onClick={() => getAllEntries('Google')} className={styles.button_green}>Show Table</button>
                        <button onClick={() => {setShowFileUpload(true); setActiveTable('Google');}} className={styles.button_gray}>Upload Excel File</button>
                        <button onClick={() => exportToExcel('Google')} className={styles.button_gray}>Export to Excel File</button>
                    </div>
                    <div className={styles.table}>
                        <h3>Lead Entries</h3>
                        <button className={styles.button_black}>Graphical Analysis</button>
                        <button onClick={() => getAllEntries('Lead')} className={styles.button_green}>Show Table</button>
                        <button onClick={() => {setShowFileUpload(true); setActiveTable('Lead');}} className={styles.button_gray}>Upload Excel File</button>
                        <button onClick={() => exportToExcel('Lead')} className={styles.button_gray}>Export to Excel File</button>
                    </div>
                    <div className={styles.table}>
                        <h3>Order Entries</h3>
                        <button className={styles.button_black}>Graphical Analysis</button>
                        <button onClick={() => getAllEntries('Order')} className={styles.button_green}>Show Table</button>
                        <button onClick={() => {setShowFileUpload(true); setActiveTable('Order');}} className={styles.button_gray}>Upload Excel File</button>
                        <button onClick={() => exportToExcel('Order')} className={styles.button_gray}>Export to Excel File</button>
                    </div>
                </div>
            )}
            {(showFileUpload === true) && (<FileUploadForm onFileUploaded={onFileUploaded} table={activeTable}/>)}
            {(showCreateForm === true) && (<CreateEntryForm onEntryCreated={onEntryCreated} table={activeTable}/> )}
            {(activeTable !== '' && showFileUpload === false && showCreateForm === false) && (
                <>
                    {(entryToUpdate === null) && (
                        <>
                            <button onClick={() => setActiveTable('')} className={styles.button_backarrow}>&#60;</button>
                            <button onClick={() => setShowCreateForm(true)} className={styles.button_newentry}>Create New Entry</button>
                            <button onClick={() => deleteAllEntries()} className={styles.button_deleteentries}>Delete All Entries</button>
                            {(Object.keys(entries).length === 0) && (
                                <div>
                                    Please upload a table to view its content
                                </div>
                            )}
                            {(Object.keys(entries).length !== 0) && (
                                <>
                                    <div styles={styles.tableview}>
                                        <div classname={styles.row}>
                                            <input className={styles.rowInput} value={rows} name="rows" type="text" onChange={handleRowChange}/>  Rows
                                        </div>
                                        <div className={styles.container}>
                                            <Table data={entries} rowsPerPage={rows} type={activeTable} getAllEntries={getAllEntries} deleteEntry={deleteSingleEntry} updateEntry={updateEntry}/>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {(entryToUpdate !== null) && <UpdateEntryForm entry={entryToUpdate} table={activeTable} onEntryUpdated={onEntryUpdated}/>}
                </>
            )}
        </div>
    )

    //// INTERNAL METHODS ////
    function onFileUploaded(created){
        if(created) alert(`Sucessfully uploaded the file contents to "${activeTable}" Table.`)
        setShowFileUpload(false)
        setActiveTable('')
    }
    function onEntryCreated(created){
        if (created !== null) alert(`Entry succesfully created. After clicking OK, your new Entry will show up in the table below.`);
        setShowCreateForm(false)
        getAllEntries(activeTable);
    }
    function updateEntry(entry){
        setEntryToUpdate(entry)
    }
    function onEntryUpdated(updatedEntry){
        setEntryToUpdate(null);
        if (updatedEntry === null) return;
        alert(`Entry successfully updated. After clicking OK, look for the Entry in the table below to see the updates.`);
        getAllEntries(activeTable);
      }

    //// SERVER REQUESTS ////
    function getAllEntries(table){
        setActiveTable(table);
        var url;
  
        switch (table) {
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
          getAllEntries(activeTable)
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
        getAllEntries(activeTable);
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