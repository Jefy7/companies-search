'use client';

import { Download, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAppSelector } from '@/hooks/redux';
import { exportCompanies } from '@/services/api';

export function Header() {
  const [exportLoading, setExportLoading] = useState(false);
  const filters = useAppSelector((state) => state.search.filters);

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
    <header className="glass sticky top-0 z-20 mb-4 flex items-center justify-between rounded-xl px-4 py-3">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <span className="rounded-md bg-accent px-2 py-1 text-xs uppercase tracking-wide">AI</span>
        Prospect Search
      </div>
      <div className="hidden max-w-md flex-1 items-center px-6 md:flex">
        <div className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            id="global-search"
            placeholder="Press / to focus and describe your target companies"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            }}
          />
        </div>
      </div>
      <Button onClick={handleExport} disabled={exportLoading}>
        <Download size={16} className="mr-2 inline-block" />
        {exportLoading ? 'Exporting...' : 'Export CSV'}
      </Button>
      <button onClick={focusSearch} className="sr-only">
        Focus search
      </button>
    </header>
  );
}
