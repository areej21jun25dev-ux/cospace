import { Link } from 'react-router-dom';
import {
  CalendarCheck, Armchair, Users, ShieldCheck, Search,
  MousePointerClick, ArrowRight, Clock, Check, Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: Armchair, title: 'Book a desk', text: 'Pick a quiet desk for the day on any floor.', color: 'bg-emerald-100 text-emerald-700' },
  { icon: Users, title: 'Meeting rooms', text: 'Find rooms by capacity and amenities.', color: 'bg-violet-100 text-violet-600' },
  { icon: ShieldCheck, title: 'No double booking', text: 'Live availability so slots never clash.', color: 'bg-indigo-100 text-indigo-700' },
];

const steps = [
  { icon: Search, title: 'Find a space', text: 'Filter by desk, room, floor or name.' },
  { icon: CalendarCheck, title: 'Pick date and time', text: 'See what is already booked that day.' },
  { icon: MousePointerClick, title: 'Confirm', text: 'Done. Manage it anytime in My Bookings.' },
];

const stats = [
  { value: '8+', label: 'Spaces' },
  { value: '3', label: 'Floors' },
  { value: '0', label: 'Double bookings' },
  { value: '24/7', label: 'Booking access' },
];

export default function Home() {
  const { user } = useAuth();
  const cta = user ? '/resources' : '/register';

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-600 px-6 py-14 text-white md:px-12 md:py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <Zap size={14} className="text-violet-300" /> Desk and meeting room booking
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              Your next great day starts with the{' '}
              <span className="text-violet-300">right desk</span>
            </h1>
            <p className="mt-4 max-w-md text-indigo-100">
              CoSpace helps your team reserve desks and meeting rooms in seconds, without the back and forth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={cta}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-600"
              >
                {user ? 'Browse spaces' : 'Get started free'} <ArrowRight size={18} />
              </Link>
              {!user && (
                <Link to="/login" className="rounded-lg border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mock booking card */}
          <div className="float mx-auto w-full max-w-sm">
            <div className="rounded-2xl bg-white p-5 text-slate-800 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Users size={22} />
                  </div>
                  <div>
                    <p className="font-semibold">Meeting Room Beta</p>
                    <p className="text-xs text-slate-500">Floor 2, 10 people</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Available</span>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
                <Clock size={16} /> Today, 10:00 - 11:00
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['projector', 'video call', 'whiteboard'].map((a) => (
                  <span key={a} className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    <Check size={12} /> {a}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white">
                Confirm booking
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-indigo-100 bg-white p-5 text-center">
            <p className="font-display text-3xl font-bold text-indigo-700">{s.value}</p>
            <p className="mt-1 text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="mt-14 grid gap-5 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text, color }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
              <Icon size={24} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <Icon size={26} />
              </div>
              <p className="mt-4 text-xs font-bold tracking-widest text-violet-600">STEP {i + 1}</p>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-3xl bg-gradient-to-r from-violet-500 to-violet-600 px-6 py-12 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to find your space?</h2>
        <p className="mt-2 text-violet-100">Book a desk or room in under a minute.</p>
        <Link
          to={cta}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-violet-700 transition hover:bg-violet-50"
        >
          {user ? 'Browse spaces' : 'Create free account'} <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}