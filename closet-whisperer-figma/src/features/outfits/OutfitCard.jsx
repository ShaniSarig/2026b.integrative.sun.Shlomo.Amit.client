import React, { useState, useEffect } from 'react';
import { CheckCircle, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';

function gridClass(count) {
  if (count <= 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-3';
  return 'grid-cols-2'; // 4 → 2×2
}

export default function OutfitCard({ outfit, itemsMap = {}, large = false, onConfirm, onRegenerate, onRateItem }) {
  const [itemRatings, setItemRatings] = useState({});
  const [confirmed, setConfirmed] = useState(outfit?.confirmed ?? false);

  // Sync if a fresh outfit arrives (e.g. after regenerate)
  useEffect(() => {
    setConfirmed(outfit?.confirmed ?? false);
    setItemRatings({});
  }, [outfit?.id?.id]);

  if (!outfit) return null;

  const dateLabel = outfit.dateCreated
    ? new Date(outfit.dateCreated).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    : "Today's Outfit";

  const resolvedItems = (outfit.items || []).map((it) => {
    const found = itemsMap[it.itemId];
    let image = null;
    if (found?.styleTag?.includes('###')) {
      image = found.styleTag.split('###')[1];
    }
    return { name: found?.subCategory || it.role || 'Item', image, itemId: it.itemId };
  });

  const slots = resolvedItems.length > 0 ? resolvedItems : [null];
  const itemNames = resolvedItems.map((i) => i.name).join(', ');

  const handleItemRate = (itemId, score) => {
    if (!itemId) return;
    const newRating = score > 0 ? 'LIKE' : 'DISLIKE';
    const current = itemRatings[itemId];
    const next = current === newRating ? null : newRating;
    setItemRatings((prev) => ({ ...prev, [itemId]: next }));
    // only call backend when actually setting a rating (not toggling off)
    if (onRateItem && next !== null) onRateItem(itemId, score);
  };

  return (
    <article className={`bg-white border border-border-subtle rounded-lg overflow-hidden shadow-card flex flex-col ${large ? 'h-full' : ''}`}>
      <div className={`bg-cream-100 grid ${gridClass(slots.length)} gap-1 p-3 ${large ? 'flex-1 min-h-0' : 'aspect-[5/4]'}`}>
        {slots.map((slot, i) => {
          const rating = slot?.itemId ? itemRatings[slot.itemId] : null;
          return (
            <div key={i} className="relative bg-cream-200 rounded-sm overflow-hidden group">
              {slot?.image && (
                <img src={slot.image} alt={slot.name} className="w-full h-full object-cover" />
              )}

              {/* Item name label */}
              {slot?.name && (
                <span className="absolute top-1 left-1 text-[10px] font-medium bg-black/40 text-white px-1.5 py-0.5 rounded leading-none">
                  {slot.name}
                </span>
              )}

              {/* Like / Dislike overlay — visible on hover (desktop) or always (touch) */}
              {slot?.itemId && (
                <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleItemRate(slot.itemId, 1)}
                    className={`p-1 rounded-full shadow transition-colors ${
                      rating === 'LIKE'
                        ? 'bg-green-500 text-white'
                        : 'bg-white/80 text-ink-muted hover:bg-green-100 hover:text-green-600'
                    }`}
                    aria-label="Like this item"
                  >
                    <ThumbsUp size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleItemRate(slot.itemId, -1)}
                    className={`p-1 rounded-full shadow transition-colors ${
                      rating === 'DISLIKE'
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-ink-muted hover:bg-red-100 hover:text-red-500'
                    }`}
                    aria-label="Dislike this item"
                  >
                    <ThumbsDown size={11} />
                  </button>
                </div>
              )}

              {/* Coloured border reflects the rating */}
              {rating === 'LIKE' && (
                <div className="absolute inset-0 ring-2 ring-green-400 rounded-sm pointer-events-none" />
              )}
              {rating === 'DISLIKE' && (
                <div className="absolute inset-0 ring-2 ring-red-400 rounded-sm pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 flex flex-col gap-2 shrink-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-lg text-ink-primary leading-tight">
            {dateLabel}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            {outfit.confirmed && (
              <Badge tone="good"><CheckCircle size={12} /> Confirmed</Badge>
            )}
          </div>
        </div>
        {itemNames && <p className="text-sm text-ink-muted">{itemNames}</p>}

        {confirmed ? (
          <p className="flex items-center gap-1.5 text-sm font-medium text-green-600 mt-2">
            <CheckCircle size={15} />
            Outfit saved to your history!
          </p>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            {onConfirm && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => { setConfirmed(true); onConfirm(); }}
                className="flex-1"
              >
                Confirm outfit
              </Button>
            )}
            {onRegenerate && (
              <Button
                size="sm"
                variant="secondary"
                onClick={onRegenerate}
                className="flex-1 flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={13} />
                Regenerate
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
