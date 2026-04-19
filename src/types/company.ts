export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  sector: string;
  subSector: string;
  location: string;
  linkedin?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 🔥 Updated: includes REQUIRED query
 */
export interface SearchFilters {
  query: string; // ✅ REQUIRED (matches NestJS DTO)
  sector?: string;
  subSector?: string;
  location?: string;
  tags?: string[];
}

/**
 * 🔥 Matches backend response
 */
export interface CompaniesResponse {
  data: Company[];
  total: number;
  page: number;
  limit: number;
  aiSuggestions?: string[];
}

/**
 * Optional (if you extend chat later)
 */
export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}