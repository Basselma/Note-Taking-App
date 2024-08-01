// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAP_sGwh-eMCa2REA3nzCE_u7YHYFmZzEI",
    authDomain: "taking-note-app-c0e3f.firebaseapp.com",
    projectId: "taking-note-app-c0e3f",
    storageBucket: "taking-note-app-c0e3f.appspot.com",
    messagingSenderId: "286760555170",
    appId: "1:286760555170:web:e229436390724ec54f3dfb",
    measurementId: "G-V46BZC7N15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, db, auth };
