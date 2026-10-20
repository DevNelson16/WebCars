import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore  } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDbs8CokJhmy-Hx8IC1FMEfEtn3c_q_9K0",
  authDomain: "webcarros-93834.firebaseapp.com",
  projectId: "webcarros-93834",
  storageBucket: "webcarros-93834.firebasestorage.app",
  messagingSenderId: "759206979495",
  appId: "1:759206979495:web:1fe8e5f665cc42599a7882"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export {db, auth, storage}