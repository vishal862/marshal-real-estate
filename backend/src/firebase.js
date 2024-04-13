// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "marshal-estate.firebaseapp.com",
  projectId: "marshal-estate",
  storageBucket: "marshal-estate.appspot.com",
  messagingSenderId: "1053163960309",
  appId: "1:1053163960309:web:cd2acf37b5bc44ed3592bc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);