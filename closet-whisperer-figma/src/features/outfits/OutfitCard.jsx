import React from 'react';
import { Trash2, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';

export default function OutfitCard({ outfit, itemsMap = {}, large = false, onConfirm, onRate, onDelete }) {
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
    return { name: found?.subCategory || it.role || 'Item', image };
  });

  const itemNames = resolvedItems.map((i) => i.name).join(', ');
  const displaySlots = [0, 1, 2].map((i) => resolvedItems[i] ?? null);

  return (
    <article className="bg-white border border-border-subtle rounded-lg overflow-hidden shadow-card flex flex-col">
      <div className={`bg-cream-100 grid grid-cols-3 gap-1 p-3 ${large ? 'aspect-[4/3]' : 'aspect-[5/4]'}`}>
        {displaySlots.map((slot, i) => (
          <div key={i} className="bg-cream-200 rounded-sm overflow-hidden">
            {slot?.image && (
              <img src={slot.image} alt={slot.name} className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-lg text-ink-primary leading-tight">
            {dateLabel}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            {outfit.confirmed && (
              <Badge tone="good"><CheckCircle size={12} /> Confirmed</Badge>
            )}
            {outfit.userRating === 'LIKE' && (
              <Badge tone="good">Liked</Badge>
            )}
            {outfit.userRating === 'DISLIKE' && (
              <Badge tone="warn">Disliked</Badge>
            )}
          </div>
        </div>
        {itemNames && <p className="text-sm text-ink-muted">{itemNames}</p>}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {onConfirm && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onConfirm}
              disabled={outfit.confirmed}
            >
              {outfit.confirmed ? 'Confirmed ✓' : 'Confirm'}
            </Button>
          )}
          {onRate && (
            <>
              <Button
                size="sm"
                variant={outfit.userRating === 'LIKE' ? 'primary' : 'secondary'}
                onClick={() => onRate(1)}
              >
                <ThumbsUp size={14} />
              </Button>
              <Button
                size="sm"
                variant={outfit.userRating === 'DISLIKE' ? 'primary' : 'secondary'}
                onClick={() => onRate(-1)}
              >
                <ThumbsDown size={14} />
              </Button>
            </>
          )}
          {onDelete && (
            <Button size="sm" variant="danger" onClick={onDelete}>
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
