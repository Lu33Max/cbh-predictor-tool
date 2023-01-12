import React, { useState } from "react";

import useTable from "../../hooks/useTable";
import styles from "./table.module.css";
import TableFooter from "./footer";
import PopoverButton from "./popover";

const Table = (props) => {
  const [ page, setPage ] = useState(1);
  const { slice, range } = useTable(props.data, page, props.rowsPerPage);

  return (
    <>
        {(props.type === 'Bing' || props.type === 'Google') && renderSearchTermTable(slice)}
        {(props.type === 'Lead') && renderLeadTable(slice)}
        {(props.type === 'Order') && renderOrderTable(slice)}
    </>
  );

  function popover(text, col){
    return(
      <PopoverButton text={text} col={col} setEntries={props.setEntries} type={props.type}/>
    )
  }

  function renderSearchTermTable() {
    return(
      <>
        <div className={styles.container}>
          <table className={styles.table}>
            <thead className={styles.tableRowHeader}>
              <tr>
                <th className={styles.tableHeader}>{popover("Search Term","terms")}</th>
                <th className={styles.tableHeader}>{popover("Impressions","impressions")}</th>
                <th className={styles.tableHeader}>{popover("Clicks","clicks")}</th>
                <th className={styles.tableHeader}>{popover("Date","date")}</th>
                <th className={styles.tableHeader}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((el) => (
                <tr className={styles.tableRowItems} key={el.id}>
                  <td className={styles.tableCell}>{el.terms}</td>
                  <td className={styles.tableCell}>{el.impressions}</td>
                  <td className={styles.tableCell}>{el.clicks}</td>
                  <td className={styles.tableCell}>{el.date}</td>
                  <td className={styles.tableCell} style={{textAlign: "center"}}>
                    <button onClick={() => props.updateEntry(el)} className={styles.button_black}>Update</button>
                    <button onClick={() => { if(window.confirm(`Are you sure you want to delete the entry with ID "${el.id}"?`)) props.deleteEntry(el.id) }} className={styles.button_gray}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
        </div>
      </>
    )
  }

  function renderLeadTable(slice){
    return(
      <>
        <div className={styles.container}>
          <table className={styles.table}>
            <thead className={styles.tableRowHeader}>
              <tr>
                <th className={styles.tableHeader}>{popover("LeadID","leadID")}</th>
                <th className={styles.tableHeader}>{popover("LeadNo","leadNo")}</th>
                <th className={styles.tableHeader}>{popover("LeadStatus","leadStatus")}</th>
                <th className={styles.tableHeader}>{popover("LeadDate","leadDate")}</th>
                <th className={styles.tableHeader}>{popover("OrganisationID","organisationID")}</th>
                <th className={styles.tableHeader}>{popover("CountryID","countryID")}</th>
                <th className={styles.tableHeader}>{popover("Channel","channel")}</th>
                <th className={styles.tableHeader}>{popover("FieldOfInterest","fieldOfinterest")}</th>
                <th className={styles.tableHeader}>{popover("SpecificationOfInterest","specificOfInterest")}</th>
                <th className={styles.tableHeader}>{popover("ParameterOfInterest","paramOfInterest")}</th>
                <th className={styles.tableHeader}>{popover("DiagnosisOfInterest","diagnosisOfInterest")}</th>     
                <th className={styles.tableHeader}>{popover("MatrixOfInterest","matrixOfInterest")}</th>              
                <th className={styles.tableHeader}>{popover("QuantityOfInterest","quantityOfInterest")}</th>   
                <th className={styles.tableHeader}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((el) => (
                <tr className={styles.tableRowItems} key={el.id}>
                  <td className={styles.tableCell}>{el.leadID}</td>
                  <td className={styles.tableCell}>{el.leadNo}</td>
                  <td className={styles.tableCell}>{el.leadStatus}</td>
                  {(el.leadDate) ? (<td className={styles.tableCell}>{el.leadDate.slice(0, el.leadDate.indexOf('T')) }</td>) : (<td className={styles.tableCell}>{''}</td>)}
                  <td className={styles.tableCell}>{el.organisationID}</td>
                  <td className={styles.tableCell}>{el.countryID}</td>
                  <td className={styles.tableCell}>{el.channel}</td>
                  <td className={styles.tableCell}>{el.fieldOfInterest}</td>
                  <td className={styles.tableCell}>{el.specificOfInterest}</td>
                  <td className={styles.tableCell}>{el.paramOfInterest}</td>
                  <td className={styles.tableCell}>{el.diagnosisOfInterest}</td>        
                  <td className={styles.tableCell}>{el.matrixOfInterest}</td>               
                  <td className={styles.tableCell}>{el.quantityOfInterest}</td>
                  <td className={styles.tableCell} style={{textAlign: "center"}}>
                    <button onClick={() => props.updateEntry(el)} className={styles.button_black}>Update</button>
                    <button onClick={() => { if(window.confirm(`Are you sure you want to delete the entry with ID "${el.id}"?`)) props.deleteEntry(el.id) }} className={styles.button_gray}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
        </div>
      </>
    )
  }

  function renderOrderTable(slice){
    return(
      <>
        <div className={styles.container}>
          <table className={styles.table}>
            <thead className={styles.tableRowHeader}>
              <tr>
                <th className={styles.tableHeader}>{popover("CustomerID","customerID")}</th>
                <th className={styles.tableHeader}>{popover("OrderID","orderID")}</th>
                <th className={styles.tableHeader}>{popover("OrderDate","orderDate")}</th>
                <th className={styles.tableHeader}>{popover("OrderPrice","orderPrice")}</th>
                <th className={styles.tableHeader}>{popover("StorageTemp","storageTemp")}</th>
                <th className={styles.tableHeader}>{popover("DonorID","donorID")}</th>
                <th className={styles.tableHeader}>{popover("CBHSampleID","cbhSampleID")}</th>
                <th className={styles.tableHeader}>{popover("Matrix","matrix")}</th>
                <th className={styles.tableHeader}>{popover("SupplierID","supplierID")}</th>
                <th className={styles.tableHeader}>{popover("SupplierSampleID","supplierSampleID")}</th>
                <th className={styles.tableHeader}>{popover("ProductID","productID")}</th>     
                <th className={styles.tableHeader}>{popover("CountryID","countryID")}</th>              
                <th className={styles.tableHeader}>{popover("Quantity","quantity")}</th>
                <th className={styles.tableHeader}>{popover("Unit","unit")}</th>
                <th className={styles.tableHeader}>{popover("Age","age")}</th> 
                <th className={styles.tableHeader}>{popover("Gender","gender")}</th> 
                <th className={styles.tableHeader}>{popover("Ethnicity","ethnicity")}</th> 
                <th className={styles.tableHeader}>{popover("LabParameter","labParameter")}</th> 
                <th className={styles.tableHeader}>{popover("ResultNumerical","resultNumerical")}</th> 
                <th className={styles.tableHeader}>{popover("ResultUnit","resultUnit")}</th> 
                <th className={styles.tableHeader}>{popover("ResultInterpretation","resultInterpretation")}</th>
                <th className={styles.tableHeader}>{popover("TestMethod","testMethod")}</th> 
                <th className={styles.tableHeader}>{popover("TestKitManufacturer","testKitManufacturer")}</th> 
                <th className={styles.tableHeader}>{popover("TestSystemManufacturer","testSystemManufacturer")}</th> 
                <th className={styles.tableHeader}>{popover("Diagnosis","diagnosis")}</th> 
                <th className={styles.tableHeader}>{popover("ICD","icd")}</th> 
                <th className={styles.tableHeader}>{popover("HistologicalDiagnosis","histologicalDiagnosis")}</th> 
                <th className={styles.tableHeader}>{popover("Organ","organ")}</th>
                <th className={styles.tableHeader}>{popover("CollectionCountry","collectionCountry")}</th>
                <th className={styles.tableHeader}>{popover("CollectionDate","collectionDate")}</th>
                <th className={styles.tableHeader}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((el) => (
                <tr className={styles.tableRowItems} key={el.id}>
                  <td className={styles.tableCell}>{el.customerID}</td>
                  <td className={styles.tableCell}>{el.orderID}</td>
                  {(el.orderDate) ? (<td className={styles.tableCell}>{el.orderDate.slice(0, el.orderDate.indexOf('T')) }</td>) : (<td className={styles.tableCell}>{''}</td>)}
                  <td className={styles.tableCell}>{el.orderPrice}</td>
                  <td className={styles.tableCell}>{el.storageTemp}</td>
                  <td className={styles.tableCell}>{el.donorID}</td>
                  <td className={styles.tableCell}>{el.cbhSampleID}</td>
                  <td className={styles.tableCell}>{el.matrix}</td>
                  <td className={styles.tableCell}>{el.supplierID}</td>
                  <td className={styles.tableCell}>{el.supplierSampleID}</td>
                  <td className={styles.tableCell}>{el.productID}</td>
                  <td className={styles.tableCell}>{el.countryID}</td>        
                  <td className={styles.tableCell}>{el.quantity}</td>               
                  <td className={styles.tableCell}>{el.unit}</td>
                  <td className={styles.tableCell}>{el.age}</td> 
                  <td className={styles.tableCell}>{el.gender}</td> 
                  <td className={styles.tableCell}>{el.ethnicity}</td> 
                  <td className={styles.tableCell}>{el.labParameter}</td> 
                  <td className={styles.tableCell}>{el.resultNumerical}</td> 
                  <td className={styles.tableCell}>{el.resultUnit}</td> 
                  <td className={styles.tableCell}>{el.resultInterpretation}</td> 
                  <td className={styles.tableCell}>{el.testMethod}</td> 
                  <td className={styles.tableCell}>{el.testKitManufacturer}</td> 
                  <td className={styles.tableCell}>{el.testSystemManufacturer}</td> 
                  <td className={styles.tableCell}>{el.diagnosis}</td>
                  <td className={styles.tableCell}>{el.icd}</td> 
                  <td className={styles.tableCell}>{el.histologicalDiagnosis}</td> 
                  <td className={styles.tableCell}>{el.organ}</td> 
                  <td className={styles.tableCell}>{el.collectionCountry}</td> 
                  {(el.collectionDate) ? (<td className={styles.tableCell}>{el.collectionDate.slice(0, el.collectionDate.indexOf('T')) }</td>) : (<td className={styles.tableCell}>{''}</td>)}
                  <td className={styles.tableCell} style={{textAlign: "center", alignItems: "center"}}>
                    <button onClick={() => props.updateEntry(el)} className={styles.button_black}>Update</button>
                    <button onClick={() => { if(window.confirm(`Are you sure you want to delete the entry with ID "${el.id}"?`)) props.deleteEntry(el.id) }} className={styles.button_gray}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
        </div>
      </>
    )
  }
};

export default Table;