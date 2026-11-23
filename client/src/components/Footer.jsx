import { Building2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row">
        <span className="flex items-center gap-2 font-semibold text-indigo-600">
          <Building2 size={18} /> CoSpace
        </span>
        <span>Desk and meeting room booking. Built with the MERN stack.</span>
      </div>
    </footer>
  );
}