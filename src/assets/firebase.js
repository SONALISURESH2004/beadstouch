import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7Kis4wQ6VVdc78CvwIppORzVUeSTbJM0",
  authDomain: "beadstouch-a2856.firebaseapp.com",
  databaseURL: "https://beadstouch-a2856-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "beadstouch-a2856",
  storageBucket: "beadstouch-a2856.firebasestorage.app",
  messagingSenderId: "205399503239",
  appId: "1:205399503239:web:549338b99671aa0c1a2322",
  measurementId: "G-T59S732Q1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Firestore
const firestore = getFirestore(app);

export { database, firestore };