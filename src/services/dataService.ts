
import { db } from './firebase';
import { collection, doc, getDocs, setDoc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { ChildOfPrayer, PrayerRequest, UserStats, UserProfile } from '../types';

// Responsabilidade: Abstração de persistência (Firestore). | Inputs: Domain Objects | Outputs: Promises/Streams.

export const DataService = {
  // Filhos
  async getChildren(): Promise<ChildOfPrayer[]> {
    const querySnapshot = await getDocs(collection(db, "children"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChildOfPrayer));
  },

  async saveChild(child: ChildOfPrayer): Promise<void> {
    await setDoc(doc(db, "children", child.id), child);
  },

  // Orações
  async getPrayers(): Promise<PrayerRequest[]> {
    const querySnapshot = await getDocs(collection(db, "prayers"));
    return querySnapshot.docs.map(doc => ({ id: Number(doc.id), ...doc.data() } as PrayerRequest));
  },

  async updatePrayer(prayer: PrayerRequest): Promise<void> {
    await updateDoc(doc(db, "prayers", prayer.id.toString()), { ...prayer });
  },

  // Stats
  async getStats(): Promise<UserStats> {
    const docSnap = await getDocs(collection(db, "stats"));
    return docSnap.docs[0]?.data() as UserStats;
  },

  async updateStats(stats: UserStats): Promise<void> {
    // Simplificado para demo: assume um único documento de stats
    const q = query(collection(db, "stats"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, "stats", snap.docs[0].id), { ...stats });
    }
  }
};
