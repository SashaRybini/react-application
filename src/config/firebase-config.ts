// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9UqlJW9s60lTatWDWz7AlXPG6VcF1Wb4",
  authDomain: "store-27f2b.firebaseapp.com",
  projectId: "store-27f2b",
  storageBucket: "store-27f2b.appspot.com",
  messagingSenderId: "795946421875",
  appId: "1:795946421875:web:3efdc0acffabca77b16406"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase