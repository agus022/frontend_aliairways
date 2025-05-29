'use client';

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newJob, setNewJob] = useState({ title: '', salary: '' });

  useEffect(() => {
    fetchJobs();
  }, [searchTerm]);

  const fetchJobs = async () => {
    const session = await getSession();
    const token = session?.accessToken;
    const res = await fetch('http://localhost:3000/api/v1/jobs', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setJobs(data);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const session = await getSession();
    const token = session?.accessToken;

    const endpoint = editMode
      ? `http://localhost:3000/api/v1/jobs/${editingId}`
      : 'http://localhost:3000/api/v1/jobs';

    await fetch(endpoint, {
      method: editMode ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newJob.title,
        salary: parseFloat(newJob.salary),
      }),
    });

    setNewJob({ title: '', salary: '' });
    setEditMode(false);
    setEditingId(null);
    setShowModal(false);
    fetchJobs();
  };

  const handleEdit = (job) => {
    setEditMode(true);
    setNewJob({ title: job.title, salary: job.salary });
    setEditingId(job.job_id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const session = await getSession();
    const token = session?.accessToken;
    await fetch(`http://localhost:3000/api/v1/jobs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchJobs();
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="relative z-10 overflow-hidden pt-24 pb-10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Trabajos</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar trabajo por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
            />
            <button
              onClick={() => {
                setEditMode(false);
                setNewJob({ title: '', salary: '' });
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xs hover:bg-primary/90 transition w-full sm:w-auto"
            >
              <FaPlus />
              Crear nuevo trabajo
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded shadow-three bg-white dark:bg-[#2C303B] mx-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-[#1F2937]">
              <tr>
                {['ID', 'Título', 'Salario', 'Acciones'].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredJobs.map((job) => (
                <tr key={job.job_id}>
                  <td className="px-6 py-4 text-body-color dark:text-white">{job.job_id}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{job.title}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">${parseFloat(job.salary).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(job)} className="text-yellow-500 hover:text-yellow-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(job.job_id)} className="text-red-500 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No se encontraron trabajos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="relative w-full max-w-md rounded-sm bg-white dark:bg-[#2C303B] p-6 shadow-three">
                <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">✕</button>
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                  {editMode ? 'Editar trabajo' : 'Crear nuevo trabajo'}
                </h2>

                <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm text-gray-700 dark:text-white mb-1">Título del trabajo</label>
                    <input
                      type="text"
                      id="title"
                      placeholder="Ej. Coordinador de Vuelo"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="salary" className="block text-sm text-gray-700 dark:text-white mb-1">Salario mensual</label>
                    <input
                      type="number"
                      step="0.01"
                      id="salary"
                      placeholder="Ej. 45000.00"
                      value={newJob.salary}
                      onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="text-right pt-2">
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition">
                      {editMode ? 'Actualizar' : 'Guardar trabajo'}
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
