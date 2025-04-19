import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCoz9ms3q_cKlmXnOhXiMu5awGgh0P8j4A",
    authDomain: "myappp-a316c.firebaseapp.com",
    projectId: "myappp-a316c",
    storageBucket: "myappp-a316c.firebasestorage.app",
    messagingSenderId: "880128084255",
    appId: "1:880128084255:web:1b364e07cd712598f7c82a",
    measurementId: "G-QMZ5CP376Z"  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app); // Realtime Database
export default app;