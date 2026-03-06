
export interface PrayerRequest {
  id: number;

  // O backend (Firebase) usa campos em português. Mantemos as propriedades mais usadas
  // para evitar inconsistências com a UI atual.
  texto: string;
  categoria: string;
  versiculo: string;

  isFavorite: boolean;
  isPrayed: boolean;
  personalNotes?: string;

  // Campos opcionais para compatibilidade com possíveis usos futuros
  title?: string;
  description?: string;
  verse?: string;
  category?: string;
}

export interface Child {
  id: string;
  name: string;
  photo?: string;
  whatsapp?: string;
  type: 'biologico' | 'espiritual' | 'adotivo' | 'geracao_compromisso';
  birthDate: string;
  location: string;
  notes: string;
  startDate: string;
  prayerMinutes: number;
  requests: ChildPrayerRequest[];
  userId?: string;
  status?: 'active' | 'pending_review';
}

export interface ChildPrayerRequest {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface UserStats {
  streak: number;
  totalMinutes: number;
  totalDays: number;
  hasDailyTrophy: boolean;
}

export interface UserProfile {
  // Os dados do Firestore usam campos em português (nome, pedidosConcluidosHoje, etc.)
  nome: string;
  photo?: string;
  birthDate?: string;
  church?: string;
  participationTime?: string;
  groupName?: string;

  dataUltimaOracao?: string;
  pedidosConcluidosHoje?: number;
  minutosHoje?: number;
  pedidosTotalHistorico?: number;
  minutosTotalHistorico?: number;
}

export interface CommunityRequest {
  id: string;
  userName: string;
  content: string;
  timestamp: string;
  reactions: {
    pray: number;
    done: number;
    heart: number;
  };
  commentCount: number;
}
