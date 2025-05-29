'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getSession } from 'next-auth/react';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, [searchTerm]);

  const fetchRoles = async () => {
    try {
      const session = await getSession();
      const token = session?.accessToken;
      const url = searchTerm? `http://localhost:3000/api/v1/roles/search?name=${searchTerm}`: 'http://localhost:3000/api/v1/roles';

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error('Error al obtener roles', err);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const session = await getSession();
      const token = session?.accessToken;

      if (editMode) {
        await fetch(`http://localhost:3000/api/v1/roles/${editingRoleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newRoleName }),
        });
      } else {
        await fetch('http://localhost:3000/api/v1/roles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newRoleName }),
        });
      }
      setNewRoleName('');
      setEditMode(false);
      setEditingRoleId(null);
      setShowModal(false);
      fetchRoles();
    } catch (err) {
      console.error('Error al guardar el rol', err);
    }
  };

  const handleEdit = (role) => {
    setEditMode(true);
    setEditingRoleId(role.role_id);
    setNewRoleName(role.name);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const session = await getSession();
      const token = session?.accessToken;
      await fetch(`http://localhost:3000/api/v1/roles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRoles();
    } catch (err) {
      console.error('Error al eliminar rol', err);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pt-24 pb-10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Roles</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
            />
            <button
              onClick={() => {
                setNewRoleName('');
                setEditMode(false);
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xs hover:bg-primary/90 transition w-full sm:w-auto"
            >
              <FaPlus />
              Crear nuevo rol
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded shadow-three bg-white dark:bg-[#2C303B] mx-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-[#1F2937]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Nombre del rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {roles.map((role) => (
                <tr key={role.role_id}>
                  <td className="px-6 py-4 text-body-color dark:text-white">{role.role_id}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{role.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(role)} className="text-yellow-500 hover:text-yellow-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(role.role_id)} className="text-red-500 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {roles.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No se encontraron roles.
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
                <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
                  ✕
                </button>
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                  {editMode ? 'Actualizar rol' : 'Crear nuevo rol'}
                </h2>

                <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="rol_name" className="block text-sm text-gray-700 dark:text-white mb-1">
                      Nombre del rol
                    </label>
                    <input
                      type="text"
                      id="rol_name"
                      name="rol_name"
                      placeholder="Ej. Supervisor"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="text-right">
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition">
                      {editMode ? 'Actualizar' : 'Guardar'}
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
