import { useEffect, useMemo, useState } from 'react';
import { CreditCard, Bell } from 'lucide-react';

const slots = [
  'Now (15-25 min)',
  'Today 6-7 PM',
  'Today 7-8 PM',
  'Tomorrow 9-10 AM',
];

const initialItems = [
  { id: 'p1', name: 'Bread', price: 40, qty: 1 },
  { id: 'p2', name: 'Milk 1L', price: 56, qty: 2 },
];

export default function CartCheckout() {
  const [items, setItems] = useState(initialItems);
  const [slot, setSlot] = useState(slots[0]);
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  function inc(id, d) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + d) } : i).filter(i => i.qty > 0));
  }

  async function requestNotify() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') return;
    await Notification.requestPermission();
  }

  function notify(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body });
  }

  function oneClickPay() {
    // Simulate instant payment
    notify('Payment successful', 'Your order has been placed.');
    // Simulate status updates
    setTimeout(() => notify('Order confirmed', 'Your order is being prepared.'), 2000);
    setTimeout(() => notify('Out for delivery', 'Track your driver live in the app.'), 6000);
  }

  useEffect(() => {
    // Announce total updates for screen readers
    const region = document.getElementById('cart-live');
    if (region) region.textContent = `Total ${total} rupees`;
  }, [total]);

  return (
    <section className="pb-24" aria-labelledby="cart-heading">
      <h2 id="cart-heading" className="text-lg sm:text-xl font-semibold text-orange-900 mt-3">Your cart</h2>

      <div id="cart-live" aria-live="polite" className="sr-only" />

      <div className="mt-3 divide-y divide-orange-100 rounded-xl border border-orange-200 overflow-hidden">
        {items.map(i => (
          <div key={i.id} className="flex items-center justify-between p-3">
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-sm text-gray-600">₹{i.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label={`Decrease ${i.name}`}
                onClick={() => inc(i.id, -1)}
                className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 text-orange-700"
              >-</button>
              <span aria-live="polite" className="w-6 text-center">{i.qty}</span>
              <button
                aria-label={`Increase ${i.name}`}
                onClick={() => inc(i.id, 1)}
                className="w-8 h-8 rounded-full bg-orange-500 text-white"
              >+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-xl border border-orange-200 bg-orange-50">
        <label htmlFor="slot" className="block text-sm font-medium text-orange-900">Delivery slot</label>
        <select
          id="slot"
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          className="mt-2 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {slots.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Payable</div>
          <div className="text-2xl font-bold text-orange-700">₹{total}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={requestNotify}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-orange-200 text-orange-700 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Enable notifications"
            title="Enable notifications"
          >
            <Bell size={16} />
            Notify me
          </button>
          <button
            onClick={oneClickPay}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="One-click pay"
          >
            <CreditCard size={18} />
            Pay now
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-600">We support one-click payment via saved UPI cards and wallets.</p>
    </section>
  );
}
