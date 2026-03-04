// @ts-ignore
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getFirestore } from "firebase/firestore";

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

// Exporta o Banco de Dados para usarmos em outros arquivos
export const db = getFirestore(app);