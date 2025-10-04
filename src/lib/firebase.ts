import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAyxFVIgNKJd3EjvNfob4RlkMhfcppfzi4",
  authDomain: "venkatexpresss2.firebaseapp.com",
  projectId: "venkatexpresss2",
  storageBucket: "venkatexpresss2.firebasestorage.app",
  messagingSenderId: "653239985301",
  appId: "1:653239985301:web:1070f98e69c7e30ec1679c",
  measurementId: "G-THEWD52SS1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
