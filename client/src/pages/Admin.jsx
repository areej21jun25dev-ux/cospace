import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import api from '../api';
import { useToast } from '../context/ToastContext';

const emptyForm = {
  name: '', type: 'desk', floor: 1, capacity: 1, amenities: '',
  location: '', price: 0, image: '',
};

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Admin() {
  const toast = useToast();
  const [tab, setTab] = useState('resources');
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toDelete, setToDelete] = useState(null);

  const loadAll = async () => {
    try {
      const [r, b] = await Promise.all([api.get('/resources'), api.get('/bookings')]);
      setResources(r.data);
      setBookings(b.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      name: r.name,
      type: r.type,
      floor: r.floor,
      capacity: r.capacity,
      amenities: r.amenities.join(', '),
      location: r.location || '',
      price: r.price || 0,
      image: r.image || '',
    });
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    const payload = {
      name: form.name,
      type: form.type,
      floor: Number(form.floor),
      capacity: Number(form.capacity),
      amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      location: form.location,
      price: Number(form.price),
      image: form.image,
    };
    try {
      if (editing) await api.put(`/resources/${editing._id}`, payload);
      else await api.post('/resources', payload);
      const msg = editing ? 'Resource updated.' : 'Resource added.';
      setNotice(msg);
      toast.success(msg);
      setFormOpen(false);
      await loadAll();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/resources/${toDelete._id}`);
      setNotice('Resource removed.');
      toast.success('Resource removed.');
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete');
    } finally {
      setToDelete(null);
    }
  };

  const cancelBooking = async (b) => {
    try {
      await api.delete(`/bookings/${b._id}`);
      setNotice('Booking cancelled.');
      toast.success('Booking cancelled.');
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel');
    }
  };

  const stats = [
    { label: 'Resources', value: resources.length },
    { label: 'Total bookings', value: bookings.length },
    { label: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Admin dashboard</h1>
      <p className="mt-1 text-slate-500">Manage spaces and see every booking.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-indigo-600">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="inline-flex rounded-xl bg-slate-200/70 p-1">
          {['resources', 'bookings'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                tab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === 'resources' && (
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> Add resource
          </button>
        )}
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

      {loading ? (
        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-slate-200" />
      ) : tab === 'resources' ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Floor</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Price/hr</th>
                <th className="px-4 py-3">Amenities</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 capitalize">{r.type}</td>
                  <td className="px-4 py-3">{r.location || '-'}</td>
                  <td className="px-4 py-3">{r.floor}</td>
                  <td className="px-4 py-3">{r.capacity}</td>
                  <td className="px-4 py-3">{r.price ? `Rs ${r.price}` : '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{r.amenities.join(', ')}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(r)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setToDelete(r)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {resources.length === 0 && (
                <tr><td colSpan="8" className="px-4 py-8 text-center text-slate-500">No resources yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.user?.name || 'Deleted user'}</p>
                    <p className="text-xs text-slate-500">{b.user?.email}</p>
                  </td>
                  <td className="px-4 py-3">{b.resource?.name || 'Removed'}</td>
                  <td className="px-4 py-3">{fmtDate(b.startTime)}</td>
                  <td className="px-4 py-3">{fmtTime(b.startTime)} - {fmtTime(b.endTime)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {b.status === 'confirmed' && (
                      <button onClick={() => cancelBooking(b)} className="text-sm font-medium text-red-600 hover:underline">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit modal */}
      {formOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <form onSubmit={handleSave} className="my-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">{editing ? 'Edit resource' : 'Add resource'}</h3>
            {formError && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input className="input" value={form.name} onChange={set('name')} required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Type</label>
                  <select className="input" value={form.type} onChange={set('type')}>
                    <option value="desk">Desk</option>
                    <option value="room">Room</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Floor</label>
                  <input type="number" min="0" className="input" value={form.floor} onChange={set('floor')} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Capacity</label>
                  <input type="number" min="1" className="input" value={form.capacity} onChange={set('capacity')} required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Amenities (comma separated)</label>
                <input className="input" placeholder="projector, whiteboard" value={form.amenities} onChange={set('amenities')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Location</label>
                  <input className="input" placeholder="Gulberg Branch" value={form.location} onChange={set('location')} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Price per hour (Rs)</label>
                  <input type="number" min="0" className="input" value={form.price} onChange={set('price')} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Image URL (optional)</label>
                <input className="input" placeholder="https://..." value={form.image} onChange={set('image')} />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100">
                Close
              </button>
              <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirm */}
      {toDelete && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Remove {toDelete.name}?</h3>
            <p className="mt-2 text-sm text-slate-600">It will no longer appear for booking. Past bookings stay in history.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setToDelete(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100">
                Keep it
              </button>
              <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                Yes, remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}