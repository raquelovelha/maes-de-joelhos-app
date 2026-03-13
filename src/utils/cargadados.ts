import { db } from '../firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import pedidosData from './pedidos.json';

export const executarCarga = async () => { // Verifique se tem o 'export' aqui!
  try {
    const batch = writeBatch(db);
    const colRef = collection(db, "sugestoes_oracao");

    pedidosData.forEach((p: any) => {
      const docRef = doc(colRef, p.dia.toString());
      batch.set(docRef, p);
    });

    await batch.commit();
    alert("🔥 Sucesso! 105 pedidos carregados.");
  } catch (e) {
    console.error(e);
    alert("Erro na carga.");
  }
};