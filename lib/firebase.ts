// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Do not import analytics in shared code
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIhyU9ALWLENrj8Pz_so9aVcrXBtcO6MI",
  authDomain: "finance-tracker-4a92b.firebaseapp.com",
  projectId: "finance-tracker-4a92b",
  storageBucket: "finance-tracker-4a92b.firebasestorage.app",
  messagingSenderId: "272089925985",
  appId: "1:272089925985:web:7975966ef4d665ff98dd20",
  measurementId: "G-N8EDXPKF2E"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// If you need analytics, use the following function in a client component only:
// export async function initAnalytics() {
//   if (typeof window !== "undefined") {
//     const { getAnalytics } = await import("firebase/analytics");
//     return getAnalytics(app);
//   }
//   return null;
// }
export const db = getFirestore(app);
export const auth = getAuth(app);
 