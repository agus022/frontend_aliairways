'use client';

import { useState,useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const dummyEmployees = Array.from({ length: 123 }, (_, i) => ({
  id: i + 1,
  first_name: `Empleado ${i + 1}`,
  last_name_paternal: 'Pérez',
  last_name_maternal: 'López',
  passport: `AB1234${i}`,
  curp: `CURP${i}`,
  rfc: `RFC${i}`,
  birth_date: '1990-01-01',
  job_id: `${(i % 5) + 1}`,
  shift_id: `${(i % 3) + 1}`,
  user_id: `${i + 10}`,
}));



export default function EmployeeListPage() {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 20;
 const filteredEmployees = dummyEmployees.filter((emp) =>
  `${emp.first_name} ${emp.last_name_paternal} ${emp.last_name_maternal}`.toLowerCase().includes(searchTerm.toLowerCase())
);

const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

const currentEmployees = filteredEmployees.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
  
    useEffect(() => {
    if (showModal) {
        document.body.classList.add('modal-open');
    } else {
        document.body.classList.remove('modal-open');
    }
    }, [showModal]);

  

  return (
    <section className="relative z-10 overflow-hidden pt-24 pb-10">
      <div className="container">
        <div className="flex justify-between items-center mb-6 px-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Empleados</h2>
          <div className="w-full md:w-1/3">
            <input
                type="text"
                placeholder="Buscar empleado..."
                value={searchTerm}
                onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reinicia paginación al buscar
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
            />
            </div>
          <button
            onClick={toggleModal}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xs hover:bg-primary/90 transition"
          >
            <FaPlus />
            Registrar nuevo empleado
          </button>
        </div>

        <div className="overflow-x-auto rounded shadow-three bg-white dark:bg-[#2C303B] mx-4 ">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-[#1F2937]">
              <tr>
                {[
                  'Nombre',
                  'Ap. Paterno',
                  'Ap. Materno',
                  'Pasaporte',
                  'CURP',
                  'RFC',
                  'Nacimiento',
                  'Trabajo',
                  'Turno',
                  'Usuario',
                  'Acciones',
                ].map((head) => (
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
              {currentEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td className="px-6 py-4 text-body-color dark:text-white">{emp.first_name}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{emp.last_name_paternal}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{emp.last_name_maternal}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{emp.passport}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{emp.curp}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{emp.rfc}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{emp.birth_date}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{emp.job_id}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{emp.shift_id}</td>
                  <td className="px-6 py-4 text-body-color dark:text-white">{emp.user_id}</td>
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
            </tbody>
          </table>

        <div className="flex justify-between items-center mt-4 px-6">
            <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xs bg-gray-200 dark:bg-[#1F2937] text-sm font-medium disabled:opacity-50"
            >
                ← Anterior
            </button>

            <p className="text-sm text-body-color dark:text-white">
                Página {currentPage} de {totalPages}
            </p>

            <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xs bg-gray-200 dark:bg-[#1F2937] text-sm font-medium disabled:opacity-50"
            >
                Siguiente →
            </button>
            </div>


            
        </div>

        <div className="mt-10 mx-4 bg-white dark:bg-[#2C303B] rounded-xs shadow-three p-6">
  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
    Asignar empleado a vuelo
  </h3>
  {/* asginacion de empleados a vuelos */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
  {/* Selector de empleado */}
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Seleccionar empleado</label>
    <select
      disabled
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
    >
      <option>-- Empleado --</option>
      <option>Carlos Pérez</option>
      <option>Laura Ramírez</option>
    </select>
  </div>

      <div className="flex justify-center items-center">
    <span className="text-blue-600 text-1xl font-bold">←→</span>
  </div>

    <div>
    <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Seleccionar vuelo</label>
    <select
      disabled
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs bg-[#f8f8f8] dark:bg-[#1F2937] text-sm text-gray-800 dark:text-white"
    >
      <option>-- Vuelo --</option>
      <option>Vuelo 101 - CDMX → Cancún</option>
      <option>Vuelo 202 - Guadalajara → Monterrey</option>
    </select>
  </div>
  </div>

  <div className="mt-6 text-right">
    <button
      disabled
      className="bg-primary text-white px-6 py-2 rounded-xs hover:bg-primary/90 transition disabled:opacity-50"
    >
      Asignar
    </button>
  </div>
</div>


        {/* Modal */}
{showModal && (
<>
  <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={toggleModal} />
  
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
    <div className="relative w-full max-w-3xl rounded-sm bg-white dark:bg-[#2C303B] p-6 shadow-three">
      <button
        onClick={toggleModal}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
        Registrar nuevo empleado
      </h2>
      <EmployeeForm />
    </div>
  </div>
</>
)}
      </div>
    </section>
  );
}

function EmployeeForm() {
  const [form, setForm] = useState({
    job_id: '',
    shift_id: '',
    first_name: '',
    last_name_paternal: '',
    last_name_maternal: '',
    passport: '',
    curp: '',
    rfc: '',
    birth_date: '',
    user_id: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { name: 'first_name', label: 'Nombre(s)' },
        { name: 'last_name_paternal', label: 'Apellido paterno' },
        { name: 'last_name_maternal', label: 'Apellido materno' },
        { name: 'passport', label: 'Pasaporte' },
        { name: 'curp', label: 'CURP' },
        { name: 'rfc', label: 'RFC' },
        { name: 'birth_date', label: 'Fecha de nacimiento', type: 'date' },
        { name: 'user_id', label: 'ID de usuario' },
        { name: 'job_id', label: 'ID de trabajo' },
        { name: 'shift_id', label: 'ID de turno' },
      ].map(({ name, label, type }) => (
        <div key={name}>
          <label htmlFor={name} className="text-sm mb-1 block text-gray-700 dark:text-white">
            {label}
          </label>
          <input
            type={type || 'text'}
            name={name}
            value={form[name as keyof typeof form]}
            onChange={handleChange}
            placeholder={label}
            className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-4 py-2 text-base outline-none transition-all duration-300 dark:border-transparent dark:bg-[#1F2937] dark:focus:shadow-none"
          />
        </div>
      ))}

      <div className="col-span-1 md:col-span-2">
        <button
          type="submit"
          className="mt-4 bg-primary text-white px-6 py-3 rounded-xs hover:bg-primary/90 transition"
        >
          Guardar empleado
        </button>
      </div>
    </form>
  );
}
