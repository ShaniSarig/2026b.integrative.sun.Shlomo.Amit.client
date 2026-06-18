import React from 'react';
import AddItemForm from './AddItemForm.jsx';

export default function AddItemMobile() {
  return (
    <div className="px-5 flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-3xl text-ink-primary">Add item</h1>
        <p className="text-sm text-ink-muted">Upload a photo and let AI fill the rest.</p>
      </header>
      <AddItemForm compact />
    </div>
  );
}
