'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setFilters } from '@/redux/slices/searchSlice';
import { setFilterOpen } from '@/redux/slices/uiSlice';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const sectors = ['Fintech', 'Healthcare', 'SaaS', 'E-commerce', 'AI', 'Logistics'];

const LOCATIONS = [
  'London',
  'New York',
  'Bangalore',
  'San Francisco',
  'Berlin',
  'Singapore',
  'Dubai',
  'Sydney',
  'Tokyo',
  'Paris',
];

const SUBSECTOR_MAP: Record<string, string[]> = {
  Fintech: ['Payments', 'Lending', 'InsurTech'],
  Healthcare: ['Telemedicine', 'PharmaTech'],
  SaaS: ['DevTools', 'CRM'],
  'E-commerce': ['Marketplaces', 'D2C'],
  AI: ['Machine Learning', 'NLP'],
  Logistics: ['Supply Chain', 'Delivery'],
};

export function FilterSidebar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.search.filters);
  const isFilterOpen = useAppSelector((state) => state.ui.isFilterOpen);

  const [localFilters, setLocalFilters] = useState({
    sector: '',
    subSector: '',
    location: '',
  });

  /**
   * ✅ Sync Redux → Local (SAFE)
   */
  useEffect(() => {
    setLocalFilters({
      sector: filters.sector ?? '',
      subSector: filters.subSector ?? '',
      location: filters.location ?? '',
    });
  }, [filters.sector, filters.subSector, filters.location]);

  /**
   * ✅ Subsector options
   */
  const subSectorOptions = useMemo(() => {
    return localFilters.sector
      ? SUBSECTOR_MAP[localFilters.sector] || []
      : [];
  }, [localFilters.sector]);

  /**
   * ✅ UI panel class
   */
  const panelClass = useMemo(
    () =>
      `glass rounded-xl p-4 transition-all ${isFilterOpen
        ? 'max-h-[500px] opacity-100'
        : 'max-h-0 overflow-hidden p-0 opacity-0'
      } md:max-h-none md:opacity-100`,
    [isFilterOpen]
  );

  return (
    <aside>
      {/* Mobile Toggle */}
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
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Structured Filters
        </h2>

        <div className="space-y-4">

          {/* Sector */}
          <label className="block text-sm text-gray-300">
            Sector
            <select
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 p-2"
              value={localFilters.sector}
              onChange={(e) => {
                const sector = e.target.value;

                const updated = {
                  sector,
                  subSector: '',
                  location: localFilters.location,
                };

                setLocalFilters(updated);

                dispatch(setFilters({
                  ...filters,
                  sector: sector || undefined,
                  subSector: undefined,
                }));
              }}
            >
              <option value="">All sectors</option>
              {sectors.map((sector) => (
                <option key={sector}>{sector}</option>
              ))}
            </select>
          </label>

          {/* Sub-sector */}
          <label className="block text-sm text-gray-300">
            Sub-sector
            <select
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 p-2"
              value={localFilters.subSector}
              disabled={!localFilters.sector}
              onChange={(e) => {
                const subSector = e.target.value;

                setLocalFilters((prev) => ({
                  ...prev,
                  subSector,
                }));

                dispatch(setFilters({
                  ...filters,
                  subSector: subSector || undefined,
                }));
              }}
            >
              <option value="">All sub-sectors</option>
              {subSectorOptions.map((sub) => (
                <option key={sub}>{sub}</option>
              ))}
            </select>
          </label>

          {/* Location */}
          <label className="block text-sm text-gray-300">
            Location
            <select
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 p-2"
              value={localFilters.location}
              onChange={(e) => {
                const location = e.target.value;

                setLocalFilters((prev) => ({
                  ...prev,
                  location,
                }));

                dispatch(setFilters({
                  ...filters,
                  location: location || undefined,
                }));
              }}
            >
              <option value="">All locations</option>
              {LOCATIONS.map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </select>
          </label>

        </div>
      </div>
    </aside>
  );
}