import React ,{useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { db } from "./firebase";
import { Button } from "@material-ui/core";
import firebase from "firebase"

function getModalStyle() {
    const top = 50 ;
    const left = 50 ;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

function Post(props) {
    const [postopen,setpostOpen]=useState(false);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle)
    const [comments,setComments]=useState([]);
    const [commentchange,changecomment]=useState("");
    


    function handlepostClose() {
        setpostOpen(false);
      }
      
      function handlepostOpen() {
        setpostOpen(true);
      }

      useEffect(()=>{
       
        if(props.postId){
          db.collection("posts")
          .doc(props.postId)
          .collection("comments")
          .orderBy('timestamp','desc')
          .onSnapshot((snapshot)=>{
            setComments(snapshot.docs.map((doc)=>doc.data()))
          })
        
     
      }
      },[props.postId])
 
      function postcomment(e) {
        e.preventDefault();
        
        console.log(props.postId);
        db.collection("posts").doc(props.postId).collection("comments").add({
          text:commentchange,
          username:props.user,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        changecomment("")
      }
      
  
     function changeinput(e){

       changecomment(e.target.value)
       console.log(commentchange,props.user)
      }


    return (
        <div className="post" >
            <div onClick={handlepostOpen}>
            <div className="post__header">
            <Avatar
            className="post__avatar"
            alt={props.username}
            src={props.profilepic}/>
            <h3>{props.username}</h3>
            </div>
            
            <img className="post__image" src={props.image} alt=""/>

            <h4 className="post__text"> <strong>{props.username}</strong> {props.caption}</h4>
            
            {comments.map(function(comment,id){
             return(<h4 className="post__comm" key={id}><strong>{comment.username}</strong> {comment.text}</h4>)
              
              
            })}
            </div>
            
            <Modal 
        open={postopen}
        onClose={handlepostClose}
       
      >
        <div style={modalStyle} className={classes.paper}>
        <div className="post__header">
            <Avatar
            className="post__avatar"
            alt={props.username}
            src={props.profilepic}/>
            <h3>{props.username}</h3>
            </div>
            
            <img className="post__image" src={props.image} alt=""/>

            <h4 className="post__text"> <strong>{props.username}</strong> {props.caption}</h4>

            {comments.map(function(comment,id){
              return(<h4 className="post__comm" key={id}><strong>{comment.username}</strong> {comment.text}</h4>)
              
            })}
          {props.user && props.userid!=props.postuserid?<form className="post_commentBox " onSubmit={postcomment}>
<input className="post__input " type="text" name="" placeholder="Enter comments.." onChange={changeinput} value={commentchange}/>
<Button className="post__button "type="submit">Post</Button>

            </form>:null}
            
        </div>
      </Modal>
        </div>
    )
}

export default Post;
