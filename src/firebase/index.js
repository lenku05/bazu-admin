import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyC20rB58A2dhxpNefqKtZgieCHX5li8AXc",
  authDomain: "bazu-f4e57.firebaseapp.com",
  projectId: "bazu-f4e57",
  storageBucket: "bazu-f4e57.appspot.com",
  messagingSenderId: "1081160222244",
  appId: "1:1081160222244:web:45656f04c7f027bf72bab1",
  measurementId: "G-HNFVTCK9LD",
};
firebase.initializeApp(config);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
