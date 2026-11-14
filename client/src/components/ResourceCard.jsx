import { Link } from 'react-router-dom';
import { Armchair, Users, Layers, Check } from 'lucide-react';

export default function ResourceCard({ resource }) {
  const isRoom = resource.type === 'room';
  const Icon = isRoom ? Users : Armchair;

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            isRoom ? 'bg-violet-100 text-violet-600' : 'bg-emerald-100 text-emerald-600'
          }`}
        >
          <Icon size={24} />
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isRoom ? 'bg-violet-50 text-violet-700' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {isRoom ? 'Meeting room' : 'Desk'}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold">{resource.name}</h3>

      <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-1"><Layers size={14} /> Floor {resource.floor}</span>
        <span className="flex items-center gap-1"><Users size={14} /> {resource.capacity} {resource.capacity === 1 ? 'person' : 'people'}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {resource.amenities.map((a) => (
          <span key={a} className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
            <Check size={12} /> {a}
          </span>
        ))}
      </div>

      <Link to={`/resources/${resource._id}`} className="btn-primary mt-5">
        Book now
      </Link>
    </div>
  );
}