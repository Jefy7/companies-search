import { Company, SearchFilters } from '@/types/company';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

interface CompaniesResponse {
  results: Company[];
  total: number;
}

interface AiResponse {
  filters: SearchFilters;
  results: Company[];
  total: number;
  message?: string;
}

export async function fetchCompanies(filters: SearchFilters, page: number, limit = 10): Promise<CompaniesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (filters.sector) params.set('sector', filters.sector);
  if (filters.subSector) params.set('subSector', filters.subSector);
  if (filters.location) params.set('location', filters.location);

  const response = await fetch(`${API_BASE_URL}/companies?${params.toString()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to fetch companies');
  return response.json();
}

export async function aiSearch(query: string): Promise<AiResponse> {
  const response = await fetch(`${API_BASE_URL}/search/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) throw new Error('Failed to run AI search');
  return response.json();
}

export async function exportCompanies(filters: SearchFilters): Promise<Blob> {
  const params = new URLSearchParams();
  if (filters.sector) params.set('sector', filters.sector);
  if (filters.subSector) params.set('subSector', filters.subSector);
  if (filters.location) params.set('location', filters.location);

  const response = await fetch(`${API_BASE_URL}/companies/export?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to export companies');
  return response.blob();
}
