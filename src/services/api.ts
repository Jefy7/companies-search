import { Company, SearchFilters } from '@/types/company';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

/**
 * Backend Response Shape
 */
export interface CompaniesResponse {
  data: Company[];
  total: number;
  page: number;
  limit: number;
  aiSuggestions?: string[];
}

/**
 * Unified Search (AI + Filters + Similarity)
 */
export async function fetchCompanies(
  filters: SearchFilters,
  page: number = 1,
  limit: number = 10
): Promise<CompaniesResponse> {
  const params = new URLSearchParams();

  // 🔴 REQUIRED: backend expects query always
  // if (!filters.query || filters.query.trim().length === 0) {
  //   throw new Error('Search query is required');
  // }

  params.set('query', filters.query.trim());

  // Optional filters
  if (filters.sector) params.set('sector', filters.sector);
  if (filters.subSector) params.set('subSector', filters.subSector);
  if (filters.location) params.set('location', filters.location);

  params.set('page', String(page));
  params.set('limit', String(limit));

  const response = await fetch(
    `${API_BASE_URL}/companies/search?${params.toString()}`,
    {
      method: 'GET',
      cache: 'no-store', // always fresh (important for AI search)
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Search failed: ${errorText}`);
  }

  return response.json();
}


/**
 * Export Companies (CSV / File)
 */
export async function exportCompanies(
  filters: SearchFilters
): Promise<Blob> {
  const params = new URLSearchParams();

  if (filters.query) params.set('query', filters.query);
  if (filters.sector) params.set('sector', filters.sector);
  if (filters.subSector) params.set('subSector', filters.subSector);
  if (filters.location) params.set('location', filters.location);

  const response = await fetch(
    `${API_BASE_URL}/companies/export?${params.toString()}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to export companies');
  }

  return response.blob();
}