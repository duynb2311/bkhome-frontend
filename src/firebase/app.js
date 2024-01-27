// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app" ;   
import { getAnalytics } from "firebase/analytics" ;   
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = { 
  apiKey : "AIzaSyASC2wSoo3lhQedo7_u3WEl_v551XgI4yM" , 
  authDomain : "finalproject-f295b.firebaseapp.com" , 
  projectId : "finalproject-f295b" , 
  storageBucket : "finalproject-f295b.appspot.com" , 
  messagingSenderId : "814144723491" , 
  appId : "1:814144723491:web:e42103dc1581b5600e6f96" , 
  measurementId : "G-QSGVVCZ1CE" 
};

// Initialize Firebase
const app = initializeApp ( firebaseConfig );
export default app;