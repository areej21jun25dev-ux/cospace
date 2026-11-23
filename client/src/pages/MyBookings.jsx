import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Clock, Layers, AlertCircle, CheckCircle2, CalendarX, X,
} from 'lucide-react';
import api from '../api';
import { useToast } from '../context/ToastContext';

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function Skeleton() {
  return <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />;
}

function BookingCard({ booking, onCancel, past }) {
  const cancelled = booking.status === 'cancelled';
  const r = booking.resource;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{r ? r.name : 'Removed resource'}</h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              cancelled
                ? 'bg-red-50 text-red-700'
                : past
                ? 'bg-slate-100 text-slate-600'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {cancelled ? 'Cancelled' : past ? 'Completed' : 'Confirmed'}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
          <span className="flex items-center gap-1"><CalendarDays size={14} /> {fmtDate(booking.startTime)}</span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {fmtTime(booking.startTime)} - {fmtTime(booking.endTime)}
          </span>
          {r && <span className="flex items-center gap-1"><Layers size={14} /> Floor {r.floor}</span>}
        </div>
      </div>

      {!cancelled && !past && (
        <button
          onClick={() => onCancel(booking)}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

export default function MyBookings() {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [tab, setTab] = useState('upcoming');
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = () =>
    api
      .get('/bookings/me')
      .then(({ data }) => setBookings(data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load bookings'))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const now = new Date();
  const isPast = (b) => new Date(b.endTime) < now;

  const upcoming = bookings
    .filter((b) => !isPast(b) && b.status === 'confirmed')
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const history = bookings.filter((b) => isPast(b) || b.status === 'cancelled');

  const list = tab === 'upcoming' ? upcoming : history;

  const confirmCancel = async () => {
    setCancelling(true);
    setError('');
    try {
      await api.delete(`/bookings/${toCancel._id}`);
      setNotice('Booking cancelled.');
      toast.success('Booking cancelled');
      setToCancel(null);
      await load();
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not cancel booking';
      setError(msg);
      toast.error(msg);
      setToCancel(null);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">My bookings</h1>
      <p className="mt-1 text-slate-500">See your upcoming reservations and past history.</p>

      <div className="mt-6 inline-flex rounded-xl bg-slate-200/70 p-1">
        {[
          { v: 'upcoming', label: `Upcoming (${upcoming.length})` },
          { v: 'history', label: `History (${history.length})` },
        ].map((t) => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.v ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
          <span className="flex items-center gap-2"><CheckCircle2 size={16} /> {notice}</span>
          <button onClick={() => setNotice('')}><X size={16} /></button>
        </div>
      )}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)
          : list.map((b) => (
              <BookingCard key={b._id} booking={b} past={isPast(b)} onCancel={setToCancel} />
            ))}
      </div>

      {!loading && list.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center text-slate-500">
          <CalendarX size={40} />
          <p className="mt-3 font-medium text-slate-700">
            {tab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings yet'}
          </p>
          {tab === 'upcoming' && (
            <Link to="/resources" className="btn-primary mt-4">Book a space</Link>
          )}
        </div>
      )}

      {toCancel && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Cancel this booking?</h3>
            <p className="mt-2 text-sm text-slate-600">
              {toCancel.resource?.name}, {fmtDate(toCancel.startTime)},{' '}
              {fmtTime(toCancel.startTime)} - {fmtTime(toCancel.endTime)}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setToCancel(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Keep it
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelling}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {cancelling ? 'Cancelling...' : 'Yes, cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}