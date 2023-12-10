import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   setLocationType,
//   geocode,
//   RequestType,
// } from "react-geocode";
import { postComment } from "../../actions/comments";
import "./comments.css";
import DisplayComments from "./DisplayComments";
function Comments({ videoId }) {
  const [commentText, setCommentText] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const commentsList = useSelector((s) => s.commentReducer);
  // setDefaults({
  //   key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
  //   language: "en", 
  //   region: "es", 
  // });
  
  // const commetsList = [
  //   {
  //     _id:"1",
  //     commentBody: "hello",
  //     userCommented: "abc",
  //   },
  //   {
  //     _id:"2",
  //     commentBody: "hiii",
  //     userCommented: "xyz",
  //   },
  // ];

  const dispatch = useDispatch();
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (CurrentUser) {
      if (!commentText) {
        alert("Plz Type your comment ! ");
      } else {
        dispatch(
          postComment({
            videoId: videoId,
            userId: CurrentUser?.result._id,
            commentBody: commentText,
            userCommented: CurrentUser?.result.name,
          })
        );
        setCommentText("");
      }
    }else{
      alert("Plz login to post your commnet !")
    }
  };
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords; 
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
    else {
      console.error('Geolocation is not supported by this browser.');
    }
    
  };
  // fromLatLng(48.8583701, 2.2922926)
  // .then(({ results }) => {
  //   const { lat, lng } = results[0].geometry.location;
  //   console.log(lat, lng);
  // })
  // .catch(console.error);
  return (
    <>
      <form className="comments_sub_form_comments" onSubmit={handleOnSubmit}>
        <input
          type="text"
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="add comment..."
          value={commentText}
          className="comment_ibox"
        />
        <input type="submit" value="add" className="comment_add_btn_comments" />
      </form>
      <div className="display_comment_container">
        {commentsList?.data
          ?.filter((q) => videoId === q?.videoId)
          .reverse()
          .map((m) => {
            return (
              <DisplayComments
                cId={m._id}
                userId={m.userId}
                commentBody={m.commentBody}
                commentOn={m.commentOn}
                userCommented={m.userCommented}
              />
            );
          })}
      </div>
    <button onClick={getUserLocation}>Get User Location</button>
    {userLocation && (
      <div>
        <h2>User Location</h2>
        <p>Latitude: {userLocation.latitude}</p>
        <p>Longitude: {userLocation.longitude}</p>
        {/* <p>City: {geocode.city}</p> */}
      </div>
    )}
    </>
  );
}

export default Comments;