
export interface PrayerRequest {
  id: number;
  title: string;
  description: string;
  verse: string;
  category: string;
  isFavorite: boolean;
  isPrayed: boolean;
  personalNotes?: string;
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
  status?: 'active' | 'pending_review'; // Novo campo para controle de fluxo
}

export interface ChildPrayerRequest {
  id: string;
  request: string;
  verse?: string;
  status: 'em_oracao' | 'respondido';
  createdAt: string; // ISO String
  resolvedAt?: string; // ISO String quando marcado como respondido
  lastPrayedAt?: string; // ISO String da última vez que foi especificamente intercedido
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
