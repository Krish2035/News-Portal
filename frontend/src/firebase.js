// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "news-portal-40d08.firebaseapp.com",
  projectId: "news-portal-40d08",
  storageBucket: "news-portal-40d08.firebasestorage.app",
  messagingSenderId: "947862268078",
  appId: "1:947862268078:web:77e3fa6f8b905bf3c9e53f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
