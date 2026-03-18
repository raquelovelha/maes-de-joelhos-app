export interface PrayerRequest {
  id: number;
  title: string;
  description: string; // Este é o seu 'texto'
  verse: string;       // Este é o seu 'versiculo'
  category: string;
  isFavorite: boolean;
  isPrayed: boolean;
  personalNotes?: string;
  texto_biblico?: string; // Adicionado para bater com o seu card
}

export interface ChildOfPrayer {
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
  individualRequests: ChildPrayerRequest[];
  status?: 'active' | 'pending_review';
}

export interface ChildPrayerRequest {
  id: string;
  request: string;
  verse?: string;
  status: 'em_oracao' | 'respondido';
  createdAt: string; 
  resolvedAt?: string;
  lastPrayedAt?: string;
  notes?: string;
}

export interface UserStats {
  streak: number;
  totalMinutes: number;
  totalDays: number;
  hasDailyTrophy: boolean;
}

export interface UserProfile {
  name: string;
  photo?: string;
  birthDate: string;
  church: string;
  participationTime: string;
  groupName: string;
  ultimoResumo?: string; // Para a Home não reclamar
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

// Sem as chaves extras no final
export type Prayer = PrayerRequest;