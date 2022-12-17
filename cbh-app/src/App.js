import React, { useState } from "react";
import Constants from "./utilities/Constants"
import BingCreateForm from "./components/BingCreateForm"
import BingUpdateForm from "./components/BingUpdateForm"
import GoogleCreateForm from "./components/GoogleCreateForm"
import GoogleUpdateForm from "./components/GoogleUpdateForm"
import LeadCreateForm from "./components/LeadCreateForm"
import LeadUpdateForm from "./components/LeadUpdateForm"
import OrderCreateForm from "./components/OrderCreateForm"
import OrderUpdateForm from "./components/OrderUpdateForm"
import FileUploadForm from "./components/FileUploadForm"
import LogInForm from "./components/LogInForm"

import styles from "./App.module.css";
import Table from "./components/Table";

window.$activeTable = "";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [showingCreateNewEntryForm, setShowingCreateNewEntryForm] = useState(false);
  const [entryCurrentlyBeingUpdated, setEntryCurrentlyBeingUpdated] = useState(null);
  const [showingFileUploadForm, setShowingFileUploadForm] = useState(false);
  const [filter, setFilter] = useState({
    col: '',
    value: '',
    exact: false
  });
  const [showingLogInForm, setShowingLogInForm] = useState(true);
  const [rows, setRows] = useState(100);

  const handleRowChange = (e) => {
    setRows(e.target.value)
    getEntries(window.$activeTable)
};

  //// Basic CRUD Operations ////
  // Get all entries from Server
  function getEntries(table){
    setEntries([]);
    window.$activeTable = table;
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
  // Delete entry by ID
  function deleteEntry(id){
    var url;

    switch (window.$activeTable) {
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
        alert(`Error: Table with name "${window.$activeTable}" does not exist`)
        return;
    }

    fetch(url, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(responseFromServer => {
      console.log(responseFromServer);
      onEntryDeleted(id);
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
  }
  // Delete all entries from Table
  function deleteAllEntries(){
    var url;

    switch (window.$activeTable) {
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
        alert(`Error: Table with name "${window.$activeTable}" does not exist`)
        return;
    }

    fetch(url, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(responseFromServer => {
      console.log(responseFromServer);
      onEntriesDeleted();
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
  }

  //// Filter ////
  // Set Filter Settings
  const handleFilterChange = (e) => {
    if(e.target.name !== "exact"){
      setFilter({...filter, [e.target.name]: e.target.value});
    }
    else
    {
      setFilter({...filter, [e.target.name]: e.target.checked});
    }
  }
  // Apply Filter
  function getFilteredEntries(){
    setEntries([]);
    var url;

    switch (window.$activeTable) {
      case 'Bing':
        url = `${Constants.API_URL_BING_ENTRIES}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
        break;
      case 'Google':
        url = `${Constants.API_URL_GOOGLE_ENTRIES}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
        break;
      case 'Lead':
        url = `${Constants.API_URL_LEAD_ENTRIES}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
        break;
      case 'Order':
        url = `${Constants.API_URL_ORDER_ENTRIES}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
        break;
      default:
        alert(`Error: Table with name "${window.$activeTable}" does not exist`)
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

  //// Rendered View ////
  return (
    <main>
      <div className="container-fluid">
        <div className="row min-vh-100">
          <div className="col d-flex flex-column justify-content-center align-items-center">
            {(showingCreateNewEntryForm === false && entryCurrentlyBeingUpdated === null && showingFileUploadForm === false && showingLogInForm === false) && (
              <div>
                <h1 className="mt-3">CBH Predictor Tool</h1>
                
                <div className="row mt-5">
                  <div className="col-sm">
                    <button onClick={() => getEntries('Bing')} className="btn btn-dark btn-lg w-100 h-100">Bing Table</button>
                  </div>
                  <div className="col-sm">
                    <button onClick={() => getEntries('Google')} className="btn btn-dark btn-lg w-100 h-100">Google Table</button>
                  </div>
                  <div className="col-sm">
                    <button onClick={() => getEntries('Lead')} className="btn btn-dark btn-lg w-100 h-100">Lead Table</button>
                  </div>
                  <div className="col-sm">
                    <button onClick={() => getEntries('Order')} className="btn btn-dark btn-lg w-100 h-100">Order Table</button>
                  </div>
                </div>

                {(window.$activeTable !== "") && showButtons()}
                {(window.$activeTable !== "") && showFilter()}
              </div>
            )}

            {showingFileUploadForm && showUploadForm()}
            {showingCreateNewEntryForm && showCreateForm()}
            {entryCurrentlyBeingUpdated !== null && showUpdateForm()}
            {showingLogInForm && showLogInForm()}
          </div>
        </div>
      </div>
      {(window.$activeTable !== "") && (
        <div className={styles.container}>
          <div>
            <input value={rows} name="rows" type="text" className="form-control" onChange={handleRowChange} />
          </div>
          <div className={styles.wrapper}>
            <Table data={entries} rowsPerPage={rows} />
          </div>
        </div>
      )}
    </main>
  );

  //// Show Buttons ////
  function showButtons(){
    return(
      <div className="mt-3">
        <button onClick={() => setShowingFileUploadForm(true)} className="btn btn-dark btn-lg w-100 mt-2">Upload Excel File</button>
        <button onClick={() => setShowingCreateNewEntryForm(true)} className="btn btn-secondary btn-lg w-100 mt-2">Create new Entry</button>
        <button onClick={() => { if(window.confirm(`Are you sure you want to delete all entries from table "${window.$activeTable}"?`)) deleteAllEntries() }} className="btn btn-danger btn-lg w-100 mt-2">Delete All Entries</button>
      </div>
    )
  }

  function showFilter(){
    return(
      <div className="mt-3">
        <div style={{border: '1px solid' , padding: '20px'}}>
          <label className="h3 form-label">Filter:</label><br></br>
          <label className="h5 form-label">Col:</label>
          <input value={filter.col} name="col" type="text" className="form-control" onChange={handleFilterChange} />
          <label className="h5 form-label">Value:</label>
          <input value={filter.value} name="value" type="text" className="form-control" onChange={handleFilterChange} />
          <label className="h5 form-label">Exact?  </label>
          <input className="mx-3" value={filter.exact} name="exact" type="checkbox" onChange={handleFilterChange} />
        </div>
        <button onClick={() => getFilteredEntries()} className="btn btn-success btn-lg w-50 mt-2">Apply</button>
        <button onClick={() => getEntries(window.$activeTable)} className="btn btn-dark btn-lg w-50 mt-2">Reset Filter</button>
      </div>
    )
  }

  //// Show Forms ////
  function showUploadForm(){
    return <FileUploadForm onFileUploaded={onFileUploaded}/>
  }
  function showCreateForm(){
    switch (window.$activeTable) {
      case 'Bing':
        return <BingCreateForm onEntryCreated={onEntryCreated} />
      case 'Google':
        return <GoogleCreateForm onEntryCreated={onEntryCreated} />
      case 'Lead':
        return <LeadCreateForm onEntryCreated={onEntryCreated} />
      case 'Order':
        return <OrderCreateForm onEntryCreated={onEntryCreated} />
      default:
        alert(`Error: Table with name "${window.$activeTable}" does not exist`)
        return;
    }
  }
  function showUpdateForm(){
    switch (window.$activeTable) {
      case 'Bing':
        return <BingUpdateForm entry={entryCurrentlyBeingUpdated} onEntryUpdated={onEntryUpdated} />
      case 'Google':
        return <GoogleUpdateForm entry={entryCurrentlyBeingUpdated} onEntryUpdated={onEntryUpdated} />
      case 'Lead':
        return <LeadUpdateForm entry={entryCurrentlyBeingUpdated} onEntryUpdated={onEntryUpdated} />
      case 'Order':
        return <OrderUpdateForm entry={entryCurrentlyBeingUpdated} onEntryUpdated={onEntryUpdated} />
      default:
        alert(`Error: Table with name "${window.$activeTable}" does not exist`)
        return;
    }
  }
  function showLogInForm(){
    return <LogInForm onLogIn={onLogIn}/>
  }

  //// Reset and Alert after each CRUD Operation ////
  function onFileUploaded(created){
    setShowingFileUploadForm(false);

    if(created) alert(`Sucessfully uploaded the file contents to "${window.$activeTable}" Table.`);
    getEntries(window.$activeTable);
  }
  function onEntryCreated(createdentry){
    setShowingCreateNewEntryForm(false);

    if (createdentry === null) {
      return;
    }

    alert(`Entry succesfully created. After clicking OK, your new Entry will show up in the table below.`);
    getEntries(window.$activeTable);
  }
  function onEntryUpdated(updatedEntry){
    setEntryCurrentlyBeingUpdated(null);

    if (updatedEntry === null) {
      return;
    }

    let entriesCopy = [...entries];

    const index = entriesCopy.findIndex((entriesCopyEntry, currentIndex) => {
      if (entriesCopyEntry.id === updatedEntry) {
        return true;
      }
    });

    if (index !== -1) {
      entriesCopy[index] = updatedEntry.id;
      
    }

    setEntries(entriesCopy);
    alert(`Entry successfully updated. After clicking OK, look for the Entry in the table below to see the updates.`);
    getEntries(window.$activeTable);
  }
  function onEntryDeleted(deletedEntryID){
    let entriesCopy = [...entries];

    const index = entriesCopy.findIndex((entriesCopyEntry, currentIndex) => {
      if (entriesCopyEntry.id === deletedEntryID) {
        return true;
      }
    });

    if (index !== -1) {
      entriesCopy.splice(index, 1);
    }

    setEntries(entriesCopy);
    alert('Entry successfully deleted. After clicking OK, look at the table below to see your Entry disappear.');
    getEntries(window.$activeTable);
  } 
  function onEntriesDeleted(){
    setEntries([]);
    alert(`Sucessfully deleted Entries from "${window.$activeTable}" Table.`);
    getEntries(window.$activeTable);
  }
  function onLogIn(login){
    if (login === true){
      setShowingLogInForm(false)
    }else {
      alert('Wrong Email or password. Try again.')
    }
    
  }
}