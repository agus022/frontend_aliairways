'use client';

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function FlightsPage() {
  
  const [aircraftOptions, setAircraftOptions] = useState([]);
  const [airportOptions, setAirportOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [flights, setFlights] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [form, setForm] = useState({
    aircraft_id: '',
    departure_date: '',
    arrival_date: '',
    departure_time: '',
    arrival_time: '',
    origin_id: '',
    destination_id: '',
    status: '',
    cost: '',
    location: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

    const fetchFlights = async () => {
    const session = await getSession();
    const token = session?.accessToken;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/enriched`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setFlights(data);
    setCurrentPage(1);
    } ;

  useEffect(() => {
    const fetchData = async () => {
    const session = await getSession();
    const token = session?.accessToken;

    const [aircraftRes, airportRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aircrafts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/airports`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const aircraftData = await aircraftRes.json();
      const airportData = await airportRes.json();

      setAircraftOptions(aircraftData);
      setAirportOptions(airportData);
    };

    fetchData();
    fetchFlights();
  }, []);


  const filteredFlights = flights.filter((flight) =>
      `${flight.departure_airport_code} ${flight.arrival_airport_code} ${flight.status} ${flight.aircraft_model}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filteredFlights.length / itemsPerPage));

    const currentFlights = filteredFlights.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const session = await getSession();
    const token = session?.accessToken;

    const method = editMode ? 'PUT' : 'POST';
    const endpoint = editMode
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/${editingFlightId}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/flights`;

    await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        cost: parseFloat(form.cost),
        aircraft_id: parseInt(form.aircraft_id),
        origin_id: parseInt(form.origin_id),
        destination_id: parseInt(form.destination_id),
      }),
    });

    setShowModal(false);
    setForm({
      aircraft_id: '',
      departure_date: '',
      arrival_date: '',
      departure_time: '',
      arrival_time: '',
      origin_id: '',
      destination_id: '',
      status: '',
      cost: '',
      location: '',
    });
    setEditMode(false);
    setEditingFlightId(null);
    fetchFlights();
  };

const handleEdit = (flight) => {
  // Buscar ID de aeronave por modelo
  const aircraft = aircraftOptions.find((a) => a.model === flight.aircraft_model);
  const origin = airportOptions.find((ap) => ap.code === flight.departure_airport_code);
  const destination = airportOptions.find((ap) => ap.code === flight.arrival_airport_code);

  setForm({
    aircraft_id: aircraft ? String(aircraft.aircraft_id) : '',
    origin_id: origin ? String(origin.airport_id) : '',
    destination_id: destination ? String(destination.airport_id) : '',
    departure_date: flight.departure_date.split('T')[0],
    arrival_date: flight.arrival_date.split('T')[0],
    departure_time: flight.departure_time.slice(0, 5),
    arrival_time: flight.arrival_time.slice(0, 5),
    status: flight.status,
    cost: flight.cost,
    location: flight.location || '',
  });

  setEditingFlightId(flight.flight_id);
  setEditMode(true);
  setShowModal(true);
};

  const handleDelete = async (id) => {
    const session = await getSession();
    const token = session?.accessToken;

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchFlights();
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  //FORMATEAR FECHA
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  //FORMATEAR HORA 
  const formatTime = (isoStringOrTime) => {
  const date = new Date(`1970-01-01T${isoStringOrTime}`);
  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  };

  return (
    <section className="relative z-10 overflow-hidden pt-24 pb-10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Vuelos</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar vuelo...."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-xs text-sm dark:bg-[#1F2937] dark:text-white"
            />
            <button
              onClick={() => {
                setShowModal(true);
                setEditMode(false);
                setForm({
                  aircraft_id: '',
                  departure_date: '',
                  arrival_date: '',
                  departure_time: '',
                  arrival_time: '',
                  origin_id: '',
                  destination_id: '',
                  status: '',
                  cost: '',
                  location: '',
                });
              }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xs hover:bg-primary/90"
            >
              <FaPlus />
              Crear nuevo vuelo
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded shadow-three bg-white dark:bg-[#2C303B] mx-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-[#1F2937]">
              <tr>
                {['ID', 'Origen', 'Destino', 'Fecha salida', 'Hora salida','Fecha llegada','Hora llegada','Aeronave','Estado', 'Costo','Ubicacion','Acciones'].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-800 uppercase">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentFlights.map((flight) => (
                <tr key={flight.flight_id}>
                  <td className="px-6 py-4 text-body-color dark:text-white">{flight.flight_id}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{flight.departure_airport_code}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{flight.arrival_airport_code}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{formatDate(flight.departure_date)}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{formatTime(flight.departure_time)}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{formatDate(flight.arrival_date)}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{formatTime(flight.arrival_time)}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{flight.aircraft_model}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{flight.status}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">${Number(flight.cost).toFixed(2)}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{flight.location}</td>


                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(flight)} className="text-yellow-500 hover:text-yellow-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(flight.flight_id)} className="text-red-500 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentFlights.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No se encontraron vuelos.
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
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
    />
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-2xl rounded-sm bg-white dark:bg-[#2C303B] p-6 shadow-three">
        <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
          {editMode ? 'Actualizar vuelo' : 'Crear nuevo vuelo'}
        </h2>
          {/* <pre className="text-xs text-red-500">{JSON.stringify(form, null, 2)}</pre> */}
        <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aeronave */}
<div>
  <label className="block text-sm text-gray-700 dark:text-white mb-1">Aeronave</label>
  <select
    value={form.aircraft_id}
    onChange={(e) => setForm({ ...form, aircraft_id: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
    required
  >
    <option value="">Selecciona una aeronave</option>
    {aircraftOptions.map((a) => (
      <option key={a.aircraft_id} value={String(a.aircraft_id)}>
        {a.model}
      </option>
    ))}
  </select>
</div>

{/* Origen */}
<div>
  <label className="block text-sm text-gray-700 dark:text-white mb-1">Aeropuerto de Origen</label>
  <select
    value={form.origin_id}
    onChange={(e) => setForm({ ...form, origin_id: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
    required
  >
    <option value="">Selecciona un aeropuerto</option>
    {airportOptions.map((ap) => (
      <option key={ap.airport_id} value={String(ap.airport_id)}>
        {ap.code} - {ap.city}
      </option>
    ))}
  </select>
</div>

{/* Destino */}
<div>
  <label className="block text-sm text-gray-700 dark:text-white mb-1">Aeropuerto de Destino</label>
  <select
    value={form.destination_id}
    onChange={(e) => setForm({ ...form, destination_id: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
    required
  >
    <option value="">Selecciona un aeropuerto</option>
    {airportOptions.map((ap) => (
      <option key={ap.airport_id} value={String(ap.airport_id)}>
        {ap.code} - {ap.city}
      </option>
    ))}
  </select>
</div>

          {/* Otros campos */}
          {[
            { name: 'departure_date', label: 'Fecha salida', type: 'date' },
            { name: 'arrival_date', label: 'Fecha llegada', type: 'date' },
            { name: 'departure_time', label: 'Hora salida', type: 'time' },
            { name: 'arrival_time', label: 'Hora llegada', type: 'time' },
            { name: 'status', label: 'Estado', type: 'text' },
            { name: 'cost', label: 'Costo', type: 'number' },
            { name: 'location', label: 'Ubicación / tipo de vuelo', type: 'text' },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm text-gray-700 dark:text-white mb-1">{label}</label>
              <input
                type={type}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                required
              />
            </div>
          ))}

          {/* Botón */}
          <div className="col-span-1 md:col-span-2 text-right mt-2">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition">
              {editMode ? 'Actualizar' : 'Guardar vuelo'}
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
