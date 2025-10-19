import { useState } from 'react';

export default function Profile() {
  const [name, setName] = useState('Alex Customer');
  const [phone, setPhone] = useState('9999999999');
  const [addr, setAddr] = useState('221B Baker Street, Delhi');

  return (
    <section className="pb-24" aria-labelledby="profile-heading">
      <h2 id="profile-heading" className="text-lg sm:text-xl font-semibold text-orange-900 mt-3">Profile</h2>

      <form className="mt-3 grid gap-3 max-w-xl" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-orange-900">Full name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-orange-900">Phone</label>
          <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-orange-900">Address</label>
          <textarea id="address" rows={3} value={addr} onChange={(e) => setAddr(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold focus-visible:ring-2 focus-visible:ring-white/70">Save</button>
          <button type="button" className="px-4 py-2 rounded-lg border border-orange-200">Logout</button>
        </div>
      </form>

      <div className="mt-6 p-3 rounded-xl border border-orange-200 bg-orange-50">
        <h3 className="font-semibold text-orange-900">Accessibility</h3>
        <p className="text-sm text-gray-700 mt-1">This app supports keyboard navigation, ARIA roles, sufficient contrast, and reduced motion preferences to align with WCAG 2.1 AA.</p>
      </div>
    </section>
  );
}
