export default function CategoryGrid({ categories, current, onSelect }) {
  return (
    <section aria-labelledby="categories-heading" className="mt-2">
      <h3 id="categories-heading" className="sr-only">Categories</h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id === current ? null : cat.id)}
            className={`${cat.color} rounded-xl px-2 sm:px-3 py-3 sm:py-4 text-center border border-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${current === cat.id ? 'ring-2 ring-orange-500' : ''}`}
            aria-pressed={current === cat.id}
          >
            <div aria-hidden className="text-xl sm:text-2xl">{cat.emoji}</div>
            <div className="mt-1 text-[11px] sm:text-xs font-medium text-orange-900 truncate">{cat.name}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
