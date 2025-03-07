import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCaIU94NWFZwTZCZaoLefEtuaJRJ3zY91A",
  authDomain: "fractn-admin.firebaseapp.com",
  projectId: "fractn-admin",
  storageBucket: "fractn-admin.firebasestorage.app",
  messagingSenderId: "775107634893",
  appId: "1:775107634893:web:e145dfb46891a5df486b84",
  measurementId: "G-R52SR1BSF4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

// setPersistence(auth, browserLocalPersistence)
//   .then(() => {
//     console.log("Auth persistence set successfully");
//   })
//   .catch((error) => {
//     console.error("Error setting auth persistence:", error);
//   });

export { db,  storage };
