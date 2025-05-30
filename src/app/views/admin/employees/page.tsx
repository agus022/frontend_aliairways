
'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getSession } from 'next-auth/react';

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm());
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingFlights, setPendingFlights] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedFlight, setSelectedFlight] = useState('');

  const itemsPerPage = 20;

  function initialForm() {
    return {
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
    };
  }

  const fetchAllData = async () => {
const session = await getSession();
  const headers = { Authorization: `Bearer ${session?.accessToken}` };

  const [empRes, jobRes, shiftRes, userRes, flightRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employees`, { headers }),
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`, { headers }),
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/shifts`, { headers }),
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, { headers }),
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/flights`, { headers }),
  ]);

  const allFlights = await flightRes.json();
  const filteredFlights = allFlights.filter(f => f.status === 'pendiente');

  setEmployees(await empRes.json());
  setJobs(await jobRes.json());
  setShifts(await shiftRes.json());
  setUsers(await userRes.json());
  setPendingFlights(filteredFlights);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setForm(initialForm());
      setEditMode(false);
      setEditingId(null);
    }
  };

  const handleSave = async (e) => {
    const bodyData = {
      ...form,
      job_id: parseInt(form.job_id),
      shift_id: parseInt(form.shift_id),
      user_id: parseInt(form.user_id),
    };
    e.preventDefault();
    const session = await getSession();
    const method = editMode ? 'PUT' : 'POST';
    const url = editMode
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/employees/${editingId}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/employees`;

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(bodyData),
    });

    toggleModal();
    fetchAllData();
  };

  const handleEdit = (emp) => {
    setForm({ ...emp });
    setEditingId(emp.employee_id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const session = await getSession();
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    });
    fetchAllData();
  };


  const handleAssignEmployeeToFlight = async () => {
  if (!selectedEmployee || !selectedFlight) return;

  const session = await getSession();
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employees/flight-employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({
      employee_id: selectedEmployee,
      flight_id: selectedFlight,
    }),
  });

  setSelectedEmployee('');
  setSelectedFlight('');
  fetchAllData();
};


 const getJobTitle = (id) => jobs.find(j => j.job_id === parseInt(id))?.title || '';
const getShiftDescription = (id) => shifts.find(s => s.shift_id === parseInt(id))?.shift_desc || '';
const getUserEmail = (id) => users.find(u => u.user_id === parseInt(id))?.email || '';

  const filtered = employees.filter((e) =>
    `${e.first_name} ${e.last_name_paternal} ${e.last_name_maternal}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentEmployees = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  return (
    <section className="pt-24 pb-10">
      <div className="container">
        <div className="flex justify-between mb-6 px-4">
          <h2 className="text-2xl font-bold">Empleados</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded"
            placeholder="Buscar empleado..."
          />
          <button onClick={toggleModal} className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2">
            <FaPlus /> Registrar nuevo empleado
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded shadow mx-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {["Nombre", "Ap. Paterno", "Ap. Materno", "Pasaporte", "CURP", "RFC", "Nacimiento", "Trabajo", "Turno", "Correo", "Acciones"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((e) => (
                <tr key={e.employee_id}>
                  <td className="px-6 py-2">{e.first_name}</td>
                  <td className="px-6 py-2">{e.last_name_paternal}</td>
                  <td className="px-6 py-2">{e.last_name_maternal}</td>
                  <td className="px-6 py-2">{e.passport}</td>
                  <td className="px-6 py-2">{e.curp}</td>
                  <td className="px-6 py-2">{e.rfc}</td>
                  <td className="px-6 py-2">{formatDate(e.birth_date)}</td>
                  <td className="px-6 py-2">{getJobTitle(e.job_id)}</td>
                  <td className="px-6 py-2">{getShiftDescription(e.shift_id)}</td>
                  <td className="px-6 py-2">{getUserEmail(e.user_id)}</td>
                  <td className="px-6 py-2 flex gap-2">
                    <button className="text-yellow-500" onClick={() => handleEdit(e)}><FaEdit /></button>
                    <button className="text-red-500" onClick={() => handleDelete(e.employee_id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>        
          
          <div className="flex justify-between mt-4 px-6">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 rounded bg-gray-200">← Anterior</button>
          <p>Página {currentPage} de {totalPages}</p>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 rounded bg-gray-200">Siguiente →</button>
        </div>
        </div>

        <div className="mt-10 mx-4 bg-white dark:bg-[#2C303B] rounded-sm shadow-three p-6">
  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
    Asignar empleado a vuelo (pendiente)
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="text-sm mb-1 text-gray-700 dark:text-white block">Empleado</label>
      <select
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
        className="w-full px-4 py-2 border rounded bg-[#f8f8f8] dark:bg-[#1F2937]"
      >
        <option value="">Selecciona un empleado</option>
        {employees.map((emp) => (
          <option key={emp.employee_id} value={emp.employee_id}>
            {emp.first_name} {emp.last_name_paternal} {emp.last_name_maternal}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="text-sm mb-1 text-gray-700 dark:text-white block">Vuelo (pendiente)</label>
      <select
        value={selectedFlight}
        onChange={(e) => setSelectedFlight(e.target.value)}
        className="w-full px-4 py-2 border rounded bg-[#f8f8f8] dark:bg-[#1F2937]"
      >
        <option value="">Selecciona un vuelo</option>
        {pendingFlights.map((flight) => (
          <option key={flight.flight_id} value={flight.flight_id}>
            Vuelo #{flight.flight_id}
          </option>
        ))}
      </select>
    </div>

    <div className="flex items-end">
      <button
        onClick={handleAssignEmployeeToFlight}
        className="w-full bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
      >
        Asignar
      </button>
    </div>
  </div>
</div>




        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#2C303B] p-6 rounded max-w-2xl w-full relative">
              <button onClick={toggleModal} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">✕</button>
              <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">{editMode ? 'Actualizar empleado' : 'Registrar empleado'}</h3>
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries({
                  first_name: 'Nombre(s)',
                  last_name_paternal: 'Apellido paterno',
                  last_name_maternal: 'Apellido materno',
                  passport: 'Pasaporte',
                  curp: 'CURP',
                  rfc: 'RFC',
                  birth_date: 'Fecha nacimiento',
                }).map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-sm mb-1">{label}</label>
                    <input type={name === 'birth_date' ? 'date' : 'text'} name={name} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} className="w-full px-4 py-2 border rounded bg-[#f8f8f8] dark:bg-[#1F2937]" required />
                  </div>
                ))}

                <div>
                  <label className="block text-sm mb-1">Trabajo</label>
                  <select value={form.job_id} onChange={(e) => setForm({ ...form, job_id: e.target.value })} className="w-full px-4 py-2 border rounded">
                    <option value=''>Selecciona un trabajo</option>
                    {jobs.map(j => <option key={j.job_id} value={j.job_id}>{j.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Turno</label>
                  <select value={form.shift_id} onChange={(e) => setForm({ ...form, shift_id: e.target.value })} className="w-full px-4 py-2 border rounded">
                    <option value=''>Selecciona un turno</option>
                    {shifts.map(s => <option key={s.shift_id} value={s.shift_id}>{`${s.shift_desc} (${s.start_time} - ${s.end_time})`}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Usuario</label>
                  <select value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} className="w-full px-4 py-2 border rounded">
                    <option value=''>Selecciona un usuario</option>
                    {users.map(u => <option key={u.user_id} value={u.user_id}>{u.email}</option>)}
                  </select>
                </div>

                <div className="col-span-2 text-right">
                  <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90">{editMode ? 'Actualizar' : 'Guardar'} empleado</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}