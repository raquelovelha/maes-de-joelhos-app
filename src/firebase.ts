import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Adicione isso para o Login funcionar

const firebaseConfig = {
  apiKey: "AIzaSyBmpyvlLrK3SQBQpUWVizbI09WKo--k5Ro",
  authDomain: "maes-de-joelhos.firebaseapp.com",
  projectId: "maes-de-joelhos",
  storageBucket: "maes-de-joelhos.firebasestorage.app",
  messagingSenderId: "905186440856",
  appId: "1:905186440856:web:37c4a455e2223dfbaa82ed"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias para o restante do app
export const db = getFirestore(app);
export const auth = getAuth(app); // Importante: exporte o auth aqui