'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setFilters } from '@/redux/slices/searchSlice';
import { setFilterOpen } from '@/redux/slices/uiSlice';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const sectors = ['Fintech', 'Healthcare', 'SaaS', 'E-commerce', 'AI'];
const subSectors = ['Payments', 'Insurance', 'DevTools', 'Security', 'Analytics'];

export function FilterSidebar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.search.filters);
  const isFilterOpen = useAppSelector((state) => state.ui.isFilterOpen);

  const [localFilters, setLocalFilters] = useState({
    sector: filters.sector ?? '',
    subSector: filters.subSector ?? '',
    location: filters.location ?? '',
  });

  const debounced = useDebounce(localFilters, 400);

  useEffect(() => {
    dispatch(
      setFilters({
        sector: debounced.sector || undefined,
        subSector: debounced.subSector || undefined,
        location: debounced.location || undefined,
      }),
    );
  }, [debounced, dispatch]);

  useEffect(() => {
    setLocalFilters({
      sector: filters.sector ?? '',
      subSector: filters.subSector ?? '',
      location: filters.location ?? '',
    });
  }, [filters.location, filters.sector, filters.subSector]);

  const panelClass = useMemo(
    () =>
      `glass rounded-xl p-4 transition-all ${
        isFilterOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 overflow-hidden p-0 opacity-0'
      } md:max-h-none md:opacity-100`,
    [isFilterOpen],
  );

  return (
    <aside>
      <button
        className="glass mb-3 flex w-full items-center justify-between rounded-xl px-4 py-3 md:hidden"
        onClick={() => dispatch(setFilterOpen(!isFilterOpen))}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters
        </span>
        <ChevronDown size={16} className={isFilterOpen ? 'rotate-180' : ''} />
      </button>
      <div className={panelClass}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-300">Structured Filters</h2>
        <div className="space-y-4">
          <label className="block text-sm text-gray-300">
            Sector
            <select
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 p-2"
              value={localFilters.sector}
              onChange={(event) => setLocalFilters((prev) => ({ ...prev, sector: event.target.value }))}
            >
              <option value="">All sectors</option>
              {sectors.map((sector) => (
                <option key={sector}>{sector}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-gray-300">
            Sub-sector
            <select
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 p-2"
              value={localFilters.subSector}
              onChange={(event) => setLocalFilters((prev) => ({ ...prev, subSector: event.target.value }))}
            >
              <option value="">All sub-sectors</option>
              {subSectors.map((subSector) => (
                <option key={subSector}>{subSector}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-gray-300">
            Location
            <input
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 p-2"
              value={localFilters.location}
              placeholder="City / region"
              onChange={(event) => setLocalFilters((prev) => ({ ...prev, location: event.target.value }))}
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
