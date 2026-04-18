export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  sector: string;
  subSector: string;
  location: string;
  linkedin: string;
}

export interface SearchFilters {
  sector?: string;
  subSector?: string;
  location?: string;
  tags?: string[];
}

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}
