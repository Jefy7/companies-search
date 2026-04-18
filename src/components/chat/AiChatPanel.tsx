'use client';

import { FormEvent, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addMessage, setAiLoading } from '@/redux/slices/aiSlice';
import { setFilters, setResults, setFilterTags } from '@/redux/slices/searchSlice';
import { aiSearch } from '@/services/api';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';

const suggestions = ['Fintech companies in London', 'Series B healthcare startups', 'SaaS companies in New York'];

export function AiChatPanel() {
  const dispatch = useAppDispatch();
  const { messages, loading } = useAppSelector((state) => state.ai);
  const tags = useAppSelector((state) => state.search.filters.tags || []);
  const [query, setQuery] = useState('');

  const submitQuery = async (inputQuery: string) => {
    if (!inputQuery.trim()) return;

    dispatch(addMessage({ role: 'user', content: inputQuery }));
    dispatch(setAiLoading(true));

    try {
      const response = await aiSearch(inputQuery);
      dispatch(setFilters(response.filters));
      dispatch(setResults({ results: response.results, total: response.total }));

      const newTags = Object.entries(response.filters)
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => `${key}: ${String(value)}`);
      dispatch(setFilterTags(newTags));

      dispatch(
        addMessage({
          role: 'assistant',
          content: response.message ?? `I found ${response.total} companies and updated your filters.`,
        }),
      );
    } catch {
      dispatch(addMessage({ role: 'assistant', content: 'Something went wrong while running AI search. Please retry.' }));
    } finally {
      dispatch(setAiLoading(false));
      setQuery('');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitQuery(query);
  };

  return (
    <section className="glass flex h-[70vh] flex-col rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-300">AI Assistant</h2>
        <Sparkles size={16} className="text-accent" />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip key={tag} label={tag} />
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[90%] rounded-xl px-3 py-2 text-sm transition-opacity duration-300 ${
              message.role === 'user'
                ? 'ml-auto bg-accent text-white'
                : 'mr-auto border border-white/10 bg-white/10 text-gray-100'
            }`}
          >
            {message.content}
          </div>
        ))}
        {loading && <div className="mr-auto rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm">Thinking…</div>}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-gray-300 hover:border-accent hover:text-white"
            onClick={() => submitQuery(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask AI to refine your prospect search..."
          className="flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none"
        />
        <Button type="submit" disabled={loading}>
          <Send size={16} />
        </Button>
      </form>
    </section>
  );
}
