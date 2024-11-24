import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCG9Fm-Po2mhAdyEdF18l0TG9wCKc3E_Rc",
  authDomain: "bookchill-9ad45.firebaseapp.com",
  projectId: "bookchill-9ad45",
  storageBucket: "bookchill-9ad45.appspot.com",
  messagingSenderId: "469901342860",
  appId: "1:469901342860:web:717007f903ade4edc263a9",
  measurementId: "G-KH5NGRTKCM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }