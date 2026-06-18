import React from 'react';

const Mark = ({ size = 72 }) => (
  <img
    src="/app-logo.png"
    alt="The Closet Whisperer"
    width={size}
    height={size}
    className="rounded-lg object-contain"
    style={{ width: size, height: size }}
  />
);

export default function AppLogo({ layout = 'stacked', size = 72, withWordmark = true, className = '' }) {
  if (layout === 'mark-only') {
    return <Mark size={size} />;
  }
  if (layout === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Mark size={size} />
        {withWordmark && (
          <span className="font-display font-bold text-[22px] text-ink-primary">
            The Closet Whisperer
          </span>
        )}
      </div>
    );
  }
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <Mark size={size} />
      {withWordmark && (
        <p className="font-display font-bold text-[22px] text-ink-primary">
          The Closet Whisperer
        </p>
      )}
    </div>
  );
}
