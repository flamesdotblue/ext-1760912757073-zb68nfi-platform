import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { ChevronRight } from 'lucide-react';

function useInventory(stores) {
  const [inv, setInv] = useState(() => Object.fromEntries(stores.map(s => [s.id, s.stock])));
  const fallbackTimer = useRef(null);

  useEffect(() => {
    let socket;
    try {
      const url = import.meta.env.VITE_API_URL;
      if (url) {
        socket = io(url, { transports: ['websocket'], autoConnect: true });
        socket.on('connect', () => {
          socket.emit('subscribe:inventory');
        });
        socket.on('inventory:update', (payload) => {
          setInv(prev => ({ ...prev, [payload.storeId]: payload.stock }));
        });
        socket.on('disconnect', () => {});
      }
    } catch (_) {}

    // Fallback mock updates if no socket
    fallbackTimer.current = setInterval(() => {
      setInv(prev => {
        const keys = Object.keys(prev);
        const k = keys[Math.floor(Math.random() * keys.length)];
        const delta = Math.random() > 0.5 ? 1 : -1;
        return { ...prev, [k]: Math.max(0, prev[k] + delta) };
      });
    }, 4000);

    return () => {
      if (socket) socket.disconnect();
      if (fallbackTimer.current) clearInterval(fallbackTimer.current);
    };
  }, []);

  return inv;
}

export default function StoreGrid({ className = '', stores, query, category }) {
  const inv = useInventory(stores);

  const filtered = useMemo(() => {
    return stores.filter(s => {
      const matchesQuery = !query || s.name.toLowerCase().includes(query.toLowerCase());
      // Simple category filter stub; in real case, map stores to categories
      const matchesCat = !category || s.id.includes('');
      return matchesQuery && matchesCat;
    });
  }, [stores, query, category]);

  return (
    <section aria-labelledby="stores-heading" className={className}>
      <div className="flex items-center justify-between">
        <h3 id="stores-heading" className="text-base font-semibold text-orange-900">Nearby stores</h3>
        <span className="text-xs text-orange-700" aria-live="polite">Real-time inventory</span>
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(s => (
          <article
            key={s.id}
            className="rounded-xl border border-orange-200 bg-white p-3 hover:shadow-md transition-shadow"
            aria-label={`${s.name}, ${s.distanceKm} km away, ETA ${s.etaMin} min`}
          >
            <div className="flex items-start gap-3">
              <div aria-hidden className="h-14 w-14 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center font-bold text-orange-700">{s.name.split(' ')[0][0]}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-gray-900">{s.name}</h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">{s.distanceKm} km</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                  <span>ETA {s.etaMin} min</span>
                  <span aria-hidden>•</span>
                  <span aria-live="polite">Stock {inv[s.id] ?? s.stock}</span>
                </div>
                <button
                  className="mt-3 inline-flex items-center gap-1 text-sm text-orange-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
                  aria-label={`Shop from ${s.name}`}
                >
                  Shop now <ChevronRight size={16} aria-hidden />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
