'use client';

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function AirportsPage() {
  const [airports, setAirports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingAirportId, setEditingAirportId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    city: '',
    code: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAirports = async () => {
    const session = await getSession();
    const token = session?.accessToken;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/airports`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAirports(data);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const filteredAirports = airports.filter((airport) =>
    `${airport.name} ${airport.city} ${airport.code}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredAirports.length / itemsPerPage));
  const currentAirports = filteredAirports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const session = await getSession();
    const token = session?.accessToken;

    const method = editMode ? 'PUT' : 'POST';
    const endpoint = editMode
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/airports/${editingAirportId}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/airports`;

    await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setShowModal(false);
    setForm({ name: '', city: '', code: '' });
    setEditMode(false);
    setEditingAirportId(null);
    fetchAirports();
  };

  const handleEdit = (airport) => {
    setEditMode(true);
    setShowModal(true);
    setEditingAirportId(airport.airport_id);
    setForm({
      name: airport.name,
      city: airport.city,
      code: airport.code,
    });
  };

  const handleDelete = async (id) => {
    const session = await getSession();
    const token = session?.accessToken;

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/airports/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchAirports();
  };

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
          <h2 className="text-2xl font-bold text-black dark:text-white">Aeropuertos</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar aeropuerto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
            />
            <button
              onClick={() => {
                setShowModal(true);
                setEditMode(false);
                setForm({ name: '', city: '', code: '' });
              }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xs hover:bg-primary/90 transition w-full sm:w-auto"
            >
              <FaPlus />
              Crear nuevo aeropuerto
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded shadow-three bg-white dark:bg-[#2C303B] mx-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-[#1F2937]">
              <tr>
                {['ID', 'Nombre', 'Ciudad', 'Código', 'Acciones'].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentAirports.map((airport) => (
                <tr key={airport.airport_id}>
                  <td className="px-6 py-4 text-body-color dark:text-white">{airport.airport_id}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{airport.name}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{airport.city}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{airport.code}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(airport)} className="text-yellow-500 hover:text-yellow-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(airport.airport_id)} className="text-red-500 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentAirports.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No se encontraron aeropuertos.
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
                  {editMode ? 'Actualizar aeropuerto' : 'Crear nuevo aeropuerto'}
                </h2>

                <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                  {['name', 'city', 'code'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm text-gray-700 dark:text-white mb-1">
                        {field === 'code' ? 'Código IATA' : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        maxLength={field === 'code' ? 10 : undefined}
                        value={form[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                        required
                      />
                    </div>
                  ))}

                  <div className="text-right pt-2">
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition">
                      {editMode ? 'Actualizar' : 'Guardar aeropuerto'}
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
