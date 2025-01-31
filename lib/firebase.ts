import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSFEnLXzuqel1g15If_UMtGZXsVnxwPzw",
  authDomain: "iitrsba.firebaseapp.com",
  projectId: "iitrsba",
  storageBucket: "iitrsba.firebasestorage.app",
  messagingSenderId: "393673240182",
  appId: "1:393673240182:web:fa2d953fc9a1c366737957"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);