import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// 🔥 Replace this with YOUR Firebase project config
// Get it from: Firebase Console → Project Settings → Your apps → Web app
const firebaseConfig = {
  apiKey: "AIzaSyBCdrg_rqSjHtG1mVvvXz_wW19t_YR25-c",
  authDomain: "cc-expense-tracker-b6931.firebaseapp.com",
  projectId: "cc-expense-tracker-b6931",
  storageBucket: "cc-expense-tracker-b6931.firebasestorage.app",
  messagingSenderId: "419330703425",
  appId: "1:419330703425:web:d0a6cca9598d7127f806c0",
  measurementId: "G-XLCL0HZQWF",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
