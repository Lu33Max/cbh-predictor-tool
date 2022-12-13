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

window.$activeTable = "";

export default function App() {
  const [entries, setentries] = useState([]);
  const [showingCreateNewentryForm, setShowingCreateNewentryForm] = useState(false);
  const [entryCurrentlyBeingUpdated, setentryCurrentlyBeingUpdated] = useState(null);
  const [showingFileUploadForm, setShowingFileUploadForm] = useState(false);
  const [filter, setFilter] = useState({
    col: '',
    value: '',
    exact: false
  });
  const [showingLogInForm, setShowingLogInForm] = useState(false);

  //// Basic CRUD Operations ////
  // Get all entries from Server
  function getentries(table){
    setentries([]);
    window.$activeTable = table;
    var url;

    switch (table) {
      case 'Bing':
        url = Constants.API_URL_BING_entries;
        break;
      case 'Google':
        url = Constants.API_URL_GOOGLE_entries;
        break;
      case 'Lead':
        url = Constants.API_URL_LEAD_entries;
        break;
      case 'Order':
        url = Constants.API_URL_ORDER_entries;
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
      setentries(entriesFromServer);
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
  }
  // Delete entry by ID
  function deleteentry(id){
    var url;

    switch (window.$activeTable) {
      case 'Bing':
        url = `${Constants.API_URL_BING_entries}/${id}`;
        break;
      case 'Google':
        url = `${Constants.API_URL_GOOGLE_entries}/${id}`;
        break;
      case 'Lead':
        url = `${Constants.API_URL_LEAD_entries}/${id}`;
        break;
      case 'Order':
        url = `${Constants.API_URL_ORDER_entries}/${id}`;
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
      onentryDeleted(id);
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
  }
  // Delete all entries from Table
  function deleteAllentries(){
    var url;

    switch (window.$activeTable) {
      case 'Bing':
        url = Constants.API_URL_BING_entries;
        break;
      case 'Google':
        url = Constants.API_URL_GOOGLE_entries;
        break;
      case 'Lead':
        url = Constants.API_URL_LEAD_entries;
        break;
      case 'Order':
        url = Constants.API_URL_ORDER_entries;
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
      onentriesDeleted();
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
  function getFilteredentries(){
    setentries([]);
    var url;

    switch (window.$activeTable) {
      case 'Bing':
        url = `${Constants.API_URL_BING_entries}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
        break;
      case 'Google':
        url = `${Constants.API_URL_GOOGLE_entries}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
        break;
      case 'Lead':
        url = `${Constants.API_URL_LEAD_entries}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
        break;
      case 'Order':
        url = `${Constants.API_URL_ORDER_entries}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
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
      setentries(entriesFromServer);
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
  }

  //// Rendered View ////
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          {(showingCreateNewentryForm === false && entryCurrentlyBeingUpdated === null && showingFileUploadForm === false) && (
            <div>
              <h1 className="mt-3">CBH Predictor Tool</h1>
              
              <div className="row mt-5">
                <div className="col-sm">
                  <button onClick={() => getentries('Bing')} className="btn btn-dark btn-lg w-100 h-100">Bing Table</button>
                </div>
                <div className="col-sm">
                  <button onClick={() => getentries('Google')} className="btn btn-dark btn-lg w-100 h-100">Google Table</button>
                </div>
                <div className="col-sm">
                  <button onClick={() => getentries('Lead')} className="btn btn-dark btn-lg w-100 h-100">Lead Table</button>
                </div>
                <div className="col-sm">
                  <button onClick={() => getentries('Order')} className="btn btn-dark btn-lg w-100 h-100">Order Table</button>
                </div>
                <div className="col-sm">
                  <button className="btn btn-dark btn-lg w-100 h-100">Log in</button>
                </div>
              </div>

              {(window.$activeTable !== "") && showButtons()}
              {(window.$activeTable !== "") && showFilter()}
            </div>
          )}
          
          {(entries.length > 0 && showingCreateNewentryForm === false && entryCurrentlyBeingUpdated === null && showingFileUploadForm === false && window.$activeTable === "Bing") && renderBingTable()}
          {(entries.length > 0 && showingCreateNewentryForm === false && entryCurrentlyBeingUpdated === null && showingFileUploadForm === false && window.$activeTable === "Google") && renderGoogleTable()}
          {(entries.length > 0 && showingCreateNewentryForm === false && entryCurrentlyBeingUpdated === null && showingFileUploadForm === false && window.$activeTable === "Lead") && renderLeadTable()}
          {(entries.length > 0 && showingCreateNewentryForm === false && entryCurrentlyBeingUpdated === null && showingFileUploadForm === false && window.$activeTable === "Order") && renderOrderTable()}

          {showingFileUploadForm && showUploadForm()}
          {showingCreateNewentryForm && showCreateForm()}
          {entryCurrentlyBeingUpdated !== null && showUpdateForm()}
        </div>
      </div>
    </div>
  );

  //// Show Buttons ////
  function showButtons(){
    return(
      <div className="mt-3">
        <button onClick={() => setShowingFileUploadForm(true)} className="btn btn-dark btn-lg w-100 mt-2">Upload Excel File</button>
        <button onClick={() => setShowingCreateNewentryForm(true)} className="btn btn-secondary btn-lg w-100 mt-2">Create new entry</button>
        <button onClick={() => { if(window.confirm(`Are you sure you want to delete all entries from table "${window.$activeTable}"?`)) deleteAllentries() }} className="btn btn-danger btn-lg w-100 mt-2">Delete All entries</button>
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
        <button onClick={() => getFilteredentries()} className="btn btn-success btn-lg w-50 mt-2">Apply</button>
        <button onClick={() => getentries(window.$activeTable)} className="btn btn-dark btn-lg w-50 mt-2">Reset Filter</button>
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
        return <BingCreateForm onentryCreated={onentryCreated} />
      case 'Google':
        return <GoogleCreateForm onentryCreated={onentryCreated} />
      case 'Lead':
        return <LeadCreateForm onentryCreated={onentryCreated} />
      case 'Order':
        return <OrderCreateForm onentryCreated={onentryCreated} />
      default:
        alert(`Error: Table with name "${window.$activeTable}" does not exist`)
        return;
    }
  }
  function showUpdateForm(){
    switch (window.$activeTable) {
      case 'Bing':
        return <BingUpdateForm entry={entryCurrentlyBeingUpdated} onentryUpdated={onentryUpdated} />
      case 'Google':
        return <GoogleUpdateForm entry={entryCurrentlyBeingUpdated} onentryUpdated={onentryUpdated} />
      case 'Lead':
        return <LeadUpdateForm entry={entryCurrentlyBeingUpdated} onentryUpdated={onentryUpdated} />
      case 'Order':
        return <OrderUpdateForm entry={entryCurrentlyBeingUpdated} onentryUpdated={onentryUpdated} />
      default:
        alert(`Error: Table with name "${window.$activeTable}" does not exist`)
        return;
    }
  }

  //// Show currently selected table ////
  function renderBingTable(){
    return(
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">Search Term</th>
              <th scope="col">Impressions</th>
              <th scope="col">Clicks</th>
              <th scope="col">Date</th>
              <th scope="col">CRUD Operations</th>                                        
            </tr>
          </thead>
          <tbody>
           {entries.map((entry) => (
             <tr key={entry.id}>
                <td>{entry.terms}</td>
                <td>{entry.impressions}</td>
                <td>{entry.clicks}</td>
                <td>
                  {entry.month}<br/>
                  {entry.year}
                </td>                     
                <td>
                  <button onClick={() => setentryCurrentlyBeingUpdated(entry)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                  <button onClick={() => { if(window.confirm(`Are you sure you wannt to delete the entry with ID "${entry.id}"?`)) deleteentry(entry.id) }} className="btn btn-secondary btn-lg mx-3 my-3">Delete</button>
                </td>
             </tr>
           ))}
          </tbody>
        </table>

        <button onClick={() => setentries([])} className="btn btn-dark btn-lg w-100 mb-4">Close Table</button>
      </div>
    );
  }
  function renderGoogleTable(){
    return(
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">Search Term</th>
              <th scope="col">Impressions</th>
              <th scope="col">Clicks</th>
              <th scope="col">Date</th>
              <th scope="col">CRUD Operations</th>                                        
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr  key={entry.id}>
                <td>{entry.terms}</td>
                <td>{entry.impressions}</td>
                <td>{entry.clicks}</td>  
                <td>
                  {entry.month}<br/>
                  {entry.year}
                </td>                     
                <td>
                 <button onClick={() => setentryCurrentlyBeingUpdated(entry)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                 <button onClick={() => { if(window.confirm(`Are you sure you want to delete the entry with ID "${entry.id}"?`)) deleteentry(entry.id) }} className="btn btn-secondary btn-lg mx-3 my-3">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={() => setentries([])} className="btn btn-dark btn-lg w-100 mb-4">Close Table</button>
      </div>
    );
  }
  function renderLeadTable(){
    return(
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">leadID</th>
              <th scope="col">leadNo</th>
              <th scope="col">leadStatus</th>
              <th scope="col">leadDate</th>
              <th scope="col">organisationID</th>
              <th scope="col">countryID</th>
              <th scope="col">channel</th>
              <th scope="col">fieldOfInterest</th>
              <th scope="col">specificOfInterest</th>
              <th scope="col">paramOfInterest</th>
              <th scope="col">diagnosisOfInterest</th>     
              <th scope="col">matrixOfInterest</th>              
              <th scope="col">quantityOfInterest</th>   
              <th scope="col">CRUD Operations</th>                                           
            </tr>
          </thead>
          <tbody>
           {entries.map((entry) => (
             <tr  key={entry.id}>
               <td>{entry.leadID}</td>
               <td>{entry.leadNo}</td>
               <td>{entry.leadStatus}</td>
               <td>{entry.leadDate}</td>
               <td>{entry.organisationID}</td>
               <td>{entry.countryID}</td>
               <td>{entry.channel}</td>
               <td>{entry.fieldOfInterest}</td>
               <td>{entry.specificOfInterest}</td>
               <td>{entry.paramOfInterest}</td>
               <td>{entry.diagnosisOfInterest}</td>        
               <td>{entry.matrixOfInterest}</td>               
               <td>{entry.quantityOfInterest}</td>                      
              <td>
                 <button onClick={() => setentryCurrentlyBeingUpdated(entry)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                 <button onClick={() => { if(window.confirm(`Are you sure you wannt to delete the entry with ID "${entry.id}"?`)) deleteentry(entry.id) }} className="btn btn-secondary btn-lg mx-3 my-3">Delete</button>
              </td>
             </tr>
           ))}
          </tbody>
        </table>

        <button onClick={() => setentries([])} className="btn btn-dark btn-lg w-100 mb-4">close table</button>
      </div>
    );
  }
  function renderOrderTable(){
    return(
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">customerID</th>
              <th scope="col">orderID</th>
              <th scope="col">orderDate</th>
              <th scope="col">orderPrice</th>
              <th scope="col">storageTemp</th>
              <th scope="col">donorID</th>
              <th scope="col">cbhSampleID</th>
              <th scope="col">matrix</th>
              <th scope="col">supplierID</th>
              <th scope="col">supplierSampleID</th>
              <th scope="col">productID</th>     
              <th scope="col">countryID</th>              
              <th scope="col">quantity</th>
              <th scope="col">unit</th>
              <th scope="col">age</th> 
              <th scope="col">gender</th> 
              <th scope="col">ethnicity</th> 
              <th scope="col">labParameter</th> 
              <th scope="col">resultNumerical</th> 
              <th scope="col">resultUnit</th> 
              <th scope="col">resultInterpretation</th>
              <th scope="col">testMethod</th> 
              <th scope="col">testKitManufacturer</th> 
              <th scope="col">testSystemManufacturer</th> 
              <th scope="col">diagnosis</th> 
              <th scope="col">icd</th> 
              <th scope="col">histologicalDiagnosis</th> 
              <th scope="col">organ</th>
              <th scope="col">collectionCountry</th>
              <th scope="col">collectionDate</th>         
              <th scope="col">CRUD Operations</th>                                           
            </tr>
          </thead>
          <tbody>
           {entries.map((entry) => (
             <tr  key={entry.id}>
               <td>{entry.customerID}</td>
               <td>{entry.orderID}</td>
               <td>{entry.orderDate}</td>
               <td>{entry.orderPrice}</td>
               <td>{entry.storageTemp}</td>
               <td>{entry.donorID}</td>
               <td>{entry.cbhSampleID}</td>
               <td>{entry.matrix}</td>
               <td>{entry.supplierID}</td>
               <td>{entry.supplierSampleID}</td>
               <td>{entry.productID}</td>
               <td>{entry.countryID}</td>        
               <td>{entry.quantity}</td>               
               <td>{entry.unit}</td>
               <td>{entry.age}</td> 
               <td>{entry.gender}</td> 
               <td>{entry.ethnicity}</td> 
               <td>{entry.labParameter}</td> 
               <td>{entry.resultNumerical}</td> 
               <td>{entry.resultUnit}</td> 
               <td>{entry.resultInterpretation}</td> 
               <td>{entry.testMethod}</td> 
               <td>{entry.testKitManufacturer}</td> 
               <td>{entry.testSystemManufacturer}</td> 
               <td>{entry.diagnosis}</td>
               <td>{entry.icd}</td> 
               <td>{entry.histologicalDiagnosis}</td> 
               <td>{entry.organ}</td> 
               <td>{entry.collectionCountry}</td> 
               <td>{entry.collectionDate}</td>                       
              <td>
                 <button onClick={() => setentryCurrentlyBeingUpdated(entry)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                 <button onClick={() => { if(window.confirm(`Are you sure you wannt to delete the entry with ID "${entry.id}"?`)) deleteentry(entry.id) }} className="btn btn-secondary btn-lg mx-3 my-3">Delete</button>
              </td>
             </tr>
           ))}
          </tbody>
        </table>

        <button onClick={() => setentries([])} className="btn btn-dark btn-lg w-100 mb-4">close table</button>
      </div>
    );
  }

  //// Reset and Alert after each CRUD Operation ////
  function onFileUploaded(created){
    setShowingFileUploadForm(false);

    if(created) alert(`Sucessfully uploaded the file contents to "${window.$activeTable}" Table.`);
    getentries(window.$activeTable);
  }
  function onentryCreated(createdentry){
    setShowingCreateNewentryForm(false);

    if (createdentry === null) {
      return;
    }

    alert(`entry succesfully created. After clicking OK, your new entry will show up in the table below.`);
    getentries(window.$activeTable);
  }
  function onentryUpdated(updatedentry){
    setentryCurrentlyBeingUpdated(null);

    if (updatedentry === null) {
      return;
    }

    let entriesCopy = [...entries];

    const index = entriesCopy.findIndex((entriesCopyentry, currentIndex) => {
      if (entriesCopyentry.id === updatedentry) {
        return true;
      }
    });

    if (index !== -1) {
      entriesCopy[index] = updatedentry.id;
      
    }

    setentries(entriesCopy);
    alert(`entry successfully updated. After clicking OK, look for the entry in the table below to see the updates.`);
    getentries(window.$activeTable);
  }
  function onentryDeleted(deletedentryID){
    let entriesCopy = [...entries];

    const index = entriesCopy.findIndex((entriesCopyentry, currentIndex) => {
      if (entriesCopyentry.id === deletedentryID) {
        return true;
      }
    });

    if (index !== -1) {
      entriesCopy.splice(index, 1);
    }

    setentries(entriesCopy);
    alert('entry successfully deleted. After clicking OK, look at the table below to see your entry disappear.');
    getentries(window.$activeTable);
  } 
  function onentriesDeleted(){
    setentries([]);
    alert(`Sucessfully deleted entries from "${window.$activeTable}" Table.`);
    getentries(window.$activeTable);
  }
}