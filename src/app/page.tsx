'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { ResultsTable } from '@/components/table/ResultsTable';
import { AiChatPanel } from '@/components/chat/AiChatPanel';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setPage, setResults, setSearchLoading } from '@/redux/slices/searchSlice';
import { fetchCompanies } from '@/services/api';
import { MessageSquare } from 'lucide-react';
import { setChatOpen } from '@/redux/slices/uiSlice';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { filters, page } = useAppSelector((state) => state.search);
  const isChatOpen = useAppSelector((state) => state.ui.isChatOpen);

  useEffect(() => {
    const runSearch = async () => {
      dispatch(setSearchLoading(true));
      try {
        const response = await fetchCompanies(filters, page, 10);
        dispatch(setResults({ results: response.results, total: response.total }));
      } catch {
        dispatch(setResults({ results: [], total: 0 }));
      } finally {
        dispatch(setSearchLoading(false));
      }
    };

    void runSearch();
  }, [dispatch, filters.location, filters.sector, filters.subSector, page]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) {
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
      <div className="grid gap-4 md:grid-cols-[280px_1fr_360px]">
        <div className="order-2 md:order-1">
          <FilterSidebar />
        </div>

        <div className="order-3 md:order-2">
          <ResultsTable onPageChange={(nextPage) => dispatch(setPage(nextPage))} />
        </div>

        <div className={`order-1 md:order-3 ${isChatOpen ? 'block' : 'hidden md:block'}`}>
          <AiChatPanel />
        </div>
      </div>

      <button
        onClick={() => dispatch(setChatOpen(!isChatOpen))}
        className="fixed bottom-5 right-5 rounded-full bg-accent p-4 text-white shadow-lg transition hover:bg-red-600 md:hidden"
        aria-label="Toggle AI chat"
      >
        <MessageSquare size={20} />
      </button>
    </main>
  );
}
