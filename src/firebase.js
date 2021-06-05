// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseApp =firebase.initializeApp ({
    apiKey: "AIzaSyB0KQJKsz6tTNykaNh1suyF_ChE48mAo_s",
    authDomain: "instagram-clone-react-b957a.firebaseapp.com",
    projectId: "instagram-clone-react-b957a",
    storageBucket: "instagram-clone-react-b957a.appspot.com",
    messagingSenderId: "857693152830",
    appId: "1:857693152830:web:862411e5649d32f680136f",
    measurementId: "G-FZWXKWNMDB"
  });

  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();
  
  export {db,auth,storage};