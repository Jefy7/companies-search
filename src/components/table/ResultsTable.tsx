'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from './Pagination';

interface ResultsTableProps {
  onPageChange: (page: number) => void;
}

export function ResultsTable({ onPageChange }: ResultsTableProps) {
  const { results, loading, total, page } = useAppSelector((state) => state.search);

  /**
   * 📊 Pagination Range
   */
  const start = total === 0 ? 0 : (page - 1) * 10 + 1;
  const end = Math.min(page * 10, total);

  const content = useMemo(() => {
    if (loading) {
      return Array.from({ length: 6 }).map((_, idx) => (
        <tr key={idx} className="border-b border-white/10">
          {Array.from({ length: 8 }).map((__, cidx) => (
            <td key={cidx} className="px-4 py-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ));
    }

    if (results.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
            No companies found. Try adjusting your filters or ask the AI assistant.
          </td>
        </tr>
      );
    }

    return results.map((company) => (
      <tr
        key={company.id}
        className="border-b border-white/10 text-sm transition hover:bg-white/5"
      >
        <td className="px-4 py-3 font-medium">{company.name}</td>
        <td className="px-4 py-3 text-gray-300">{company.email}</td>
        <td className="px-4 py-3 text-gray-300">{company.phone}</td>
        <td className="px-4 py-3 text-gray-300">{company.sector}</td>
        <td className="px-4 py-3 text-gray-300">{company.subSector}</td>
        <td className="px-4 py-3 text-gray-300">{company.location}</td>
        <td className="px-4 py-3">
          <a
            href={company.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            Profile
          </a>
        </td>
        <td className="px-4 py-3 text-gray-300">{company.sector} lead</td>
      </tr>
    ));
  }, [loading, results]);

  return (
    <section className="glass rounded-xl p-4">

      {/* 🔥 RESULT SUMMARY */}
      <div className="mb-4 flex items-center justify-between text-sm text-gray-400">
        <span>
          {loading
            ? 'Searching...'
            : total > 0
              ? `Showing ${start}–${end} of ${total} companies`
              : 'No results found'}
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-gray-400">
              <th className="px-4 py-3">Company Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">Sub-sector</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">LinkedIn</th>
              <th className="px-4 py-3">Features</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}
        total={total}
        limit={10}
        onPageChange={onPageChange}
      />
    </section>
  );
}