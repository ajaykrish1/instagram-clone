import { Button, Input } from '@material-ui/core';
import React,{useState} from 'react'
import {storage,db} from "./firebase";
import firebase from "firebase";


function ImageUpload(props) {


const [file,setfile]=useState(null);
const [{alt, src}, setImg] = useState({
    src: "",
    alt: ''
});
const [progress,setprogress]=useState(0);
const [caption,setcaption]=useState("");
// const[filepath,setfilepath]=useState();


function handlecaptionchange(e) {
    setcaption(e.target.value);
        
    }

function handlechange(e) {
   
    
    if(e.target.files[0]){
setfile(e.target.files[0]);

// *alternate for image preview
//const reader=new FileReader();

// reader.onloadend=function () {
//     setfilepath(reader.result)
// }

// reader.readAsDataURL(e.target.files[0]);

setImg({
    src: URL.createObjectURL(e.target.files[0]),
    alt: e.target.files[0].name
});    

}

    
}


function handleupload(e) {
e.preventDefault();
    const uploadTask=storage.ref(`images/${file.name}`).put(file);
    
    uploadTask.on(
        "state_changed",
        (snapshot)=>{
            const progress=Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);

        setprogress(progress)
        },
        (error)=>{
            console.log(error);
            alert(error.message)
        },
        ()=>{
            storage.ref("images")
            .child(file.name)
            .getDownloadURL()
            .then(url=>{
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    captions:caption,
                    image:url,
                    userid:props.userid,
                    profilepic:props.profilepic,
                    username:props.username

                })
                setprogress(0);
    setcaption('');
    setfile(null);
    setImg({
        src: "",
        alt: ''
    })
                
            })
        }
       
    )
    
        
    }
console.log(caption)
    return (
        <div>
            <div>
                <h2>Preview</h2>

                {/* <img src={filepath} alt=""/> */}
                <img src={src} alt={alt} />
            </div>
            <progress value={progress} max="100"/>
        <form onSubmit={handleupload}>
            
        <Input type="text" placeholder="Enter a caption.. " onChange={handlecaptionchange} value={caption}/>
            <Input type="file" onChange={handlechange}/>
            <Button type="submit" >Upload</Button>
            
        </form>
        </div>
    )
}

export default ImageUpload;
