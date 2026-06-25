import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Thermometer, RefreshCcw, ChevronRight } from 'lucide-react';
import { inventoryApi, historyApi, weatherApi } from '../../api/closetApi.js';
import Metric from '../../components/ui/Metric.jsx';
import ItemTile from '../../components/ui/ItemTile.jsx';
import OutfitHero from './OutfitHero.jsx';
import WeatherCard from './WeatherCard.jsx';

function formatHistoryOutfit(h) {
  if (!h.items || h.items.length === 0) return '—';
  return h.items.map((it) => it.role || 'Item').join(', ');
}

function formatHistoryDay(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function DashboardMobile({ user, onNavigate, currentOutfit, outfitItemsMap }) {
  const [recentItems, setRecentItems] = useState([]);
  const [latelyWorn, setLatelyWorn] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [weather, setWeather] = useState(null);

  const auth = useMemo(() => {
    if (!user) return null;
    return { userSystemID: user.systemId, userEmail: user.email, userPassword: user.password };
  }, [user]);

  useEffect(() => {
    if (!auth || !user?.profileId) return;
    setItemsLoading(true);
    inventoryApi.listItems(auth, user.profileId, 0, 4, true)
      .then((res) => {
        const mapped = (res || []).map((it) => {
          let style = '';
          let image = '';
          if (it.styleTag && it.styleTag.includes('###')) {
            const parts = it.styleTag.split('###');
            style = parts[0];
            image = parts[1];
          } else if (it.styleTag) {
            style = it.styleTag;
          }
          let cat = 'Top';
          const uCat = (it.category || '').toUpperCase();
          if (uCat === 'BOTTOM') cat = 'Bottom';
          else if (uCat === 'SHOES') cat = 'Shoes';
          else if (uCat === 'OUTERWEAR') cat = 'Outerwear';
          else if (uCat === 'FULL_BODY') cat = 'Full Body';
          return {
            id: it.id?.objectId,
            name: it.subCategory || 'Clothing Item',
            category: cat,
            color: it.color || 'Neutral',
            style: style || 'Casual',
            status: it.status === 'CLEAN' || it.status === 'clean' ? 'Clean' : 'Dirty',
            image: image || null,
          };
        });
        setRecentItems(mapped);
      })
      .catch((err) => console.error('Failed to load items for dashboard', err))
      .finally(() => setItemsLoading(false));
  }, [auth, user?.profileId]);

  useEffect(() => {
    if (!auth || !user?.profileId) return;
    setHistoryLoading(true);
    historyApi.listWearHistory(auth, user.profileId, 0, 3)
      .then((res) => setLatelyWorn(res || []))
      .catch((err) => console.error('Failed to load history for dashboard', err))
      .finally(() => setHistoryLoading(false));
  }, [auth, user?.profileId]);

  useEffect(() => {
    if (!auth) return;
    const fetchWeather = (lat, lon) => {
      weatherApi.getWeather(auth, lat, lon)
        .then((data) => {
          setWeather({
            location: data.city || 'Unknown',
            temp: Math.round(data.temperature ?? 0),
            condition: data.condition || '—',
            humidity: data.humidity ?? '—',
            uvIndex: '—',
            windSpeed: Math.round((data.wind_speed ?? 0) * 3.6),
            feelsLike: Math.round(data.feelsLike ?? 0),
          });
        })
        .catch(() => setWeather(null));
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(32.0833, 34.8),
        { timeout: 5000 }
      );
    } else {
      fetchWeather(32.0833, 34.8);
    }
  }, [auth]);

  const outfitForHero = currentOutfit
    ? {
        title: currentOutfit.dateCreated
          ? new Date(currentOutfit.dateCreated).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
          : "Today's Outfit",
        items: (currentOutfit.items || [])
          .map((it) => outfitItemsMap?.[it.itemId]?.subCategory || it.role || 'Item')
          .join(', '),
        score: currentOutfit.userRating === 'LIKE' ? 'Liked' : currentOutfit.userRating === 'DISLIKE' ? 'Disliked' : null,
        reason: currentOutfit.confirmed ? 'Confirmed outfit' : 'Not yet confirmed',
      }
    : null;

  return (
    <div className="px-5 flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-ink-muted">Good morning,</p>
        <h1 className="font-display font-bold text-3xl text-ink-primary">
          {user?.name?.split(' ')[0] ?? 'Shani'}
        </h1>
      </header>

      {outfitForHero ? (
        <OutfitHero outfit={outfitForHero} />
      ) : (
        <div className="rounded-lg bg-taupe-700 text-ink-inverse p-5 flex flex-col gap-3 shadow-card">
          <p className="text-xs uppercase tracking-wide text-cream-200 opacity-80">Today's outfit</p>
          <p className="text-cream-200 text-sm">No outfit generated yet.</p>
          <button
            onClick={() => onNavigate?.('outfits')}
            className="self-start text-sm font-semibold text-cream-200 underline underline-offset-2 hover:text-white"
          >
            Generate your first outfit →
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Metric icon={Sparkles} label="Confidence" value="94%" />
        <Metric icon={Thermometer} label="Thermal" value="Cozy" />
        <Metric icon={RefreshCcw} label="Repeat risk" value="Low" />
      </div>

      {weather && <WeatherCard weather={weather} />}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-ink-primary">Recommended</h2>
          <button className="text-sm text-brand-accent flex items-center gap-1" onClick={() => onNavigate?.('closet')}>
            See all <ChevronRight size={14} />
          </button>
        </div>
        {itemsLoading && <p className="text-sm text-ink-muted">Loading items…</p>}
        <div className="grid grid-cols-2 gap-3">
          {!itemsLoading && recentItems.map((item) => (
            <ItemTile key={item.id} item={item} compact />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display font-bold text-xl text-ink-primary">Lately worn</h2>
        {historyLoading && <p className="text-sm text-ink-muted">Loading…</p>}
        {!historyLoading && latelyWorn.length === 0 && (
          <p className="text-sm text-ink-muted">No history yet.</p>
        )}
        <ul className="flex flex-col gap-2">
          {!historyLoading && latelyWorn.map((h) => (
            <li
              key={h.id?.objectId ?? h.dateCreated}
              className="bg-white border border-border-subtle rounded-md px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-ink-primary">{formatHistoryOutfit(h)}</p>
                <p className="text-xs text-ink-muted">{formatHistoryDay(h.dateCreated)}</p>
              </div>
              <span className="font-display font-bold text-base text-brand-accent">
                {h.userRating === 'LIKE' ? '👍' : h.userRating === 'DISLIKE' ? '👎' : '—'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
