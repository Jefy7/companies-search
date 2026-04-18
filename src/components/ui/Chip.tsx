import { X } from 'lucide-react';

interface ChipProps {
  label: string;
  onRemove?: () => void;
}

export function Chip({ label, onRemove }: ChipProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-gray-200">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="text-gray-400 transition hover:text-white" aria-label={`Remove ${label}`}>
          <X size={12} />
        </button>
      )}
    </span>
  );
}
