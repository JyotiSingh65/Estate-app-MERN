// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // importing the API key from the .env file
  authDomain: "estate-app-d2b02.firebaseapp.com",
  projectId: "estate-app-d2b02",
  storageBucket: "estate-app-d2b02.appspot.com",
  messagingSenderId: "116708491328",
  appId: "1:116708491328:web:f61519bb86f596a87ddfa5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);