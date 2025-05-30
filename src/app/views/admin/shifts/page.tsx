'use client';

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState(null);
  const [form, setForm] = useState({
    start_time: '',
    end_time: '',
    shift_desc: '',
  });

  const fetchShifts = async () => {
    const session = await getSession();
    const token = session?.accessToken;
    const url = searchTerm
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/shifts/${searchTerm}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/shifts`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setShifts(data);
  };

  useEffect(() => {
    fetchShifts();
  }, [searchTerm]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const session = await getSession();
    const token = session?.accessToken;

    const method = editMode ? 'PUT' : 'POST';
    const endpoint = editMode
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/shifts/${editingShiftId}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/shifts`;

    await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setShowModal(false);
    setForm({ start_time: '', end_time: '', shift_desc: '' });
    setEditMode(false);
    setEditingShiftId(null);
    fetchShifts();
  };

  const handleEdit = (shift) => {
    setEditMode(true);
    setShowModal(true);
    setEditingShiftId(shift.shift_id);
    setForm({
      start_time: shift.start_time,
      end_time: shift.end_time,
      shift_desc: shift.shift_desc,
    });
  };

  const handleDelete = async (id) => {
    const session = await getSession();
    const token = session?.accessToken;

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/shifts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchShifts();
  };

  return (
    <section className="relative z-10 overflow-hidden pt-24 pb-10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Horarios</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar horario por descripcion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
            />
            <button
              onClick={() => {
                setShowModal(true);
                setEditMode(false);
                setForm({ start_time: '', end_time: '', shift_desc: '' });
              }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xs hover:bg-primary/90 transition w-full sm:w-auto"
            >
              <FaPlus />
              Crear nuevo horario
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded shadow-three bg-white dark:bg-[#2C303B] mx-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-[#1F2937]">
              <tr>
                {['ID', 'Hora inicio', 'Hora fin', 'Descripción', 'Acciones'].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {shifts.map((shift) => (
                <tr key={shift.shift_id}>
                  <td className="px-6 py-4 text-body-color dark:text-white">{shift.shift_id}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{shift.start_time}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{shift.end_time}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{shift.shift_desc}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(shift)} className="text-yellow-500 hover:text-yellow-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(shift.shift_id)} className="text-red-500 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {shifts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No se encontraron horarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="relative w-full max-w-md rounded-sm bg-white dark:bg-[#2C303B] p-6 shadow-three">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                  {editMode ? 'Actualizar horario' : 'Crear nuevo horario'}
                </h2>

                <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-white mb-1">Hora de inicio</label>
                    <input
                      type="time"
                      value={form.start_time}
                      onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-white mb-1">Hora de fin</label>
                    <input
                      type="time"
                      value={form.end_time}
                      onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-white mb-1">Descripción</label>
                    <input
                      type="text"
                      value={form.shift_desc}
                      onChange={(e) => setForm({ ...form, shift_desc: e.target.value })}
                      placeholder="Ej. Mañana"
                      maxLength={20}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="text-right pt-2">
                    <button
                      type="submit"
                      className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition"
                    >
                      {editMode ? 'Actualizar' : 'Guardar horario'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
