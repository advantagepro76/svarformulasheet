// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXwyt03nZ0Y3NdpE-XJ3UJ6EWSZcDt0XQ",
  authDomain: "svar-formula-app.firebaseapp.com",
  projectId: "svar-formula-app",
  storageBucket: "svar-formula-app.appspot.com",
  messagingSenderId: "205336855334",
  appId: "1:205336855334:web:ea700cde7a5ba69d6ab7e7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
