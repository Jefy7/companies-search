import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'primary'
          ? 'bg-accent text-white hover:bg-red-600'
          : 'border border-white/20 bg-white/5 text-white hover:bg-white/10',
        className,
      )}
      {...props}
    />
  );
}
