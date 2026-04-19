'use client';

import { Download, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { exportCompanies } from '@/services/api';
import { setFilters } from '@/redux/slices/searchSlice';

export function Header() {
  const dispatch = useAppDispatch();
  const { filters, results, aiSuggestions } = useAppSelector(
    (state) => state.search
  );

  const [exportLoading, setExportLoading] = useState(false);
  const [query, setQuery] = useState(filters.query || '');

  /**
   * 🔥 Debounced AI search trigger
   */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length > 0) {
        dispatch(setFilters({ query }));
      }
    }, 1000); // faster UX

    return () => clearTimeout(delay);
  }, [query, dispatch]);

  /**
   * 🔁 Sync external updates
   */
  useEffect(() => {
    setQuery(filters.query || '');
  }, [filters.query]);

  /**
   * 🧠 Extract unique tags from results
   */
  const tagChips = useMemo(() => {
    if (!results?.length) return [];

    const allTags = results.flatMap((item) => item.tags || []);
    return [...new Set(allTags)].slice(0, 4); // limit for UI
  }, [results]);

  /**
   * 👉 Handle chip click
   */
  const handleChipClick = (value: string) => {
    setQuery(value);
    dispatch(setFilters({ query: value }));
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const blob = await exportCompanies(filters);
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `companies-export-${Date.now()}.csv`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExportLoading(false);
    }
  };

  const focusSearch = () => {
    const input = document.getElementById('global-search');
    input?.focus();
  };

  return (
    <header className="glass sticky top-0 z-20 mb-4 rounded-xl px-4 py-3">

      {/* Top Row */}
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span className="rounded-md bg-accent px-2 py-1 text-xs uppercase tracking-wide">
            AI
          </span>
          Prospect Search
        </div>

        {/* Search */}
        <div className="hidden max-w-md flex-1 px-6 md:block">
          <div className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              id="global-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies (AI powered)..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Export */}
        <Button onClick={handleExport} disabled={exportLoading}>
          <Download size={16} className="mr-2 inline-block" />
          {exportLoading ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>

      {/* 🔥 Suggestions + Tags */}
      <div className="mt-3 flex flex-wrap gap-2">

        {/* AI Suggestions */}
        {aiSuggestions?.map((suggestion: string, idx: number) => (
          <button
            key={`ai-${idx}`}
            onClick={() => handleChipClick(suggestion)}
            className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-300 hover:bg-blue-500/20"
          >
            {suggestion}
          </button>
        ))}

        {/* Tag Chips */}
        {tagChips.map((tag: string, idx: number) => (
          <button
            key={`tag-${idx}`}
            onClick={() => handleChipClick(tag)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 hover:bg-white/10"
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Hidden focus trigger */}
      <button onClick={focusSearch} className="sr-only">
        Focus search
      </button>
    </header>
  );
}