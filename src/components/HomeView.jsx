import { useEffect, useMemo, useState } from 'react';
import SearchBar from './SearchBar';
import CategoryGrid from './CategoryGrid';
import StoreGrid from './StoreGrid';
import DriverMap from './DriverMap';

const defaultCategories = [
  { id: 'groceries', name: 'Groceries', color: 'bg-orange-100', emoji: '🛒' },
  { id: 'household', name: 'Household', color: 'bg-orange-50', emoji: '🧽' },
  { id: 'personal', name: 'Personal Care', color: 'bg-orange-100', emoji: '🧴' },
  { id: 'snacks', name: 'Snacks', color: 'bg-orange-50', emoji: '🍫' },
  { id: 'beverages', name: 'Beverages', color: 'bg-orange-100', emoji: '🥤' },
  { id: 'bakery', name: 'Bakery', color: 'bg-orange-50', emoji: '🥐' },
];

function useGeolocation() {
  const [pos, setPos] = useState({ lat: 28.6139, lng: 77.209, accuracy: null });
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported');
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      (e) => setError(e.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);
  return { pos, error };
}

export default function HomeView() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const { pos } = useGeolocation();

  const stores = useMemo(() => ([
    { id: 'st1', name: 'Orange Mart - Connaught', distanceKm: 1.2, etaMin: 12, stock: 124 },
    { id: 'st2', name: 'QuickBasket - Karol Bagh', distanceKm: 2.6, etaMin: 18, stock: 98 },
    { id: 'st3', name: 'FreshHouse - CP', distanceKm: 1.8, etaMin: 14, stock: 156 },
  ]), []);

  return (
    <section aria-labelledby="home-heading" className="pb-24">
      <h2 id="home-heading" className="sr-only">Home</h2>

      <div className="py-3">
        <SearchBar value={query} onChange={setQuery} onSubmit={(v) => setQuery(v)} />
      </div>

      <CategoryGrid categories={defaultCategories} current={category} onSelect={setCategory} />

      <StoreGrid
        className="mt-4"
        query={query}
        category={category}
        stores={stores}
      />

      <div className="mt-6">
        <DriverMap userPosition={pos} />
      </div>
    </section>
  );
}
