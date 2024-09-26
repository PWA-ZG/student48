import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAg7a5yxkZj-7j10Jjbaoay1YbJ8o02fBY",
  authDomain: "web2-lab5-pwa.firebaseapp.com",
  projectId: "web2-lab5-pwa",
  storageBucket: "web2-lab5-pwa.appspot.com",
  messagingSenderId: "348054969420",
  appId: "1:348054969420:web:270628d6ef89e29c5da8e9",
  measurementId: "G-T6MW3MJQKN",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
