import { useState } from 'react';

const seedOrders = [
  { id: 'o1001', date: '2025-10-01', status: 'Delivered', total: 356, items: 6 },
  { id: 'o1002', date: '2025-10-10', status: 'Cancelled', total: 120, items: 2 },
  { id: 'o1003', date: '2025-10-14', status: 'Delivered', total: 560, items: 10 },
];

export default function OrderHistory() {
  const [orders] = useState(seedOrders);

  return (
    <section className="pb-24" aria-labelledby="orders-heading">
      <h2 id="orders-heading" className="text-lg sm:text-xl font-semibold text-orange-900 mt-3">Order history</h2>
      <div className="mt-3 divide-y rounded-xl border border-orange-200 overflow-hidden">
        {orders.map(o => (
          <article key={o.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">Order {o.id}</div>
              <div className="text-sm text-gray-600">{o.date} • {o.items} items</div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-semibold ${o.status === 'Delivered' ? 'text-green-600' : 'text-red-600'}`}>{o.status}</div>
              <div className="text-sm text-gray-700">₹{o.total}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
