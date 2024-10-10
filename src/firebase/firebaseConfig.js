// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbj4vmjdg1kZSklVARgKlNHYs1WdASnME",
  authDomain: "tour-dulich.firebaseapp.com",
  projectId: "tour-dulich",
  storageBucket: "tour-dulich.appspot.com",
  messagingSenderId: "617498062586",
  appId: "1:617498062586:web:93b4411df235735272e343",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
