import React from 'react';

const VARIANTS = {
  primary:
    'bg-brand-primary text-ink-inverse hover:bg-taupe-500 active:bg-taupe-700 disabled:opacity-60',
  secondary:
    'bg-white text-ink-primary border border-border-strong hover:bg-cream-50 disabled:opacity-60',
  ghost:
    'bg-transparent text-brand-accent hover:bg-cream-50 disabled:opacity-60',
  danger:
    'bg-[#B5483A] text-white hover:bg-[#9A3C30] disabled:opacity-60',
};

const SIZES = {
  md: 'px-8 py-3 text-base rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-md',
  lg: 'px-10 py-4 text-base rounded-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  full = false,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-sans font-semibold leading-6 transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
