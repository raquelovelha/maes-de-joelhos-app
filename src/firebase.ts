// @ts-ignore
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
// @ts-ignore
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBmpyvlLrK3SQBQpUWVizbI09WKo--k5Ro",
  authDomain: "maes-de-joelhos.firebaseapp.com",
  projectId: "maes-de-joelhos",
  storageBucket: "maes-de-joelhos.firebasestorage.app",
  messagingSenderId: "905186440856",
  appId: "1:905186440856:web:37c4a455e2223dfbaa82ed"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);