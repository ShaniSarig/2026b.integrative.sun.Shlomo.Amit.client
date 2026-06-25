import React from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, Shirt } from 'lucide-react';

function weatherIcon(condition) {
  if (!condition) return '🌤';
  const c = condition.toLowerCase();
  if (c.includes('snow')) return '❄️';
  if (c.includes('storm') || c.includes('thunder')) return '⛈';
  if (c.includes('rain') || c.includes('drizzle')) return '🌧';
  if (c.includes('cloud')) return '☁️';
  if (c.includes('clear') || c.includes('sunny')) return '☀️';
  if (c.includes('mist') || c.includes('fog')) return '🌫';
  return '🌤';
}

function formatDay(dateStr) {
  if (!dateStr) return { weekday: '—', date: '' };
  const d = new Date(dateStr);
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  };
}

function gridClass(count) {
  if (count <= 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-3';
  return 'grid-cols-2';
}

export default function HistoryCard({ entry, itemsMap = {}, onRate }) {
  if (!entry) return null;

  const { weekday, date } = formatDay(entry.dateCreated);
  const weather = entry.weather || {};
  const temp = weather.temperature != null ? `${Math.round(weather.temperature)}°C` : null;
  const condition = weather.condition || null;
  const hasWeather = temp || condition;

  const rating = entry.userRating; // 'LIKE' | 'DISLIKE' | null

  const handleRate = (score) => {
    if (!onRate) return;
    onRate(entry.id?.objectId, score);
  };

  const resolvedItems = (entry.items || []).map((it) => {
    const found = itemsMap[it.itemId];
    let image = null;
    if (found?.styleTag?.includes('###')) {
      image = found.styleTag.split('###')[1];
    }
    return { name: found?.subCategory || it.role || 'Item', image, itemId: it.itemId };
  });

  const slots = resolvedItems.length > 0 ? resolvedItems : [];

  return (
    <article className="bg-white border border-border-subtle rounded-lg shadow-card overflow-hidden flex flex-col">
      {/* Clothing images grid */}
      {slots.length > 0 ? (
        <div className={`bg-cream-100 grid ${gridClass(slots.length)} gap-1 p-2 aspect-[5/3]`}>
          {slots.map((slot, i) => (
            <div key={i} className="relative bg-cream-200 rounded-sm overflow-hidden">
              {slot.image ? (
                <img src={slot.image} alt={slot.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Shirt size={20} className="text-ink-muted opacity-40" />
                </div>
              )}
              <span className="absolute top-1 left-1 text-[9px] font-medium bg-black/40 text-white px-1 py-0.5 rounded leading-none">
                {slot.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-cream-100 aspect-[5/3] flex items-center justify-center">
          <Shirt size={28} className="text-ink-muted opacity-30" />
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        {/* Date row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-display font-bold text-lg text-ink-primary leading-tight">{weekday}</p>
            <p className="text-sm text-ink-muted">{date}</p>
          </div>
          {entry.confirmed && (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 whitespace-nowrap">
              <CheckCircle size={11} /> Confirmed
            </span>
          )}
        </div>

        {/* Weather row */}
        {hasWeather ? (
          <div className="flex items-center gap-1.5 text-sm text-ink-secondary">
            <span className="text-base leading-none">{weatherIcon(condition)}</span>
            {temp && <span className="font-medium">{temp}</span>}
            {condition && <span className="text-ink-muted capitalize">{condition}</span>}
          </div>
        ) : (
          <p className="text-sm text-ink-muted italic">No weather data</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 pt-1 border-t border-border-subtle">
          <span className="text-xs text-ink-muted mr-auto">
            {rating === 'LIKE' ? 'You liked this outfit' : rating === 'DISLIKE' ? 'You disliked this outfit' : 'Rate this outfit'}
          </span>
          <button
            type="button"
            onClick={() => handleRate(1)}
            className={`p-1.5 rounded-full transition-colors ${
              rating === 'LIKE'
                ? 'bg-green-500 text-white'
                : 'text-ink-muted hover:bg-green-50 hover:text-green-600'
            }`}
            aria-label="Like"
          >
            <ThumbsUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleRate(-1)}
            className={`p-1.5 rounded-full transition-colors ${
              rating === 'DISLIKE'
                ? 'bg-red-500 text-white'
                : 'text-ink-muted hover:bg-red-50 hover:text-red-500'
            }`}
            aria-label="Dislike"
          >
            <ThumbsDown size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
