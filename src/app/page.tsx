'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { ResultsTable } from '@/components/table/ResultsTable';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  setPage,
  setResults,
  setSearchLoading,
  setAiSuggestions, // ✅ NEW
} from '@/redux/slices/searchSlice';
import { fetchCompanies } from '@/services/api';
import { MessageSquare } from 'lucide-react';
import { setChatOpen } from '@/redux/slices/uiSlice';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { filters, page } = useAppSelector((state) => state.search);
  const isChatOpen = useAppSelector((state) => state.ui.isChatOpen);

  /**
   * 🔥 Main Search Effect (AI + Filters)
   */
  useEffect(() => {
    const hasQuery = filters.query && filters.query.trim().length > 0;
    const hasFilters =
      !!filters.sector ||
      !!filters.subSector ||
      !!filters.location;

    console.log("hasQuery", hasQuery)
    console.log("hasFilters", hasFilters)
    if (!hasQuery && !hasFilters) return;

    const runSearch = async () => {
      dispatch(setSearchLoading(true));

      try {
        const response = await fetchCompanies(filters, page, 10);

        dispatch(
          setResults({
            results: response.data,
            total: response.total,
          })
        );

        dispatch(setAiSuggestions(response.aiSuggestions ?? []));
      } catch (error) {
        console.error('Search failed:', error);

        dispatch(setResults({ results: [], total: 0 }));
        dispatch(setAiSuggestions([]));
      } finally {
        dispatch(setSearchLoading(false));
      }
    };

    void runSearch();
  }, [
    dispatch,
    filters.query,
    filters.location,
    filters.sector,
    filters.subSector,
    page,
  ]);
  /**
   * 🔥 Keyboard Shortcut (focus search)
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === '/' &&
        !(event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <Header />

      <div className="grid gap-4 md:grid-cols-[280px_1fr_0px]">
        {/* Filters */}
        <div className="order-2 md:order-1">
          <FilterSidebar />
        </div>

        {/* Results */}
        <div className="order-3 md:order-2">
          <ResultsTable
            onPageChange={(nextPage) => dispatch(setPage(nextPage))}
          />
        </div>
      </div>

    </main>
  );
}