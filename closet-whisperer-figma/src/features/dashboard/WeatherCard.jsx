import React from 'react';
import { Cloud, Droplets, Sun, Wind } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';

export default function WeatherCard({ weather }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-muted">{weather.location}</p>
          <p className="font-display font-bold text-4xl text-ink-primary leading-tight">
            {weather.temp}°
          </p>
          <p className="text-sm text-ink-secondary mt-1">{weather.condition}</p>
        </div>
        <Cloud size={32} strokeWidth={1.5} className="text-brand-accent" />
      </div>
      <dl className="grid grid-cols-2 gap-3 mt-5">
        {[
          { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
          { icon: Sun, label: 'UV index', value: weather.uvIndex },
          { icon: Wind, label: 'Wind', value: `${weather.windSpeed} km/h` },
          { icon: Cloud, label: 'Feels like', value: `${weather.feelsLike}°` },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-cream-100"
          >
            <Icon size={16} className="text-brand-accent" />
            <div className="flex flex-col">
              <span className="text-[11px] text-ink-muted leading-none">{label}</span>
              <span className="text-sm font-medium text-ink-primary">{value}</span>
            </div>
          </div>
        ))}
      </dl>
    </Card>
  );
}
