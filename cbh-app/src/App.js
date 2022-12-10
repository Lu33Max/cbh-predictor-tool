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
import FileUploadForm from "./components/FileUploadForm";

window.$activeTable = "";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [showingCreateNewPostForm, setShowingCreateNewPostForm] = useState(false);
  const [postCurrentlyBeingUpdated, setPostCurrentlyBeingUpdated] = useState(null);
  const [showingFileUploadForm, setShowingFileUploadForm] = useState(false);
  const [filter, setFilter] = useState({
    col: '',
    value: '',
    exact: false
  });

  //// Basic CRUD Operations ////
  // Get all Posts from Server
  function getPosts(table){
    setPosts([]);
    window.$activeTable = table;
    var url;

    switch (table) {
      case 'Bing':
        url = Constants.API_URL_BING_POSTS;
        break;
      case 'Google':
        url = Constants.API_URL_GOOGLE_POSTS;
        break;
      case 'Lead':
        url = Constants.API_URL_LEAD_POSTS;
        break;
      case 'Order':
        url = Constants.API_URL_ORDER_POSTS;
        break;
      default:
        alert(`Error: Table with name "${table}" does not exist`)
        return;
    }

    fetch(url, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(postsFromServer => {
      setPosts(postsFromServer);
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
  }
  // Delete Post by ID
  function deletePost(id){
    var url;

    switch (window.$activeTable) {
      case 'Bing':
        url = `${Constants.API_URL_BING_POSTS}/${id}`;
        break;
      case 'Google':
        url = `${Constants.API_URL_GOOGLE_POSTS}/${id}`;
        break;
      case 'Lead':
        url = `${Constants.API_URL_LEAD_POSTS}/${id}`;
        break;
      case 'Order':
        url = `${Constants.API_URL_ORDER_POSTS}/${id}`;
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
      onPostDeleted(id);
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
  }
  // Delete all Posts from Table
  function deleteAllPosts(){
    var url;

    switch (window.$activeTable) {
      case 'Bing':
        url = Constants.API_URL_BING_POSTS;
        break;
      case 'Google':
        url = Constants.API_URL_GOOGLE_POSTS;
        break;
      case 'Lead':
        url = Constants.API_URL_LEAD_POSTS;
        break;
      case 'Order':
        url = Constants.API_URL_ORDER_POSTS;
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
      onPostsDeleted();
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
  function getFilteredPosts(){
    setPosts([]);
    var url;

    switch (window.$activeTable) {
      case 'Bing':
        url = `${Constants.API_URL_BING_POSTS}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
        break;
      case 'Google':
        url = `${Constants.API_URL_GOOGLE_POSTS}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
        break;
      case 'Lead':
        url = `${Constants.API_URL_LEAD_POSTS}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
        break;
      case 'Order':
        url = `${Constants.API_URL_ORDER_POSTS}/GetAny/${filter.col}/${filter.value}/${filter.exact}`;
        break;
      default:
        alert(`Error: Table with name "${window.$activeTable}" does not exist`)
        return;
    }

    fetch(url, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(postsFromServer => {
      setPosts(postsFromServer);
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
          {(showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null && showingFileUploadForm === false) && (
            <div>
              <h1 className="mt-3">CBH Predictor Tool</h1>
              
              <div className="row mt-5">
                <div className="col-sm">
                  <button onClick={() => getPosts('Bing')} className="btn btn-dark btn-lg w-100 h-100">Bing Table</button>
                </div>
                <div className="col-sm">
                  <button onClick={() => getPosts('Google')} className="btn btn-dark btn-lg w-100 h-100">Google Table</button>
                </div>
                <div className="col-sm">
                  <button onClick={() => getPosts('Lead')} className="btn btn-dark btn-lg w-100 h-100">Lead Table</button>
                </div>
                <div className="col-sm">
                  <button onClick={() => getPosts('Order')} className="btn btn-dark btn-lg w-100 h-100">Order Table</button>
                </div>
              </div>

              {(window.$activeTable !== "") && showButtons()}
              {(window.$activeTable !== "") && showFilter()}
            </div>
          )}
          
          {(posts.length > 0 && showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null && showingFileUploadForm === false && window.$activeTable === "Bing") && renderBingTable()}
          {(posts.length > 0 && showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null && showingFileUploadForm === false && window.$activeTable === "Google") && renderGoogleTable()}
          {(posts.length > 0 && showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null && showingFileUploadForm === false && window.$activeTable === "Lead") && renderLeadTable()}
          {(posts.length > 0 && showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null && showingFileUploadForm === false && window.$activeTable === "Order") && renderOrderTable()}

          {showingFileUploadForm && showUploadForm()}
          {showingCreateNewPostForm && showCreateForm()}
          {postCurrentlyBeingUpdated !== null && showUpdateForm()}
        </div>
      </div>
    </div>
  );

  //// Show Buttons ////
  function showButtons(){
    return(
      <div className="mt-3">
        <button onClick={() => setShowingFileUploadForm(true)} className="btn btn-dark btn-lg w-100 mt-2">Upload Excel File</button>
        <button onClick={() => setShowingCreateNewPostForm(true)} className="btn btn-secondary btn-lg w-100 mt-2">Create new Post</button>
        <button onClick={() => { if(window.confirm(`Are you sure you wannt to delete all posts from table "${window.$activeTable}"?`)) deleteAllPosts() }} className="btn btn-danger btn-lg w-100 mt-2">Delete All Posts</button>
      </div>
    )
  }

  function showFilter(){
    return(
      <div className="mt-3">
        <div>
          <label className="h5 form-label">Filter:</label>
          <input value={filter.col} name="col" type="text" className="form-control" onChange={handleFilterChange} />
          <input value={filter.value} name="value" type="text" className="form-control" onChange={handleFilterChange} />
          <input value={filter.exact} name="exact" type="checkbox" onChange={handleFilterChange} />
        </div>
        <button onClick={() => getFilteredPosts()} className="btn btn-dark btn-lg w-50 mt-2">Apply</button>
        <button onClick={() => getPosts(window.$activeTable)} className="btn btn-dark btn-lg w-50 mt-2">Reset Filter</button>
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
        return <BingCreateForm onPostCreated={onPostCreated} />
      case 'Google':
        return <GoogleCreateForm onPostCreated={onPostCreated} />
      case 'Lead':
        return <LeadCreateForm onPostCreated={onPostCreated} />
      case 'Order':
        return <OrderCreateForm onPostCreated={onPostCreated} />
      default:
        alert(`Error: Table with name "${window.$activeTable}" does not exist`)
        return;
    }
  }
  function showUpdateForm(){
    switch (window.$activeTable) {
      case 'Bing':
        return <BingUpdateForm post={postCurrentlyBeingUpdated} onPostUpdated={onPostUpdated} />
      case 'Google':
        return <GoogleUpdateForm post={postCurrentlyBeingUpdated} onPostUpdated={onPostUpdated} />
      case 'Lead':
        return <LeadUpdateForm post={postCurrentlyBeingUpdated} onPostUpdated={onPostUpdated} />
      case 'Order':
        return <OrderUpdateForm post={postCurrentlyBeingUpdated} onPostUpdated={onPostUpdated} />
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
           {posts.map((post) => (
             <tr key={post.id}>
                <td>{post.terms}</td>
                <td>{post.impressions}</td>
                <td>{post.clicks}</td>
                <td>
                  {post.month}<br/>
                  {post.year}
                </td>                     
                <td>
                  <button onClick={() => setPostCurrentlyBeingUpdated(post)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                  <button onClick={() => { if(window.confirm(`Are you sure you wannt to delete the post with ID "${post.id}"?`)) deletePost(post.id) }} className="btn btn-secondary btn-lg mx-3 my-3">Delete</button>
                </td>
             </tr>
           ))}
          </tbody>
        </table>

        <button onClick={() => setPosts([])} className="btn btn-dark btn-lg w-100 mb-4">Close Table</button>
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
              <th scope="col">CRUD Operations</th>                                        
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr  key={post.id}>
                <td>{post.terms}</td>
                <td>{post.impressions}</td>
                <td>{post.clicks}</td>  
                <td>
                  {post.month}<br/>
                  {post.year}
                </td>                     
                <td>
                 <button onClick={() => setPostCurrentlyBeingUpdated(post)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                 <button onClick={() => { if(window.confirm(`Are you sure you wannt to delete the post with ID "${post.id}"?`)) deletePost(post.id) }} className="btn btn-secondary btn-lg mx-3 my-3">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={() => setPosts([])} className="btn btn-dark btn-lg w-100 mb-4">Close Table</button>
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
           {posts.map((post) => (
             <tr  key={post.id}>
               <td>{post.leadID}</td>
               <td>{post.leadNo}</td>
               <td>{post.leadStatus}</td>
               <td>{post.leadDate}</td>
               <td>{post.organisationID}</td>
               <td>{post.countryID}</td>
               <td>{post.channel}</td>
               <td>{post.fieldOfInterest}</td>
               <td>{post.specificOfInterest}</td>
               <td>{post.paramOfInterest}</td>
               <td>{post.diagnosisOfInterest}</td>        
               <td>{post.matrixOfInterest}</td>               
               <td>{post.quantityOfInterest}</td>                      
              <td>
                 <button onClick={() => setPostCurrentlyBeingUpdated(post)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                 <button onClick={() => { if(window.confirm(`Are you sure you wannt to delete the post with ID "${post.id}"?`)) deletePost(post.id) }} className="btn btn-secondary btn-lg mx-3 my-3">Delete</button>
              </td>
             </tr>
           ))}
          </tbody>
        </table>

        <button onClick={() => setPosts([])} className="btn btn-dark btn-lg w-100 mb-4">close table</button>
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
           {posts.map((post) => (
             <tr  key={post.id}>
               <td>{post.customerID}</td>
               <td>{post.orderID}</td>
               <td>{post.orderDate}</td>
               <td>{post.orderPrice}</td>
               <td>{post.storageTemp}</td>
               <td>{post.donorID}</td>
               <td>{post.cbhSampleID}</td>
               <td>{post.matrix}</td>
               <td>{post.supplierID}</td>
               <td>{post.supplierSampleID}</td>
               <td>{post.productID}</td>
               <td>{post.countryID}</td>        
               <td>{post.quantity}</td>               
               <td>{post.unit}</td>
               <td>{post.age}</td> 
               <td>{post.gender}</td> 
               <td>{post.ethnicity}</td> 
               <td>{post.labParameter}</td> 
               <td>{post.resultNumerical}</td> 
               <td>{post.resultUnit}</td> 
               <td>{post.resultInterpretation}</td> 
               <td>{post.testMethod}</td> 
               <td>{post.testKitManufacturer}</td> 
               <td>{post.testSystemManufacturer}</td> 
               <td>{post.diagnosis}</td>
               <td>{post.icd}</td> 
               <td>{post.histologicalDiagnosis}</td> 
               <td>{post.organ}</td> 
               <td>{post.collectionCountry}</td> 
               <td>{post.collectionDate}</td>                       
              <td>
                 <button onClick={() => setPostCurrentlyBeingUpdated(post)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                 <button onClick={() => { if(window.confirm(`Are you sure you wannt to delete the post with ID "${post.id}"?`)) deletePost(post.id) }} className="btn btn-secondary btn-lg mx-3 my-3">Delete</button>
              </td>
             </tr>
           ))}
          </tbody>
        </table>

        <button onClick={() => setPosts([])} className="btn btn-dark btn-lg w-100 mb-4">close table</button>
      </div>
    );
  }

  //// Reset and Alert after each CRUD Operation ////
  function onFileUploaded(created){
    setShowingFileUploadForm(false);

    if(created) alert(`Sucessfully uploaded the file contents to "${window.$activeTable}" Table.`);
    getPosts(window.$activeTable);
  }
  function onPostCreated(createdPost){
    setShowingCreateNewPostForm(false);

    if (createdPost === null) {
      return;
    }

    alert(`Post succesfully created. After clicking OK, your new post will show up in the table below.`);
    getPosts(window.$activeTable);
  }
  function onPostUpdated(updatedPost){
    setPostCurrentlyBeingUpdated(null);

    if (updatedPost === null) {
      return;
    }

    let postsCopy = [...posts];

    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if (postsCopyPost.id === updatedPost) {
        return true;
      }
    });

    if (index !== -1) {
      postsCopy[index] = updatedPost.id;
      
    }

    setPosts(postsCopy);
    alert(`Post successfully updated. After clicking OK, look for the post in the table below to see the updates.`);
    getPosts(window.$activeTable);
  }
  function onPostDeleted(deletedPostID){
    let postsCopy = [...posts];

    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if (postsCopyPost.id === deletedPostID) {
        return true;
      }
    });

    if (index !== -1) {
      postsCopy.splice(index, 1);
    }

    setPosts(postsCopy);
    alert('Post successfully deleted. After clicking OK, look at the table below to see your post disappear.');
    getPosts(window.$activeTable);
  } 
  function onPostsDeleted(){
    setPosts([]);
    alert(`Sucessfully deleted posts from "${window.$activeTable}" Table.`);
    getPosts(window.$activeTable);
  }
}