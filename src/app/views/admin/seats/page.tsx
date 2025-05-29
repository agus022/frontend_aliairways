'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getSession } from 'next-auth/react';

export default function SeatsPage() {
  const [seats, setSeats] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm());
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editing, setEditing] = useState({ aircraft_id: null, seat_id: null });
  

  function initialForm() {
    return {
      aircraft_id: '',
      seat_id: '',
      type: 'economy',
      position: '',
      cost: '',
      available: true,
    };
  }

  const fetchSeats = async () => {
    const session = await getSession();
    const token = session?.accessToken;
    const res = await fetch('http://localhost:3000/api/v1/seats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSeats(data);
  };

  const fetchAircrafts = async () => {
    const session = await getSession();
    const token = session?.accessToken;
    const res = await fetch('http://localhost:3000/api/v1/aircrafts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAircrafts(data);
  };


  useEffect(() => {
        const fetchData = async () => {
    const session = await getSession();
    const headers = { Authorization: `Bearer ${session?.accessToken}` };

    const [seatRes, aircraftRes] = await Promise.all([
      fetch('http://localhost:3000/api/v1/seats', { headers }),
      fetch('http://localhost:3000/api/v1/aircrafts', { headers }),
    ]);

    const seatData = await seatRes.json();
    const aircraftData = await aircraftRes.json();

    setSeats(seatData);
    setAircrafts(aircraftData);
  };
    fetchSeats();
    fetchAircrafts();
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const session = await getSession();
    const token = session?.accessToken;

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode
      ? `http://localhost:3000/api/v1/seats/${editing.aircraft_id}/${editing.seat_id}`
      : 'http://localhost:3000/api/v1/seats';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm(initialForm());
    setEditMode(false);
    setShowModal(false);
    fetchSeats();
  };

  const handleEdit = (seat) => {
    setForm({
      aircraft_id: seat.aircraft_id,
      seat_id: seat.seat_id,
      type: seat.class,
      position: seat.position,
      cost: seat.cost,
      available: seat.available,
    });
    setEditing({ aircraft_id: seat.aircraft_id, seat_id: seat.seat_id });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (aircraft_id, seat_id) => {
    const session = await getSession();
    const token = session?.accessToken;
    await fetch(`http://localhost:3000/api/v1/seats/${aircraft_id}/${seat_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSeats();
  };

  const filtered = seats.filter((s) =>
    s.seat_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAircraftModel = (id) =>
  aircrafts.find((a) => a.aircraft_id === parseInt(id))?.model || '';

  return (
    <section className="pt-24 pb-10">
      <div className="container">
        <div className="flex justify-between mb-6 px-4">
          <h2 className="text-2xl font-bold">Asientos</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded"
            placeholder="Buscar asiento..."
          />
          <button onClick={() => { setForm(initialForm()); setEditMode(false); setShowModal(true); }} className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2">
            <FaPlus /> Nuevo Asiento
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded shadow mx-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">Avión</th>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Clase</th>
                <th className="px-6 py-3">Posición</th>
                <th className="px-6 py-3">Costo</th>
                <th className="px-6 py-3">Disponible</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={`${s.aircraft_id}-${s.seat_id}`}>
                  <td className="px-6 py-2">{getAircraftModel(s.aircraft_id)}</td>
                  <td className="px-6 py-2">{s.seat_id}</td>
                  <td className="px-6 py-2">{s.class}</td>
                  <td className="px-6 py-2">{s.position}</td>
                  <td className="px-6 py-2">${s.cost}</td>
                  <td className="px-6 py-2">{s.available ? 'Sí' : 'No'}</td>
                  <td className="px-6 py-2 flex gap-2">
                    <button className="text-yellow-500" onClick={() => handleEdit(s)}><FaEdit /></button>
                    <button className="text-red-500" onClick={() => handleDelete(s.aircraft_id, s.seat_id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded max-w-md w-full relative">
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">✕</button>
              <h3 className="text-lg font-semibold mb-4">{editMode ? 'Editar' : 'Nuevo'} Asiento</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <select
                  value={form.aircraft_id}
                  onChange={(e) => setForm({ ...form, aircraft_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">Selecciona un avión</option>
                  {aircrafts.map(a => <option key={a.aircraft_id} value={a.aircraft_id}>{a.model}</option>)}
                </select>
                <input type="text" placeholder="ID del asiento" value={form.seat_id} onChange={(e) => setForm({ ...form, seat_id: e.target.value })} required className="w-full px-4 py-2 border rounded" disabled={editMode} />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="economy">Económica</option>
                  <option value="first">Primera</option>
                  <option value="premium">Premium</option>
                </select>
                <select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full px-4 py-2 border rounded"
                required
                >
                <option value="">Selecciona una posición</option>
                <option value="window">Ventana</option>
                <option value="aisle">Aislado</option>
                <option value="middle">Pasillo</option>
                </select>
                <input type="number" placeholder="Costo" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} required className="w-full px-4 py-2 border rounded" />
                <label className="flex items-center">
                  <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="mr-2" /> Disponible
                </label>
                <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded">{editMode ? 'Actualizar' : 'Guardar'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
