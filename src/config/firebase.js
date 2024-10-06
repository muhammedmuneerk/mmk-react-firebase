import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVIy4PKC4qSOYNDLsugejhnp6WuK1IL0k",
  authDomain: "fir-course-17073.firebaseapp.com",
  projectId: "fir-course-17073",
  storageBucket: "fir-course-17073.appspot.com",
  messagingSenderId: "87009678087",
  appId: "1:87009678087:web:19bcf434f2405aa733aba2",
  measurementId: "G-NBYJS84V9K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
