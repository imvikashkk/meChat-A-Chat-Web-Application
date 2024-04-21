import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

//TODO use .env
const firebaseConfig = {
  apiKey: "AIzaSyDwo8Q6ARrnlz9FN8i9dJxuuxuPk_NWMQQ",
  authDomain: "mechat-2024.firebaseapp.com",
  projectId: "mechat-2024",
  storageBucket: "mechat-2024.appspot.com",
  messagingSenderId: "17532852672",
  appId: "1:17532852672:web:6d32ba97955503b2805025",
  measurementId: "G-3S01X6NPZH"
}

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth  = getAuth(app);

export {app,firestore, auth}