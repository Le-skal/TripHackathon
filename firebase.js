// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU_s_9yR1IXdxpXmsAVNH_CEHYkJqlxzI",
  authDomain: "tripwise-af773.firebaseapp.com",
  projectId: "tripwise-af773",
  storageBucket: "tripwise-af773.firebasestorage.app",
  messagingSenderId: "78270723665",
  appId: "1:78270723665:web:0f8e45293ed61eecfeaa70",
  measurementId: "G-E860VSD37J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // 🔹 ADD THIS