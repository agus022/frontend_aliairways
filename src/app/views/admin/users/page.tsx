'use client';

import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const dummyUsers = [
  {
    user_id: 1,
    username: 'admin_user',
    password: '••••••••',
    email: 'admin@aliairways.mx',
    phone: '4611111111',
    role_id: 1,
    photo: 'admin.png',
  },
  {
    user_id: 2,
    username: 'passenger_user',
    password: '••••••••',
    email: 'user@aliairways.mx',
    phone: '4611112222',
    role_id: 3,
    photo: 'passenger.png',
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    role_id: '',
    photo: '',
  });

  const filteredUsers = dummyUsers.filter((user) =>
    `${user.username} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="relative z-10 overflow-hidden pt-24 pb-10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Usuarios</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
            />
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xs hover:bg-primary/90 transition w-full sm:w-auto"
            >
              <FaPlus />
              Crear nuevo usuario
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded shadow-three bg-white dark:bg-[#2C303B] mx-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-[#1F2937]">
              <tr>
                {['ID', 'Usuario', 'Correo', 'Teléfono', 'Rol', 'Foto', 'Acciones'].map((head) => (
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
              {filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td className="px-6 py-4 text-body-color dark:text-white">{user.user_id}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{user.username}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{user.email}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{user.phone}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{user.role_id}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{user.photo}</td>
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

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No se encontraron usuarios.
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
                  Crear nuevo usuario
                </h2>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'username', label: 'Nombre de usuario' },
                    { name: 'password', label: 'Contraseña', type: 'password' },
                    { name: 'email', label: 'Correo electrónico' },
                    { name: 'phone', label: 'Teléfono' },
                    { name: 'role_id', label: 'ID de rol' },
                    { name: 'photo', label: 'Ruta de foto' },
                  ].map(({ name, label, type }) => (
                    <div key={name}>
                      <label htmlFor={name} className="block text-sm text-gray-700 dark:text-white mb-1">
                        {label}
                      </label>
                      <input
                        type={type || 'text'}
                        name={name}
                        id={name}
                        value={newUser[name as keyof typeof newUser]}
                        onChange={(e) =>
                          setNewUser({ ...newUser, [name]: e.target.value })
                        }
                        placeholder={label}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                      />
                    </div>
                  ))}

                  <div className="col-span-1 md:col-span-2 text-right mt-2">
                    <button
                      type="submit"
                      disabled
                      className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      Guardar usuario
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
