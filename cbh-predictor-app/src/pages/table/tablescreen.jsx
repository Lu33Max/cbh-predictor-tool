import { useState, useEffect } from "react"
import axiosApiInstance from "../../services/interceptor";
import { saveAs } from "file-saver"
import { useNavigate } from "react-router-dom";

import Table from "../../components/table/table"
import FileUploadForm from "../../components/forms/fileUploadForm"
import CreateEntryForm from "../../components/forms/createEntryForm"
import UpdateEntryForm from "../../components/forms/updateEntryForm"
import PopoverButton from "../../components/filter/popover";
import Constants from "../../utilities/Constants"
import styles from "./tablescreen.module.css"

import authService from "../../services/auth.service";

const TableScreen = (props) => {
    const [entries, setEntries] = useState([])
    const [allEntries, setAllEntries] = useState([])
    const [activeTable, setActiveTable] = useState(props.table)
    const [showFileUpload, setShowFileUpload] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [entryToUpdate, setEntryToUpdate ] = useState(null)
    const [rows, setRows] = useState(100)
    const [filters, setFilters] = useState([])
    const [sort, setSort] = useState(null)
    const [andRelation, setAndRelation] = useState(true)

    const user = authService.getCurrentUser()
    const navigate = useNavigate()

    useEffect(() => {
        if(!user) navigate("/login")
    },[])

    useEffect(() => {
        setActiveTable(props.table)

        switch(props.table){
            case 'Bing':
            case 'Google':
                setSort("ORDER BY terms ASC")
                break
            case 'Lead':
                setSort("ORDER BY leadID ASC")
                break
            case 'Order':
                setSort("ORDER BY orderID ASC")
                break
            default:
                break
        }
    },[props.table])

    useEffect(() => {
        applyFilters()
        getAllEntries()
    },[activeTable])

    const applyFilters = async () => {
        let url
        switch(activeTable){
            case "Bing":
                url = `${Constants.API_URL_BING_ENTRIES}/filter/${andRelation}/${sort}/null`
                break
            case "Google":
                url = `${Constants.API_URL_GOOGLE_ENTRIES}/filter/${andRelation}/${sort}/null`
                break
            case "Lead":
                url = `${Constants.API_URL_LEAD_ENTRIES}/filter/${andRelation}/${sort}/null`
                break
            case "Order":
                url = `${Constants.API_URL_ORDER_ENTRIES}/filter/${andRelation}/${sort}/null`
                break
            default:
                alert(`Error: Table with name "${activeTable}" does not exist`)
                return;
        }

        const result = await axiosApiInstance.post(url, filters, {'Content-Type': 'application/json'})
        if(result.status === 200){
            setEntries(result.data)
        }
    }

    useEffect(() => {
        applyFilters()
    }, [filters, andRelation, sort])

    const handleRowChange = (e) => {
        setRows(e.target.value)
        applyFilters()
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
                            <button onClick={() => setShowFileUpload(true)} className={styles.button_uploadtable}>Upload Excel File</button>
                            <button onClick={() => exportToExcel()} className={styles.button_exporttable}>Export to Excel</button>
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
                                    <div>
                                        <Table data={entries} rowsPerPage={rows > 0 ? rows : 1} type={activeTable} setEntries={setAllEntries} deleteEntry={deleteSingleEntry} updateEntry={updateEntry} applySort={applySort}/>
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
                {filters.map((filter, index) => (
                    <label>{filter[1]}&nbsp;{<button onClick={() => {removeFilter(index)}}>X</button>}</label>
                ))}
            </>
        )
    }
    function addFilter(newFilter){
        setFilters([newFilter, ...filters])
    }
    function removeFilter(i){
        setFilters(filters.filter((a,index)=> index !== i))
    }
    function applySort(sort){
        setSort(sort)
    }

    //// INTERNAL METHODS ////
    function onFileUploaded(created){
        if(created) alert(`Sucessfully uploaded the file contents to "${activeTable}" Table.`)
        setShowFileUpload(false)
        applyFilters()
    }
    function onEntryCreated(created){
        if (created !== null) alert(`Entry succesfully created.`);
        setShowCreateForm(false)
        applyFilters();
    }
    function updateEntry(entry){
        setEntryToUpdate(entry)
    }
    function onEntryUpdated(updatedEntry){
        setEntryToUpdate(null);
        if (updatedEntry === null) return;
        alert(`Entry successfully updated.`);
        applyFilters();
    }

    //// SERVER REQUESTS ////
    async function getAllEntries(){
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

        const result = await axiosApiInstance.get(url)
        if(result.status === 200) {
            setAllEntries(result.data)
        }
    }

    async function deleteAllEntries(){
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
    
        const result = await axiosApiInstance.delete(url)
        if(result.status === 200) {
            alert("Entries successfully deleted")
            applyFilters()
        }
    }

    async function deleteSingleEntry(id){
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

        const result = await axiosApiInstance.delete(url)
        if(result.status === 200) {
            alert("Entry successfully deleted")
            applyFilters()
        }
    }

    async function exportToExcel() {
        var base;

        switch (activeTable) {
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
            alert(`Error: Table with name "${activeTable}" does not exist`)
            return;
        }

        let options = { 
            url: '/ExportToExcel',
            method: 'GET',
            baseURL: base,
            responseType: 'blob',
        };
        return axiosApiInstance.request(options)
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