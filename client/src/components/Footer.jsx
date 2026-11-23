import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-16 bg-indigo-900 text-indigo-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
                    <Logo light />
          <p className="mt-3 text-sm text-indigo-200">
            Book desks and meeting rooms in seconds. Built with the MERN stack.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Quick links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/resources" className="hover:text-white">Resources</Link></li>
            <li><Link to="/my-bookings" className="hover:text-white">My Bookings</Link></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone size={16} /> 0300 0000000</li>
            <li className="flex items-center gap-2"><Mail size={16} /> hello@cospace.example</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> Lahore, Pakistan</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-indigo-300">
        &copy; {new Date().getFullYear()} CoSpace. All rights reserved.
      </div>
    </footer>
  );
}