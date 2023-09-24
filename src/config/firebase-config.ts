// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXbjCpVFthIB6S7vvpiImAyREcQTIFpXI",
  authDomain: "chat-room-a67be.firebaseapp.com",
  projectId: "chat-room-a67be",
  storageBucket: "chat-room-a67be.appspot.com",
  messagingSenderId: "919825516375",
  appId: "1:919825516375:web:9de188950965d222446012"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;