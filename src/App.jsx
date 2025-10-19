import { useEffect, useMemo, useState } from 'react';
import { Home, ShoppingCart, Clock, User } from 'lucide-react';
import HomeView from './components/HomeView';
import CartCheckout from './components/CartCheckout';
import OrderHistory from './components/OrderHistory';
import Profile from './components/Profile';

function App() {
  const [tab, setTab] = useState('home');
  const tabs = useMemo(() => (
    [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'cart', label: 'Cart', icon: ShoppingCart },
      { id: 'orders', label: 'Orders', icon: Clock },
      { id: 'profile', label: 'Profile', icon: User },
    ]
  ), []);

  // Respect reduced motion
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      root.style.setProperty('--motion-duration', '0ms');
    } else {
      root.style.setProperty('--motion-duration', '200ms');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col" aria-label="Blinkit-like App">
      <header className="sticky top-0 z-40 bg-orange-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div aria-hidden className="w-8 h-8 rounded bg-white/20 flex items-center justify-center font-bold">B</div>
            <h1 className="text-lg font-semibold">BlinkFast</h1>
          </div>
          <div className="hidden sm:block text-sm opacity-90" aria-live="polite">Fast delivery in minutes</div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-2 sm:px-4">
        {tab === 'home' && <HomeView />}
        {tab === 'cart' && <CartCheckout />}
        {tab === 'orders' && <OrderHistory />}
        {tab === 'profile' && <Profile />}
      </main>

      <nav
        role="navigation"
        aria-label="Primary"
        className="sticky bottom-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
      >
        <ul className="grid grid-cols-4" role="tablist">
          {tabs.map(({ id, label, icon: Icon }) => (
            <li key={id} className="flex">
              <button
                role="tab"
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                onClick={() => setTab(id)}
                className={`flex-1 py-2.5 sm:py-3 flex flex-col items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${tab === id ? 'text-orange-600' : 'text-gray-600'}`}
              >
                <Icon aria-hidden size={22} />
                <span className="text-xs sm:text-sm">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default App;
