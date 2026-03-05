import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBmpyvlLrK3SQBQpUWVizbI09WKo--k5Ro",
  authDomain: "maes-de-joelhos.firebaseapp.com",
  projectId: "maes-de-joelhos",
  storageBucket: "maes-de-joelhos.firebasestorage.app",
  messagingSenderId: "905186440856",
  appId: "1:905186440856:web:37c4a455e2223dfbaa82ed"
};

// Inicializa o Firebase (O "Coração" do App)
const app = initializeApp(firebaseConfig);

// Exporta as ferramentas para o restante do projeto
export const db = getFirestore(app);
export const auth = getAuth(app); // <--- ESSA LINHA É A MAIS IMPORTANTE!