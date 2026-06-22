import React, { useState, useRef, useCallback } from 'react';
import { Upload, Sparkles, X, Loader2, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import { inventoryApi } from '../../api/closetApi.js';

const SELECT_BASE =
  'w-full bg-elevated border border-border-subtle rounded-md px-5 py-3 text-base text-ink-primary outline-none focus:border-border-strong';

const EMPTY_FORM = {
  name: '',
  category: 'Top',
  color: '',
  style: '',
  insulation: 'Light',
  status: 'Clean',
};

const CAT_FROM_API = {
  TOP: 'Top',
  BOTTOM: 'Bottom',
  OUTERWEAR: 'Outerwear',
  SHOES: 'Shoes',
  FULL_BODY: 'Full Body',
};

const CAT_TO_API = {
  Top: 'TOP',
  Bottom: 'BOTTOM',
  Outerwear: 'OUTERWEAR',
  Shoes: 'SHOES',
  'Full Body': 'FULL_BODY',
};

const INS_MAP = { Light: 1, Medium: 2, Warm: 3 };
const INS_FROM_API = { 1: 'Light', 2: 'Medium', 3: 'Warm' };

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function stripPrefix(dataUrl) {
  return dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
}

export default function AddItemForm({ user, onNavigate, compact = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiTags, setAiTags] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const dataUrl = await fileToBase64(file);
    setImageDataUrl(dataUrl);
    setAiTags(null);

    if (!user?.systemId || !user?.email || !user?.password) return;

    setAnalyzing(true);
    try {
      const auth = {
        userSystemID: user.systemId,
        userEmail: user.email,
        userPassword: user.password,
      };
      const tags = await inventoryApi.analyzeImage(auth, stripPrefix(dataUrl));
      setAiTags(tags);

      const styleValue = tags.styleTag || tags.style || null;
      const insulationValue = tags.thermalInsulation != null ? INS_FROM_API[tags.thermalInsulation] : null;
      setForm((f) => ({
        ...f,
        ...(tags.subCategory ? { name: tags.subCategory } : {}),
        ...(tags.category && CAT_FROM_API[tags.category.toUpperCase()]
          ? { category: CAT_FROM_API[tags.category.toUpperCase()] }
          : {}),
        ...(tags.color ? { color: tags.color } : {}),
        ...(styleValue ? { style: styleValue } : {}),
        ...(insulationValue ? { insulation: insulationValue } : {}),
      }));
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        setError('Session expired — please sign out and log back in.');
      }
      // any other error (network, Vision API): silently ignore, user fills manually
    } finally {
      setAnalyzing(false);
    }
  }, [user]);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setImageDataUrl(null);
    setAiTags(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.profileId) {
      setError('User profile not loaded. Please try refreshing or logging in again.');
      return;
    }
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }

    setSaving(true);
    setError(null);

    const auth = {
      userSystemID: user.systemId,
      userEmail: user.email,
      userPassword: user.password,
    };

    const styleBase = form.style.trim() || 'Casual';
    const payload = {
      category: CAT_TO_API[form.category] ?? 'TOP',
      subCategory: form.name.trim(),
      color: form.color.trim() || 'Neutral',
      styleTag: imageDataUrl ? `${styleBase}###${imageDataUrl}` : styleBase,
      thermalInsulation: INS_MAP[form.insulation] ?? 1,
      ownerProfileId: user.profileId,
      status: form.status.toLowerCase(),
      active: true,
    };

    try {
      await inventoryApi.createItem(auth, payload);
      handleReset();
      onNavigate?.('closet');
    } catch (err) {
      console.error('Failed to save item', err);
      setError(err?.payload?.message || err?.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const aiStatus = analyzing
    ? { icon: <Loader2 size={18} className="text-brand-accent shrink-0 mt-0.5 animate-spin" />, text: 'Analyzing image…' }
    : aiTags && Object.keys(aiTags).length > 0
    ? { icon: <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />, text: 'AI filled in the details — review and edit below.' }
    : imageDataUrl
    ? { icon: <Sparkles size={18} className="text-brand-accent shrink-0 mt-0.5" />, text: 'AI could not detect details — fill in manually.' }
    : { icon: <Sparkles size={18} className="text-brand-accent shrink-0 mt-0.5" />, text: "Upload a photo and we'll auto-tag type, color, and style." };

  return (
    <form className={`flex flex-col gap-${compact ? '4' : '5'} w-full`} onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Upload zone */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />
      {imageDataUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-border-subtle">
          <img
            src={imageDataUrl}
            alt="Uploaded garment"
            className="w-full object-cover max-h-64"
          />
          {analyzing && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Loader2 size={36} className="text-white animate-spin" />
            </div>
          )}
          <button
            type="button"
            onClick={() => { setImageDataUrl(null); setAiTags(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
            className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-ink-muted hover:text-ink-primary"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`bg-cream-100 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 py-10 text-ink-muted cursor-pointer transition-colors ${dragging ? 'border-brand-accent bg-cream-200' : 'border-border-strong hover:border-brand-accent'}`}
        >
          <Upload size={28} strokeWidth={1.5} />
          <p className="text-sm">Drop a photo or click to upload</p>
          <span className="text-sm font-medium text-brand-accent">Choose file</span>
        </div>
      )}

      <div className="bg-white border border-border-subtle rounded-md p-4 flex items-start gap-3">
        {aiStatus.icon}
        <div>
          <p className="text-sm font-medium text-ink-primary">AI suggestions</p>
          <p className="text-xs text-ink-muted">{aiStatus.text}</p>
        </div>
      </div>

      <TextField label="Name" value={form.name} onChange={set('name')} placeholder="e.g. Cream Linen Shirt" required />
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
        <Button type="submit" full disabled={saving || analyzing}>{saving ? 'Saving…' : 'Save to closet'}</Button>
        <Button variant="secondary" type="button" full disabled={saving || analyzing} onClick={handleReset}>Reset</Button>
      </div>
    </form>
  );
}
