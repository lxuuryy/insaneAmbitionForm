// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDurGxLHi4QUtSbJgdxaLP08-UUlVnXNS4",
  authDomain: "officialsincidium.firebaseapp.com",
  projectId: "officialsincidium",
  storageBucket: "officialsincidium.appspot.com",
  messagingSenderId: "883358625209",
  appId: "1:883358625209:web:2c86300565522ecdae1a68",
  measurementId: "G-ZCZJE9W8R5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
