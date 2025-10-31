// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7e3pJ-Wmosg-Q-wt_2jn_eDt2xh6QC_U",
  authDomain: "booboy-memecoin.firebaseapp.com",
  projectId: "booboy-memecoin",
  storageBucket: "booboy-memecoin.firebasestorage.app",
  messagingSenderId: "553157973879",
  appId: "1:553157973879:web:97f3cbdef0e31d95a4b372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
export default app;