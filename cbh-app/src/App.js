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

window.$activeTable = "";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [showingCreateNewPostForm, setShowingCreateNewPostForm] = useState(false);
  const [postCurrentlyBeingUpdated, setPostCurrentlyBeingUpdated] = useState(null);

  //// Get Posts from Server ////
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

  //// Delete Post by ID ////
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

  //// Rendered View ////
  return (
    <div className="container">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          {(showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null) && (
            <div>
            <h1>Predictor Tool</h1>
 
            <div className="mt-5">
              <button onClick={() => getPosts('Bing')} className="btn btn-dark btn-lg w-100">Load Bing Table</button>
              <button onClick={() => getPosts('Google')} className="btn btn-dark btn-lg w-100 mt-2">Load Google Table</button>
              <button onClick={() => getPosts('Lead')} className="btn btn-dark btn-lg w-100 mt-2">Load Lead Table</button>
              <button onClick={() => getPosts('Order')} className="btn btn-dark btn-lg w-100 mt-2">Load Order Table</button>

              <button onClick={() => setShowingCreateNewPostForm(true)} className="btn btn-secondary btn-lg w-100 mt-4">Create new Post</button>
            </div>
           </div>
          )}
          
          {(posts.length > 0 && showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null && window.$activeTable === "Bing") && renderBingTable()}
          {(posts.length > 0 && showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null && window.$activeTable === "Google") && renderGoogleTable()}
          {(posts.length > 0 && showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null && window.$activeTable === "Lead") && renderLeadTable()}
          {(posts.length > 0 && showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null && window.$activeTable === "Order") && renderOrderTable()}

          {showingCreateNewPostForm && showCreateForm()}
          {postCurrentlyBeingUpdated !== null && showUpdateForm()}
        </div>
      </div>
    </div>
  );

  //// Show Forms ////
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
              <th scope="col">Clicks</th>
              <th scope="col">Impressions</th>
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
    // Bitte ergänzen
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
    // Bitte ergänzen
  }

  //// Reset and Alert after each CRUD Operation ////
  function onPostCreated(createdPost){
    setShowingCreateNewPostForm(false);

    if (createdPost === null) {
      return;
    }

    alert(`Post succesfully created. After clicking OK, your new post with id "${createdPost.id}" will show up in the table below.`);

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

    alert(`Post successfully updated. After clicking OK, look for the post with ID "${updatedPost.id}" in the table below to see the updates.`);
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
  } 
}