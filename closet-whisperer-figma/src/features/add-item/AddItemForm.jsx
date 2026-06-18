import React, { useState } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';

const SELECT_BASE =
  'w-full bg-elevated border border-border-subtle rounded-md px-5 py-3 text-base text-ink-primary outline-none focus:border-border-strong';

export default function AddItemForm({ compact = false }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Top',
    color: '',
    style: '',
    insulation: 'Light',
    status: 'Clean',
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  return (
    <form className={`flex flex-col gap-${compact ? '4' : '5'} w-full`} onSubmit={(e) => e.preventDefault()}>
      <div className="bg-cream-100 border border-dashed border-border-strong rounded-lg flex flex-col items-center justify-center gap-2 py-10 text-ink-muted">
        <Upload size={28} strokeWidth={1.5} />
        <p className="text-sm">Drop a photo or tap to upload</p>
        <button type="button" className="text-sm font-medium text-brand-accent">
          Choose file
        </button>
      </div>

      <div className="bg-white border border-border-subtle rounded-md p-4 flex items-start gap-3">
        <Sparkles size={18} className="text-brand-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-ink-primary">AI suggestions</p>
          <p className="text-xs text-ink-muted">
            We'll auto-tag type, color, and style once you upload an image.
          </p>
        </div>
      </div>

      <TextField label="Name" value={form.name} onChange={set('name')} placeholder="e.g. Cream Linen Shirt" />
      <div className={compact ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-2 gap-4'}>
        <label className="flex flex-col gap-2">
          <span className="font-medium text-sm text-ink-primary">Category</span>
          <select value={form.category} onChange={set('category')} className={SELECT_BASE}>
            {['Top', 'Bottom', 'Outerwear', 'Shoes', 'Full Body'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <TextField label="Color" value={form.color} onChange={set('color')} placeholder="Cream" />
        <TextField label="Style" value={form.style} onChange={set('style')} placeholder="Casual" />
        <label className="flex flex-col gap-2">
          <span className="font-medium text-sm text-ink-primary">Insulation</span>
          <select value={form.insulation} onChange={set('insulation')} className={SELECT_BASE}>
            {['Light', 'Medium', 'Warm'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" full>Save to closet</Button>
        <Button variant="secondary" type="reset" full>Reset</Button>
      </div>
    </form>
  );
}
