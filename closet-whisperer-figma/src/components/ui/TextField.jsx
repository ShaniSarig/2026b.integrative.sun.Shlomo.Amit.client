import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function TextField({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  autoComplete,
  required,
  rightAdornment,
  className = '',
}) {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && reveal ? 'text' : type;

  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="font-sans font-medium text-sm leading-[18px] text-ink-primary">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3 px-5 py-[14px] bg-elevated border border-border-subtle rounded-md focus-within:border-border-strong">
        {Icon && <Icon size={20} className="text-ink-muted shrink-0" strokeWidth={1.75} />}
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="flex-1 bg-transparent outline-none text-base leading-6 text-ink-primary placeholder:text-ink-muted"
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            className="text-ink-muted hover:text-ink-primary shrink-0"
            aria-label={reveal ? 'Hide password' : 'Show password'}
          >
            {reveal ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        ) : (
          rightAdornment
        )}
      </div>
    </label>
  );
}
