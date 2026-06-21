import React from 'react';

const Mark = ({ size = 72, icon = '✨', name = 'The Closet Whisperer' }) => {
  const isEmoji = !icon.startsWith('http') && !icon.startsWith('/') && icon.length <= 4;
  if (isEmoji) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-cream-100 border border-border-subtle shadow-sm select-none"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {icon}
      </div>
    );
  }
  return (
    <img
      src={icon}
      alt={name}
      width={size}
      height={size}
      className="rounded-lg object-contain"
      style={{ width: size, height: size }}
    />
  );
};

export default function AppLogo({ layout = 'stacked', size = 72, withWordmark = true, className = '' }) {
  const config = window.__brandConfig || {
    brandName: 'The Closet Whisperer',
    brandIcon: '/app-logo.png',
  };

  const name = config.brandName;
  const icon = config.brandIcon;

  if (layout === 'mark-only') {
    return <Mark size={size} icon={icon} name={name} />;
  }
  if (layout === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Mark size={size} icon={icon} name={name} />
        {withWordmark && (
          <span className="font-display font-bold text-[20px] text-ink-primary tracking-tight">
            {name}
          </span>
        )}
      </div>
    );
  }
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <Mark size={size} icon={icon} name={name} />
      {withWordmark && (
        <p className="font-display font-bold text-[22px] text-ink-primary tracking-tight">
          {name}
        </p>
      )}
    </div>
  );
}

