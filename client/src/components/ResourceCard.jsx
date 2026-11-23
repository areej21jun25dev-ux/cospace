import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Armchair, Users, Layers, Check, MapPin } from 'lucide-react';

export default function ResourceCard({ resource }) {
  const [imgFailed, setImgFailed] = useState(false);
  const isRoom = resource.type === 'room';
  const Icon = isRoom ? Users : Armchair;
  const showImage = resource.image && !imgFailed;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-36 overflow-hidden">
        {showImage ? (
          <img
            src={resource.image}
            alt={resource.name}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
              isRoom ? 'from-violet-100 to-violet-200 text-violet-600' : 'from-emerald-100 to-emerald-200 text-emerald-700'
            }`}
          >
            <Icon size={48} />
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isRoom ? 'bg-violet-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {isRoom ? 'Meeting room' : 'Desk'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold">{resource.name}</h3>
          {resource.price > 0 && (
            <p className="whitespace-nowrap text-right font-bold text-indigo-700">
              Rs {resource.price}
              <span className="block text-xs font-normal text-slate-500">per hour</span>
            </p>
          )}
        </div>

        {resource.location && (
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={14} /> {resource.location}
          </p>
        )}

        <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1"><Layers size={14} /> Floor {resource.floor}</span>
          <span className="flex items-center gap-1">
            <Users size={14} /> {resource.capacity} {resource.capacity === 1 ? 'person' : 'people'}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {resource.amenities.map((a) => (
            <span key={a} className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
              <Check size={12} /> {a}
            </span>
          ))}
        </div>

        <Link to={`/resources/${resource._id}`} className="btn-primary mt-auto">
          Book now
        </Link>
      </div>
    </div>
  );
}