'use client';

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function AircraftsPage() {
  const [aircrafts, setAircrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingAircraftId, setEditingAircraftId] = useState(null);
  const [form, setForm] = useState({
    model: '',
    capacity: '',
  });

  const fetchAircrafts = async () => {
    const session = await getSession();
    const token = session?.accessToken;
    const url = searchTerm
      ? `http://localhost:3000/api/v1/aircrafts/search/${searchTerm}`
      : 'http://localhost:3000/api/v1/aircrafts';

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAircrafts(data);
  };

  useEffect(() => {
    fetchAircrafts();
  }, [searchTerm]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const session = await getSession();
    const token = session?.accessToken;

    const method = editMode ? 'PUT' : 'POST';
    const endpoint = editMode
      ? `http://localhost:3000/api/v1/aircrafts/${editingAircraftId}`
      : 'http://localhost:3000/api/v1/aircrafts';

    await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: form.model,
        capacity: parseInt(form.capacity),
      }),
    });

    setShowModal(false);
    setForm({ model: '', capacity: '' });
    setEditMode(false);
    setEditingAircraftId(null);
    fetchAircrafts();
  };

  const handleEdit = (aircraft) => {
    setEditMode(true);
    setShowModal(true);
    setEditingAircraftId(aircraft.aircraft_id);
    setForm({
      model: aircraft.model,
      capacity: aircraft.capacity.toString(),
    });
  };

  const handleDelete = async (id) => {
    const session = await getSession();
    const token = session?.accessToken;

    await fetch(`http://localhost:3000/api/v1/aircrafts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchAircrafts();
  };

  //sistema de paginacion 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(aircrafts.length / itemsPerPage));
  const currentAircrafts = aircrafts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pt-24 pb-10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Aeronaves</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
            />
            <button
              onClick={() => {
                setShowModal(true);
                setEditMode(false);
                setForm({ model: '', capacity: '' });
              }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xs hover:bg-primary/90 transition w-full sm:w-auto"
            >
              <FaPlus />
              Crear nueva aeronave
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded shadow-three bg-white dark:bg-[#2C303B] mx-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-[#1F2937]">
              <tr>
                {['ID', 'Modelo', 'Capacidad', 'Acciones'].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentAircrafts.map((aircraft) => (
                  <tr key={aircraft.aircraft_id}>
                    <td className="px-6 py-4 text-body-color dark:text-white">{aircraft.aircraft_id}</td>
                    <td className="px-6 py-4 text-body-color dark:text-white">{aircraft.model}</td>
                    <td className="px-6 py-4 text-body-color dark:text-white">{aircraft.capacity}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(aircraft)} className="text-yellow-500 hover:text-yellow-600">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(aircraft.aircraft_id)} className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentAircrafts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 dark:text-gray-400 py-6">
                      No se encontraron aeronaves.
                    </td>
                  </tr>
                )}
              </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 px-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xs bg-gray-200 dark:bg-[#1F2937] text-sm font-medium disabled:opacity-50"
            >
              ← Anterior
            </button>
            <p className="text-sm text-body-color dark:text-white">
              Página {currentPage} de {totalPages}
            </p>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xs bg-gray-200 dark:bg-[#1F2937] text-sm font-medium disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
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
                  {editMode ? 'Actualizar aeronave' : 'Crear nueva aeronave'}
                </h2>

                <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-white mb-1">Modelo</label>
                    <input
                      type="text"
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-white mb-1">Capacidad</label>
                    <input
                      type="number"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                      required
                    />
                  </div>

                  <div className="text-right pt-2">
                    <button
                      type="submit"
                      className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition"
                    >
                      {editMode ? 'Actualizar' : 'Guardar aeronave'}
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
