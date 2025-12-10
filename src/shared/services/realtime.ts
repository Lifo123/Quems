//NO EXPORT TO INDEX

import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDqoH9U9yfWbJbSXxiOyxy-Wu3ddRYchv8",
    authDomain: "quems-2f307.firebaseapp.com",
    projectId: "quems-2f307",
    storageBucket: "quems-2f307.firebasestorage.app",
    messagingSenderId: "289358159470",
    appId: "1:289358159470:web:6710e12f88c3fb1575507f",
    measurementId: "G-B0TE5NXJ4J"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const rtdb = getDatabase(app);

export const realtime = {
    rtdb
};