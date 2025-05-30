'use client';

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    role_id: '',
    photo: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [searchTerm]);

  const fetchUsers = async () => {
    const session = await getSession();
    const token = session?.accessToken;
    const url = searchTerm
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/search?email=${searchTerm}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
    setCurrentPage(1);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const session = await getSession();
    const token = session?.accessToken;

    const method = editMode ? 'PUT' : 'POST';
    const endpoint = editMode ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${editingUserId}` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register`;
    const body = editMode ? {
      username: form.username,
      email: form.email,
      phone: form.phone,
      
    } : form;

    await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    setShowModal(false);
    setForm({ username: '', password: '', email: '', phone: '', role_id: '', photo: '' });
    setEditMode(false);
    setEditingUserId(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setShowModal(true);
    setEditingUserId(user.user_id);
    setForm({ ...user, password: '' });
  };

  const handleDelete = async (id) => {
    const session = await getSession();
    const token = session?.accessToken;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const fetchRoles = async () => {
    const session = await getSession();
    const token = session?.accessToken;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRoles(data);
  };

const getRoleName = (id) => {
  const role = roles.find((r) => r.role_id === Number(id));
  return role ? role.name : id;
};


  const totalPages = Math.max(1, Math.ceil(users.length / itemsPerPage));
  const currentUsers = users.slice(
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
          <h2 className="text-2xl font-bold text-black dark:text-white">Usuarios</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar por correo..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
            />
            <button
              onClick={() => { setShowModal(true); setEditMode(false); setForm({ username: '', password: '', email: '', phone: '', role_id: '', photo: '' }); }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xs hover:bg-primary/90 transition w-full sm:w-auto"
            >
              <FaPlus /> Crear nuevo usuario
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded shadow-three bg-white dark:bg-[#2C303B] mx-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-[#1F2937]">
              <tr>
                {['ID', 'Usuario', 'Correo', 'Teléfono', 'Rol', 'Acciones'].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentUsers.map((user) => (
                <tr key={user.user_id}>
                  <td className="px-6 py-4 text-body-color dark:text-white">{user.user_id}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{user.username}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{user.email}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{user.phone}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{getRoleName(user.role_id)}</td>
                  {/* <td className="px-6 py-4 text-body-color dark:text-white">{user.photo}</td> */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(user)} className="text-yellow-500 hover:text-yellow-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(user.user_id)} className="text-red-500 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No se encontraron usuarios.
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
              <div className="relative w-full max-w-2xl rounded-sm bg-white dark:bg-[#2C303B] p-6 shadow-three">
                <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">✕</button>
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                  {editMode ? 'Actualizar usuario' : 'Crear nuevo usuario'}
                </h2>

                <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['username', 'email', 'phone', 'photo'].map((field) => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-sm text-gray-700 dark:text-white mb-1">
                        {field.replace('_', ' ').toUpperCase()}
                      </label>
                      <input
                        type="text"
                        id={field}
                        name={field}
                        value={form[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                      />
                    </div>
                  ))}
                  {/* Select para el rol */}
                    <div>
                      <label htmlFor="role_id" className="block text-sm text-gray-700 dark:text-white mb-1">
                        ROL
                      </label>
                      <select
                        id="role_id"
                        name="role_id"
                        value={form.role_id}
                        onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                      >
                        <option value="">Seleccione un rol</option>
                        {roles.map((role) => (
                          <option key={role.role_id} value={role.role_id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  {!editMode && (
                    <div>
                      <label htmlFor="password" className="block text-sm text-gray-700 dark:text-white mb-1">CONTRASEÑA</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                      />
                    </div>
                  )}

                  <div className="col-span-1 md:col-span-2 text-right mt-2">
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition">
                      {editMode ? 'Actualizar' : 'Guardar usuario'}
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
