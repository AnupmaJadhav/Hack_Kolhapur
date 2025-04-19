import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase config object
  apiKey: "AIzaSyCoz9ms3q_cKlmXnOhXiMu5awGgh0P8j4A",
  authDomain: "myappp-a316c.firebaseapp.com",
  projectId: "myappp-a316c",
  storageBucket: "myappp-a316c.firebasestorage.app",
  messagingSenderId: "880128084255",
  appId: "1:880128084255:web:1b364e07cd712598f7c82a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 