'use client';

import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const dummyRoles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Empleado' },
    { id: 3, name: 'Pasajero' },
    { id: 4, name: 'Estudiante' },
    // puedes agregar más para pruebas
];

export default function RolesPage() {
    const [showModal, setShowModal] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRoles = dummyRoles.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            onClick={() => setShowModal(true)}
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                                    Nombre del rol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredRoles.map((role) => (
                                <tr key={role.id}>
                                    <td className="px-6 py-4 text-body-color dark:text-white">{role.id}</td>
                                    <td className="px-6 py-4 text-body-color dark:text-white">{role.name}</td>
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

                            {filteredRoles.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="text-center text-gray-500 dark:text-gray-400 py-6"
                                    >
                                        No se encontraron roles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {showModal && (
                    <>
                        {/* Fondo oscurecido */}
                        <div
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        />

                        {/* Modal */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                            <div className="relative w-full max-w-md rounded-sm bg-white dark:bg-[#2C303B] p-6 shadow-three">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                                >
                                    ✕
                                </button>
                                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                                    Crear nuevo rol
                                </h2>

                                <form className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="rol_name"
                                            className="block text-sm text-gray-700 dark:text-white mb-1"
                                        >
                                            Nombre del rol
                                        </label>
                                        <input
                                            type="text"
                                            id="rol_name"
                                            name="rol_name"
                                            placeholder="Ej. Supervisor"
                                            value={newRoleName}
                                            onChange={(e) => setNewRoleName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="text-right">
                                        <button
                                            type="submit"
                                            disabled
                                            className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition disabled:opacity-50"
                                        >
                                            Guardar rol
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div> {/* cierre de container */}
        </section>

    );


}
