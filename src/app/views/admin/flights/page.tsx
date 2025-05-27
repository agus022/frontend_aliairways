'use client';

import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const dummyFlights = [
  {
    flight_id: 1,
    aircraft_id: 1,
    departure_date: '2024-06-01',
    arrival_date: '2024-06-01',
    departure_time: '08:00',
    arrival_time: '10:30',
    origin_id: 1,
    destination_id: 2,
    status: 'En curso',
    cost: 1500.0,
    location: 'CDMX',
  },
  {
    flight_id: 2,
    aircraft_id: 2,
    departure_date: '2024-06-05',
    arrival_date: '2024-06-05',
    departure_time: '12:00',
    arrival_time: '14:00',
    origin_id: 3,
    destination_id: 1,
    status: 'Programado',
    cost: 2100.0,
    location: 'Guadalajara',
  },
];

export default function FlightsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newFlight, setNewFlight] = useState({
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

  const filteredFlights = dummyFlights.filter((flight) =>
    `${flight.status} ${flight.location} ${flight.cost}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="relative z-10 overflow-hidden pt-24 pb-10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Vuelos</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar vuelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
            />
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xs hover:bg-primary/90 transition w-full sm:w-auto"
            >
              <FaPlus />
              Crear nuevo vuelo
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded shadow-three bg-white dark:bg-[#2C303B] mx-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-[#1F2937]">
              <tr>
                {[
                  'ID',
                  'Aeronave',
                  'F. Salida',
                  'F. Llegada',
                  'H. Salida',
                  'H. Llegada',
                  'Origen',
                  'Destino',
                  'Estado',
                  'Costo',
                  'Ubicación',
                  'Acciones',
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 uppercase"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFlights.map((flight) => (
                <tr key={flight.flight_id}>
                  <td className="px-4 py-2 dark:text-white">{flight.flight_id}</td>
                  <td className="px-4 py-2 dark:text-white">{flight.aircraft_id}</td>
                  <td className="px-4 py-2 dark:text-white">{flight.departure_date}</td>
                  <td className="px-4 py-2 dark:text-white">{flight.arrival_date}</td>
                  <td className="px-4 py-2 dark:text-white">{flight.departure_time}</td>
                  <td className="px-4 py-2 dark:text-white">{flight.arrival_time}</td>
                  <td className="px-4 py-2 dark:text-white">{flight.origin_id}</td>
                  <td className="px-4 py-2 dark:text-white">{flight.destination_id}</td>
                  <td className="px-4 py-2 dark:text-white">{flight.status}</td>
                  <td className="px-4 py-2 dark:text-white">${flight.cost.toFixed(2)}</td>
                  <td className="px-4 py-2 dark:text-white">{flight.location}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button className="text-yellow-500 hover:text-yellow-600">
                        <FaEdit />
                      </button>
                      <button className="text-red-500 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredFlights.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No se encontraron vuelos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="relative w-full max-w-2xl rounded-sm bg-white dark:bg-[#2C303B] p-6 shadow-three">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                  Crear nuevo vuelo
                </h2>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {[
                    { name: 'aircraft_id', label: 'ID de aeronave', type: 'number' },
                    { name: 'origin_id', label: 'ID de origen', type: 'number' },
                    { name: 'destination_id', label: 'ID de destino', type: 'number' },
                    { name: 'status', label: 'Estado del vuelo' },
                    { name: 'cost', label: 'Costo', type: 'number' },
                    { name: 'location', label: 'Ubicación actual' },
                    { name: 'departure_date', label: 'Fecha salida', type: 'date' },
                    { name: 'arrival_date', label: 'Fecha llegada', type: 'date' },
                    { name: 'departure_time', label: 'Hora salida', type: 'time' },
                    { name: 'arrival_time', label: 'Hora llegada', type: 'time' },
                  ].map(({ name, label, type }) => (
                    <div key={name}>
                      <label className="block text-sm text-gray-700 dark:text-white mb-1">
                        {label}
                      </label>
                      <input
                        type={type || 'text'}
                        name={name}
                        value={newFlight[name as keyof typeof newFlight]}
                        onChange={(e) => setNewFlight({ ...newFlight, [name]: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-gray-800 dark:text-white"
                      />
                    </div>
                  ))}

                  <div className="col-span-1 md:col-span-2 text-right mt-2">
                    <button
                      type="submit"
                      disabled
                      className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      Guardar vuelo
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
