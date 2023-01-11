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

  function renderSearchTermTable() {
    return(
      <table className={styles.table}>
        <thead className={styles.tableRowHeader}>
          <tr>
            <th className={styles.tableHeader}>Search Term</th>
            <th className={styles.tableHeader}>Impressions</th>
            <th className={styles.tableHeader}>Clicks</th>
            <th className={styles.tableHeader}>Date</th>
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
              <td className={styles.crudCell}>
                <button onClick={() => props.updateEntry(el)} className={styles.button_black}>Update</button>
                <button onClick={() => { if(window.confirm(`Are you sure you want to delete the entry with ID "${el.id}"?`)) props.deleteEntry(el.id) }} className={styles.button_gray}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className={styles.tableFooter}>
          <tr>
            <td colSpan="5">
              <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
            </td>
          </tr>
        </tfoot>
      </table>
    )
  }

  function renderLeadTable(slice){
    return(
      <table className={styles.table}>
        <thead className={styles.tableRowHeader}>
          <tr>
            <th className={styles.tableHeader}>LeadID</th>
            <th className={styles.tableHeader}>LeadNo</th>
            <th className={styles.tableHeader}>LeadStatus</th>
            <th className={styles.tableHeader}>LeadDate</th>
            <th className={styles.tableHeader}>OrganisationID</th>
            <th className={styles.tableHeader}>CountryID</th>
            <th className={styles.tableHeader}>Channel</th>
            <th className={styles.tableHeader}>FieldOfInterest</th>
            <th className={styles.tableHeader}>SpecificOfInterest</th>
            <th className={styles.tableHeader}>ParamOfInterest</th>
            <th className={styles.tableHeader}>DiagnosisOfInterest</th>     
            <th className={styles.tableHeader}>MatrixOfInterest</th>              
            <th className={styles.tableHeader}>QuantityOfInterest</th>   
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
              <td className={styles.crudCell}>
                <button onClick={() => props.updateEntry(el)} className={styles.button_black}>Update</button>
                <button onClick={() => { if(window.confirm(`Are you sure you want to delete the entry with ID "${el.id}"?`)) props.deleteEntry(el.id) }} className={styles.button_gray}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className={styles.tableFooter}>
          <tr>
            <td colSpan="14">
              <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
            </td>
          </tr>
        </tfoot>
      </table>
    )
  }

  function renderOrderTable(slice){
    return(
      <table className={styles.table}>
        <thead className={styles.tableRowHeader}>
          <tr>
            <th className={styles.tableHeader}><PopoverButton text="customerID"/></th>
            <th className={styles.tableHeader}>orderID</th>
            <th className={styles.tableHeader}>orderDate</th>
            <th className={styles.tableHeader}>orderPrice</th>
            <th className={styles.tableHeader}>storageTemp</th>
            <th className={styles.tableHeader}>donorID</th>
            <th className={styles.tableHeader}>cbhSampleID</th>
            <th className={styles.tableHeader}>matrix</th>
            <th className={styles.tableHeader}>supplierID</th>
            <th className={styles.tableHeader}>supplierSampleID</th>
            <th className={styles.tableHeader}>productID</th>     
            <th className={styles.tableHeader}>countryID</th>              
            <th className={styles.tableHeader}>quantity</th>
            <th className={styles.tableHeader}>unit</th>
            <th className={styles.tableHeader}>age</th> 
            <th className={styles.tableHeader}>gender</th> 
            <th className={styles.tableHeader}>ethnicity</th> 
            <th className={styles.tableHeader}>labParameter</th> 
            <th className={styles.tableHeader}>resultNumerical</th> 
            <th className={styles.tableHeader}>resultUnit</th> 
            <th className={styles.tableHeader}>resultInterpretation</th>
            <th className={styles.tableHeader}>testMethod</th> 
            <th className={styles.tableHeader}>testKitManufacturer</th> 
            <th className={styles.tableHeader}>testSystemManufacturer</th> 
            <th className={styles.tableHeader}>diagnosis</th> 
            <th className={styles.tableHeader}>icd</th> 
            <th className={styles.tableHeader}>histologicalDiagnosis</th> 
            <th className={styles.tableHeader}>organ</th>
            <th className={styles.tableHeader}>collectionCountry</th>
            <th className={styles.tableHeader}>collectionDate</th>
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
              <td className={styles.crudCell}>
                <button onClick={() => props.updateEntry(el)} className={styles.button_black}>Update</button>
                <button onClick={() => { if(window.confirm(`Are you sure you want to delete the entry with ID "${el.id}"?`)) props.deleteEntry(el.id) }} className={styles.button_gray}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className={styles.tableFooter}>
          <tr>
            <td colSpan="31">
              <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
            </td>
          </tr>
        </tfoot>
      </table>
    )
  }
};

export default Table;