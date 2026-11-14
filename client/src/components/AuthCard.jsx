import { Building2 } from 'lucide-react';

export default function AuthCard({ title, subtitle, error, children, footer }) {
  return (
    <div className="mx-auto mt-8 max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Building2 size={24} />
        </div>
        <h1 className="mt-5 text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-5">{children}</div>
      </div>
      <p className="mt-4 text-center text-sm text-slate-600">{footer}</p>
    </div>
  );
}