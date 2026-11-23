import { Building2 } from 'lucide-react';

export default function AuthCard({ title, subtitle, error, children, footer }) {
  return (
    <div className="fade-up mx-auto mt-6 max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
          <Building2 size={24} />
        </div>
        <h1 className="mt-5 text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6">{children}</div>
      </div>
      <p className="mt-5 text-center text-sm text-slate-600">{footer}</p>
    </div>
  );
}