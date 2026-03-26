import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyByBvvZ4fLcGW2p1cUMwQ04AkIz0anA2u4",
  authDomain: "nabooshy.firebaseapp.com",
  projectId: "nabooshy",
  storageBucket: "nabooshy.firebasestorage.app",
  messagingSenderId: "52255572575",
  appId: "1:52255572575:web:2d83762b88833e084bd1ea",
  measurementId: "G-W3XQ6SYBW8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };