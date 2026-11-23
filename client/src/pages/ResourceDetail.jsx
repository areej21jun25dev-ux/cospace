import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft, Armchair, Users, Layers, Check, CalendarDays, Clock,
  AlertCircle, CheckCircle2, MapPin,
} from 'lucide-react';
import api from '../api';

const today = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const fmt = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const quickSlots = [
    ['09:00', '10:00'], ['10:00', '11:00'], ['11:00', '12:00'],
    ['12:00', '13:00'], ['14:00', '15:00'], ['15:00', '16:00'],
    ['16:00', '17:00'], ['09:00', '13:00'], ['14:00', '18:00'],
  ];
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [date, setDate] = useState(today());
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('11:00');
  const [booked, setBooked] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api
      .get(`/resources/${id}`)
      .then(({ data }) => setResource(data))
      .catch((err) => setLoadError(err.response?.data?.message || 'Could not load resource'))
      .finally(() => setLoading(false));
  }, [id]);

  const loadBooked = () =>
    api
      .get(`/bookings/resource/${id}`, { params: { date } })
      .then(({ data }) => setBooked(data))
      .catch(() => setBooked([]));

  useEffect(() => {
    loadBooked();
  }, [id, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (end <= start) return setError('End time must be after start time');

    setSubmitting(true);
    try {
      await api.post('/bookings', {
        resource: id,
        startTime: new Date(`${date}T${start}`).toISOString(),
        endTime: new Date(`${date}T${end}`).toISOString(),
      });
      setSuccess('Booking confirmed!');
      toast.success('Booking confirmed!');
      loadBooked();
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-2xl bg-slate-200" />;
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
          <AlertCircle size={18} /> {loadError}
        </div>
        <Link to="/resources" className="mt-4 inline-block text-indigo-600">Back to resources</Link>
      </div>
    );
  }

  const isRoom = resource.type === 'room';
  const Icon = isRoom ? Users : Armchair;

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate('/resources')}
        className="mb-4 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} /> Back to resources
      </button>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Resource info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl ${
              isRoom ? 'bg-violet-100 text-violet-600' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <Icon size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-bold">{resource.name}</h1>
          <p className="text-sm text-slate-500">{isRoom ? 'Meeting room' : 'Desk'}</p>

          {resource.location && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin size={14} /> {resource.location}
            </p>
          )}
          {resource.price > 0 && (
            <p className="mt-3 text-2xl font-bold text-indigo-700">
              Rs {resource.price}
              <span className="text-sm font-normal text-slate-500"> / hour</span>
            </p>
          )}

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2"><Layers size={16} /> Floor {resource.floor}</p>
            <p className="flex items-center gap-2">
              <Users size={16} /> {resource.capacity} {resource.capacity === 1 ? 'person' : 'people'}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {resource.amenities.map((a) => (
              <span key={a} className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                <Check size={12} /> {a}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold">Already booked on this day</h3>
            {booked.length === 0 ? (
              <p className="mt-2 text-sm text-emerald-600">Free all day</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {booked.map((b) => (
                  <li
                    key={b._id}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    <Clock size={14} /> {fmt(b.startTime)} - {fmt(b.endTime)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Booking form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-3"
        >
          <h2 className="text-lg font-semibold">Book this space</h2>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              <p className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} /> {success}
              </p>
              <Link to="/my-bookings" className="mt-1 inline-block underline">View my bookings</Link>
            </div>
          )}

          <div className="mt-4">
            <label className="mb-1 flex items-center gap-1 text-sm font-medium">
              <CalendarDays size={14} /> Date
            </label>
            <input
              type="date"
              className="input"
              min={today()}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSuccess('');
                setError('');
              }}
              required
            />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Quick slots</p>
            <div className="flex flex-wrap gap-2">
              {quickSlots.map(([s, e]) => (
                <button
                  type="button"
                  key={s + e}
                  onClick={() => { setStart(s); setEnd(e); }}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    start === s && end === e
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {s} - {e}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium">
                <Clock size={14} /> Start
              </label>
              <input type="time" className="input" value={start} onChange={(e) => setStart(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium">
                <Clock size={14} /> End
              </label>
              <input type="time" className="input" value={end} onChange={(e) => setEnd(e.target.value)} required />
            </div>
          </div>

          <button className="btn-primary mt-6 w-full" disabled={submitting}>
            {submitting ? 'Booking...' : 'Confirm booking'}
          </button>
        </form>
      </div>
    </div>
  );
}