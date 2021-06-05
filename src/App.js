import './App.css';
import Header from "./Header";
import Post from "./Post";
import React ,{useState ,useEffect} from "react";
import {db,auth} from "./firebase";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import firebase from "firebase"
import {BrowserRouter as Router,Link,Switch,Route} from "react-router-dom"
import Avatar from "@material-ui/core/Avatar";
import { grey } from '@material-ui/core/colors';
import SvgIcon from '@material-ui/core/SvgIcon';

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
  root: {
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



function App() {

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle)

  const[posts,setpost]=useState([]);
  const [open,setOpen]=useState(false);
  const [loginopen,setloginOpen]=useState(false);
  

  const [register,setregister]=useState({username:"",email:"",profilepic:"",password:""});
  const [login,setlogin]=useState({email:"",password:""});

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
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setpost(snapshot.docs.map(function(doc){ return({
        id:doc.id,
        post:doc.data()
      })}));
    })
   
  }, []);

function handleclose() {
   setOpen(false);
}

function handleOpen() {
  setOpen(true);
}

function handleloginclose() {
  setloginOpen(false);
}

function handleloginOpen() {
 setloginOpen(true);
}
function handlelogout() {
  auth.signOut();
 }




function handleregistration(event) {
  const {name,value}=event.target;
  setregister(function (prevValue) {
    return {...prevValue,[name]:value}
    
  })
}
function handlelogin(event) {
  const {name,value}=event.target;
  setlogin(function (prevValue) {
    return {...prevValue,[name]:value}
    
  })
}

function handlesubmitregister(event){
  event.preventDefault();
  db.collection("user").add({
    username:register.username,
    email:register.email,
    profilepic:register.profilepic,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })

  auth
  .createUserWithEmailAndPassword(register.email,register.password)
  .then((authUser)=>{
    return authUser.user.updateProfile({
      displayName:register.username,
    })
  })
  .catch((error) => alert(error.message));

  handleclose()
}
function handlesubmitlogin(event){
  event.preventDefault();

auth.signInWithEmailAndPassword(login.email,login.password)
.catch((error) => alert(error.message));

 

  handleloginclose()
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
      {user===null?(
       <div>
         
     <Button onClick={handleOpen}>SignUp</Button>
     <Button onClick={handleloginOpen}>LogIn</Button></div>):
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
      <Button onClick={handlelogout}>LogOut</Button></div>)
     }
      </div>
      
     <div className="app__rem">
      <Modal 
        open={open}
        onClose={handleclose}
       
      >
        <div style={modalStyle} className={classes.paper}>
        <form  className="app__form" onSubmit={handlesubmitregister}>
            <center >
            
                <img className="app__headerImage"src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
              </center>   
            <Input 
            placeholder="username"
            type="username"
            value={register.username}
            name="username"
            onChange={handleregistration}
            />
               <Input 
            placeholder="email"
            type="text"
            value={register.email}
            name="email"
            onChange={handleregistration}
            />
            <Input 
            placeholder="profile pic"
            type="text"
            value={register.profilepic}
            name="profilepic"
            onChange={handleregistration}
            />
               <Input 
            placeholder="password"
            type="password"
            value={register.password}
            name="password"
            onChange={handleregistration}
            />
            

            <Button type="submit">Submit</Button>
           
            </form>
        </div>
      </Modal>

      <Modal 
        open={loginopen}
        onClose={handleloginclose}
       
      >
        <div style={modalStyle} className={classes.paper}>
        <form  className="app__form" onSubmit={handlesubmitlogin}>
            <center >
            
                <img className="app__headerImage"src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
              </center>   
        
               <Input 
            placeholder="email"
            type="text"
            value={login.email}
            name="email"
            onChange={handlelogin}
            />
               <Input 
            placeholder="password"
            type="password"
            value={login.password}
            name="password"
            onChange={handlelogin}
            />
            

            <Button type="submit">Submit</Button>
           
            </form>
        </div>
      </Modal>

     
     
     

    { posts.map(function({post,id}){return(
       
       <Post 
        key={id}
        
        user={user?.displayName}
        userid={alluser[0]?.userid}
        profilepic={post.profilepic}
        postId={id}
        postuserid={post.userid}
        username={post.username}
        image={post.image}
        caption={post.captions}
        
        />)}
       
     )}
   {user?.displayName?
    <ImageUpload profilepic={alluser[0]?.userr.profilepic} userid={alluser[0]?.userid} username={user.displayName}/>
:<h2>Please Login to Upload</h2>}
</div>
    </div>
  );
}

export default App;
