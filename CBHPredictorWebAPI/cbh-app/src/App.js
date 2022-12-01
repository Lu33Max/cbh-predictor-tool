import React, { useState } from "react";
import Constants from "./utilities/Constants"
import PostCreateForm from "./components/PostCreateForm"
import PostUpdateForm from "./components/PostUpdateForm"


export default function App() {
  const [posts, setPosts] = useState([]);
  const [showingCreateNewPostForm, setShowingCreateNewPostForm] = useState(false);
  const [postCurrentlyBeingUpdated, setPostCurrentlyBeingUpdated] = useState(null);

  function getPosts() {
    const url = Constants.API_URL_GET_ALL_POSTS;

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

  function deletePost(postId){
    const url = `${Constants.API_URL_DELETE_POST_BY_ID}/${postId}`;

    fetch(url, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(responseFromServer => {
      console.log(responseFromServer);
      onPostDeleted(postId);
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
  }

  return (
    <div className="container">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          {(showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null) && (
            <div>
            <h1>Interface</h1>
 
            <div className="mt-5">
              <button onClick={getPosts} className="btn btn-dark btn-lg w-100">Load Leadtable</button>
              <button onClick={() => setShowingCreateNewPostForm(true)} className="btn btn-secondary btn-lg w-100 mt-4">Create new Post</button>
            </div>
           </div>
          )}
          

          {(posts.length > 0 && showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null) && renderLeadTable()}

          {showingCreateNewPostForm && <PostCreateForm onPostCreated={onPostCreated} />}

          {postCurrentlyBeingUpdated !== null && <PostUpdateForm post={postCurrentlyBeingUpdated} onPostUpdated={onPostUpdated} />}
        </div>
      </div>
    </div>
  );

  function renderLeadTable(){
    return(
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">leadID (PK)</th>
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
              <th scope="col">CRUD operations</th>                                           
            </tr>
          </thead>
          <tbody>
           {posts.map((post) => (
             <tr  key={post.postId}>
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
                 <button onClick={() => { if(window.confirm(`Are you sure you wannt to delete the post with ID "${post.postId}"?`)) deletePost(post.leadID) }} className="btn btn-secondary btn-lg mx-3 my-3">Delete</button>
              </td>
             </tr>
           ))}
          </tbody>
        </table>

        <button onClick={() => setPosts([])} className="btn btn-dark btn-lg w-100 mb-4">close table</button>
      </div>
    );
  }

  function onPostCreated(createdPost){
    setShowingCreateNewPostForm(false);

    if (createdPost === null) {
      return;
    }

    alert(`Post succesfully created. After clicking OK, your new post with id "${createdPost.postId}" will show up in the table below.`);

    getPosts();
  }

  function onPostUpdated(updatedPost){
    setPostCurrentlyBeingUpdated(null);

    if (updatedPost === null) {
      return;
    }

    let postsCopy = [...posts];

    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if (postsCopyPost.postId === updatedPost.postId) {
        return true;
      }
    });

    if (index !== -1) {
      postsCopy[index] = updatedPost;
      
    }

    setPosts(postsCopy);

    alert(`Post successfully updated. After clicking OK, look for the post with postID "${updatedPost.postId}" in the table below to see the updates.`);
  }

  function onPostDeleted(deletedPostPostID){
    let postsCopy = [...posts];

    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if (postsCopyPost.postId === deletedPostPostID) {
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