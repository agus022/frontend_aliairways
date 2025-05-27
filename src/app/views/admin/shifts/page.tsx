'use client';

import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const dummyShifts = [
  { shift_id: 1, start_time: '08:00', end_time: '16:00', shift_desc: 'Mañana' },
  { shift_id: 2, start_time: '16:00', end_time: '00:00', shift_desc: 'Tarde' },
  { shift_id: 3, start_time: '00:00', end_time: '08:00', shift_desc: 'Noche' },
];

export default function ShiftsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newShift, setNewShift] = useState({
    start_time: '',
    end_time: '',
    shift_desc: '',
  });

  const filteredShifts = dummyShifts.filter((shift) =>
    shift.shift_desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="relative z-10 overflow-hidden pt-24 pb-10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Horarios</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar horario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
            />
            <button
              onClick={() => setShowModal(true)}
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
              {filteredShifts.map((shift) => (
                <tr key={shift.shift_id}>
                  <td className="px-6 py-4 text-body-color dark:text-white">{shift.shift_id}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{shift.start_time}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{shift.end_time}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{shift.shift_desc}</td>
                  <td className="px-6 py-4">
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

              {filteredShifts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No se encontraron horarios.
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
              <div className="relative w-full max-w-md rounded-sm bg-white dark:bg-[#2C303B] p-6 shadow-three">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                  Crear nuevo horario
                </h2>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-white mb-1">
                      Hora de inicio
                    </label>
                    <input
                      type="time"
                      value={newShift.start_time}
                      onChange={(e) => setNewShift({ ...newShift, start_time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-white mb-1">
                      Hora de fin
                    </label>
                    <input
                      type="time"
                      value={newShift.end_time}
                      onChange={(e) => setNewShift({ ...newShift, end_time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-white mb-1">
                      Descripción del turno
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Tarde"
                      maxLength={15}
                      value={newShift.shift_desc}
                      onChange={(e) => setNewShift({ ...newShift, shift_desc: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="text-right pt-2">
                    <button
                      type="submit"
                      disabled
                      className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      Guardar horario
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
