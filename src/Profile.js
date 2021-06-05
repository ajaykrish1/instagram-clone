import Header from "./Header";
import Profileposts from "./Profileposts";
import "./App.css";
import React ,{useState ,useEffect} from "react";
import {db,auth} from "./firebase";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import SvgIcon from '@material-ui/core/SvgIcon';

import {BrowserRouter as Router,Link,Switch,Route} from "react-router-dom"
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));


function Profile(props) {

  const classes = useStyles();
  

  const[posts,setpost]=useState([]);

  

 

  const [alluser,setalluser]=useState({username:"",email:"",profilepic:""})
  
  const [user,setuser]=useState(null);
//username:"ajay",image:"https://i.pinimg.com/originals/3c/72/62/3c726221db7fe1257063ef650b405a74.jpg",captions:"i love her"
 
useEffect(() => {
  const unsubscribe=auth.onAuthStateChanged((authUser)=>{
    if(authUser){
    
     
      setuser(authUser);
      db.collection('user').where("email","==",authUser.email).onSnapshot(snapshot => {
        setalluser(snapshot.docs.map(function(doc){ 
          return {userid:doc.id,userr:doc.data()}
        }));
      })

    }else{
      setuser(null);
    }

  })
  return()=>{
    unsubscribe();
  }
}, []);


useEffect(() => {
    db.collection('posts').where("userid","==",props.match.params.userid).orderBy('timestamp','desc').onSnapshot(snapshot => {
      setpost(snapshot.docs.map(function(doc){ return({
        id:doc.id,
        post:doc.data()
      })}));
    })
   
  }, []);


function handlelogout() {
  auth.signOut();
 }



 function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }
  

  return (
    <div className="app">
      <div className="app__header"> 
      <Header/>
      {user===null?null:
     (<div style={{display:"flex"}}>
       <h3  style={{ paddingRight:"18px",paddingTop:"18px"}}>Welcome {alluser[0]?.userr.username}</h3>
       <Button ><Link style={{ color: "black"}}to={"/"}>
       <HomeIcon fontSize="large" style={{ paddingRight:"10px" ,color: grey ,paddingTop:"10px"}} />
      </Link></Button>
       
       
       
       
      <Button><Link to={"/profile/"+alluser[0]?.userid}>
      <div className={classes.root}><Avatar 
      className={classes.small} 
      
      alt={alluser[0]?.userr.username}
      src={alluser[0]?.userr.profilepic}/></div>
      </Link></Button>
      <Button onClick={handlelogout}><Link to={"/"}>
      Logout
      </Link></Button></div>)
     }
      </div>
      <div className="">



      <Container>
  

      <Row>
 
    { posts.map(function({post,id}){return(
       
        <Col xs={6} md={4}>
       <Profileposts 
        key={id}
        
        user={user?.displayName}
        userid={alluser[0]?.userid}
        profilepic={post.profilepic}
        postId={id}
        postuserid={post.userid}
        username={post.username}
        image={post.image}
        caption={post.captions}
        
        />
        </Col>
    
    )}
       
     )}</Row>
    

  
</Container>



   
    
   </div>
    </div>
  );
}



export default Profile;
