import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMTeLQOP4kV0sBV1J42dwBv3p1zUBd528",
  authDomain: "sell-rent-app-13c46.firebaseapp.com",
  projectId: "sell-rent-app-13c46",
  storageBucket: "sell-rent-app-13c46.appspot.com",
  messagingSenderId: "118625966638",
  appId: "1:118625966638:web:160107da018603ff079dbf"
};

// Initialize Firebase
 initializeApp(firebaseConfig);
 export const db=getFirestore();