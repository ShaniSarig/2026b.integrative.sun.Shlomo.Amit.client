import React from 'react';
import AddItemForm from './AddItemForm.jsx';

export default function AddItemDesktop() {
  return (
    <div className="px-10 py-10 max-w-[1100px] mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
          Add a new garment
        </h1>
        <p className="text-base text-ink-muted">
          Upload a photo. AI tags type, color, and style — you confirm the details.
        </p>
      </header>
      <div className="bg-white border border-border-subtle rounded-lg p-8 shadow-card">
        <AddItemForm />
      </div>
    </div>
  );
}
