import { useEffect, useMemo, useState } from 'react';
import { Search, SearchX, AlertCircle } from 'lucide-react';
import api from '../api';
import ResourceCard from '../components/ResourceCard';

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'desk', label: 'Desks' },
  { value: 'room', label: 'Meeting rooms' },
];

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="h-12 w-12 rounded-xl bg-slate-200" />
      <div className="mt-4 h-5 w-2/3 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
      <div className="mt-5 h-10 rounded-lg bg-slate-200" />
    </div>
  );
}

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [type, setType] = useState('all');
  const [floor, setFloor] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api
      .get('/resources')
      .then(({ data }) => setResources(data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load resources'))
      .finally(() => setLoading(false));
  }, []);

  const floors = useMemo(
    () => [...new Set(resources.map((r) => r.floor))].sort((a, b) => a - b),
    [resources]
  );

  const filtered = resources.filter(
    (r) =>
      (type === 'all' || r.type === type) &&
      (floor === 'all' || r.floor === Number(floor)) &&
      r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold">Find your space</h1>
      <p className="mt-1 text-slate-500">Choose a desk or meeting room and book it in a few clicks.</p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex rounded-xl bg-slate-200/70 p-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                type === t.value ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select className="input w-auto" value={floor} onChange={(e) => setFloor(e.target.value)}>
            <option value="all">All floors</option>
            {floors.map((f) => (
              <option key={f} value={f}>Floor {f}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : filtered.map((r) => <ResourceCard key={r._id} resource={r} />)}
      </div>

      {!loading && !error && filtered.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center text-slate-500">
          <SearchX size={40} />
          <p className="mt-3 font-medium text-slate-700">No spaces found</p>
          <p className="text-sm">Try a different filter or search term.</p>
        </div>
      )}
    </div>
  );
}