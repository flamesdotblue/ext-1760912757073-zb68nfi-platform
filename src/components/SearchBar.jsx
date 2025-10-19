import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

const SUGGESTIONS = [
  'Milk', 'Bread', 'Eggs', 'Banana', 'Onion', 'Tomato', 'Toothpaste', 'Shampoo', 'Detergent', 'Chips', 'Cola', 'Cookies', 'Handwash', 'Soap', 'Rice', 'Wheat flour', 'Ghee', 'Butter', 'Yogurt', 'Paneer'
];

export default function SearchBar({ value, onChange, onSubmit }) {
  const inputId = useId();
  const listId = useId();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const predictions = useMemo(() => {
    if (!value) return SUGGESTIONS.slice(0, 6);
    const v = value.toLowerCase();
    return SUGGESTIONS.filter(s => s.toLowerCase().includes(v)).slice(0, 6);
  }, [value]);

  useEffect(() => {
    setOpen(predictions.length > 0 && (value?.length ?? 0) >= 0);
  }, [predictions, value]);

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, predictions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        const pick = predictions[activeIndex];
        onChange(pick);
        onSubmit?.(pick);
        setOpen(false);
      } else {
        onSubmit?.(value);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="relative" role="search">
      <label htmlFor={inputId} className="sr-only">Search products</label>
      <div className="flex items-center gap-2 rounded-xl bg-orange-50 ring-1 ring-orange-200 focus-within:ring-2 focus-within:ring-orange-400 px-3 py-2">
        <Search aria-hidden className="text-orange-600" size={18} />
        <input
          id={inputId}
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder="Search for items..."
          className="flex-1 bg-transparent outline-none placeholder:text-orange-400"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); setActiveIndex(-1); inputRef.current?.focus(); }}
            className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && predictions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 mt-1 max-h-64 overflow-auto rounded-xl border border-orange-200 bg-white shadow-lg"
        >
          {predictions.map((s, idx) => (
            <li key={s} role="option" aria-selected={idx === activeIndex}>
              <button
                type="button"
                className={`w-full text-left px-3 py-2 hover:bg-orange-50 focus:bg-orange-50 ${idx === activeIndex ? 'bg-orange-50' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => { onChange(s); onSubmit?.(s); setOpen(false); }}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
