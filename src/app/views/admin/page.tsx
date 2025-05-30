'use client';
import { useSession, getSession} from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bar,Doughnut,Line } from 'react-chartjs-2';
import {Chart as ChartJS,BarElement,CategoryScale,LinearScale,Tooltip,Legend,LineElement, PointElement,} from 'chart.js';
import { ArcElement } from 'chart.js';




// const generatePDF = async (sectionId: string, fileName: string) => {
//   console.log(`Generando PDF para: ${sectionId}`);

//   if (typeof window === 'undefined') return;

//   const element = document.getElementById(sectionId);
//   if (!element) return;

//   // Convertir los canvas a imágenes para que html2pdf los renderice correctamente
//   const canvases = element.querySelectorAll('canvas');
//   canvases.forEach((canvas) => {
//     const image = document.createElement('img');
//     image.src = canvas.toDataURL();
//     image.style.maxWidth = '100%';
//     canvas.parentNode?.replaceChild(image, canvas);
//   });

//   const html2pdf = (await import('html2pdf.js')).default;

//   const opt = {
//     margin: 0.5,
//     filename: `${fileName}.pdf`,
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
//   };

//   await html2pdf().from(element).set(opt).save();
//   console.log('PDF generado con éxito');
// };

ChartJS.register(BarElement, CategoryScale, LinearScale,ArcElement,LineElement,PointElement, Tooltip, Legend);

const FlightPerformanceSection = () => {
  const [flightData, setFlightData] = useState([]);
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');
  const [kpis, setKpis] = useState({
    total_flights: 0,
    completed_pct: 0,
    pending_pct: 0,
    cancelled_pct: 0,
    growth_vs_previous: 0,
  });
  const [currentFlights, setCurrentFlights] = useState({ arrivals: 0, departures: 0 });
  const [totalFlights, setTotalFlights] = useState(0);


  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const session = await getSession();
        const token = session?.accessToken;
        if (!token) {
          console.warn('No se encontró el token en la sesión');
          return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/dashboard/kpis?range=${filter}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log('KPIs:', data);
        setKpis(data);
      } catch (error) {
      console.error('Error al obtener KPIs de vuelos:', error);
      }
    };
    fetchKPIs();

    const fetchCurrentFlights = async () => {
      try {
        const session = await getSession();
        const token = session?.accessToken;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/dashboard/current-flights`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCurrentFlights(data);
      } catch (error) {
        console.error('Error al obtener vuelos en curso:', error);
      }
    };
    fetchCurrentFlights();

    const fetchTotalFlights = async () => {
    try {
      const session = await getSession();
      const token = session?.accessToken;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/dashboard/flights-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTotalFlights(data.total);  // más directo
    } catch (error) {
      console.error('Error al obtener el total de vuelos:', error);
    }
    
    };
    fetchTotalFlights();

    const fetchFlightData = async () => {
      const session = await getSession();
      const token = session?.accessToken;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/dashboard/flights-over-time?range=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFlightData(data);
    };
    fetchFlightData();


  }, [filter]);

  return (
    <section className="mt-10" id="flight-performance-report">
      {/* Encabezado y filtro */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-bold text-gray-800">Rendimiento de Vuelos</h2>
        <div className="flex space-x-2">
          {['day', 'week', 'month'].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as 'day' | 'week' | 'month')}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                filter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
              }`}
            >
              {option === 'day' ? 'Día' : option === 'week' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vuelos Totales */}
        <div className="bg-white p-6 rounded shadow flex flex-col justify-between">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Vuelos Totales ({filter})</h3>
            <p className="text-4xl font-bold text-gray-900">{kpis.total_flights}</p>
            <p 
              className={`text-sm mt-1 ${
              kpis.growth_vs_previous >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {kpis.growth_vs_previous >= 0 ? '↑' : '↓'} {Math.abs(kpis.growth_vs_previous)}% vs periodo anterior
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Vuelos Completados</p>
                <p className="font-semibold text-green-600">{kpis.completed_pct}%</p>
              </div>
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">
                  {kpis.completed_pct}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Vuelos Pendientes</p>
                <p className="font-semibold text-amber-500">{kpis.pending_pct}%</p>
              </div>
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-amber-500">
                  {kpis.pending_pct}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Vuelos Cancelados</p>
                <p className="font-semibold text-red-500">
                  {kpis.cancelled_pct}%
                </p>
              </div>
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-red-500">
                  {kpis.cancelled_pct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vuelos en Curso */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Vuelos en curso</h3>
          <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-100 p-4 rounded text-center">
          <p className="text-sm text-gray-600 mb-1">Llegadas</p>
          <p className="text-3xl font-bold text-blue-600">{currentFlights.arrivals}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded text-center">
          <p className="text-sm text-gray-600 mb-1">Salidas</p>
          <p className="text-3xl font-bold text-blue-600">{currentFlights.departures}</p>
        </div>
        </div>
        </div>

        {/* Vuelos Programados */}
        <div className="bg-white p-6 rounded shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Vuelos Programados</h3>
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-gray-100 w-full h-32 rounded flex items-center justify-center">
                  <p className="text-6xl font-extrabold text-blue-600">{totalFlights}</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mt-4 text-center">
                Incluye vuelos próximos a operar en el periodo seleccionado.
              </p>
          </div>
        </div>
      </div>

      {/* Gráficas extendidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded shadow ">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Estado de vuelos</h3>
          <div className="h-60 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            <Doughnut
    data={{
      labels: ['Completados', 'Pendientes', 'Cancelados'],
      datasets: [
        {
          data: [
            kpis.completed_pct,
            kpis.pending_pct,
            kpis.cancelled_pct
          ],
          backgroundColor: ['#16a34a', '#f59e0b', '#dc2626'], // verde, ámbar, rojo
          borderWidth: 1,
        },
      ],
    }}
    options={{
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
      },
      cutout: '70%', // grosor de la dona
      responsive: true,
      maintainAspectRatio: false,
    }}
  />
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow ">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Totales de Vuelos en el tiempo</h3>
          <div className="h-60 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            <Bar
              data={{
                labels: flightData.map(item => item.label),
                datasets: [
                  {
                    label: 'Total de Vuelos',
                    data: flightData.map(item => item.total),
                    backgroundColor: '#3b82f6', // azul
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FinancialSummarySection = () => {
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');
    const [financialData, setFinancialData] = useState({
    total_income: 0,
    total_expenses: 0,
    employee_expenses: 0,
    maintenance_fuel_expenses: 0,
  });
  useEffect(() => {
    const fetchFinancialSummary = async () => {
      const session = await getSession();
      const token = session?.accessToken;
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/dashboard/financials?range=${filter}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setFinancialData(data);
      } catch (error) {
        console.error('Error al obtener resumen financiero:', error);
      }
    };

    fetchFinancialSummary();
  }, [filter]);
  return (
    <section className="mt-10" id="financial-summary-report">
    <div className="flex items-center justify-between mb-4 px-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Resumen Financiero</h2>
      <div className="flex space-x-2">
          {['day', 'week', 'month'].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as 'day' | 'week' | 'month')}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                filter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
              }`}
            >
              {option === 'day' ? 'Día' : option === 'week' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
    </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Ingresos Totales</h3>
          <p className="text-3xl font-bold text-gray-900"> ${financialData.total_income.toLocaleString()}</p>
          <p className="text-green-600 text-sm">Generado por vuelos</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Gastos Totales</h3>
          <p className="text-3xl font-bold text-red-500">${financialData.total_expenses.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">Costo operativo general</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Gastos por Empleados</h3>
          <p className="text-2xl font-bold text-gray-900"> ${financialData.employee_expenses.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">Salarios y beneficios</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Combustible y Mantenimiento</h3>
          <p className="text-2xl font-bold text-gray-900">${financialData.maintenance_fuel_expenses.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">Costos técnicos</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Comparación de Ingresos vs Gastos</h3>
        <div className="relative w-full h-[300px]">
          <Bar
            data={{
              labels: ['Ingresos', 'Gastos'],
              datasets: [
                {
                  label: 'Monto ($)',
                  data: [financialData.total_income, financialData.total_expenses],
                  backgroundColor: ['#22c55e', '#ef4444'], // verde y rojo
                  borderRadius: 8,
                  barThickness: 40
                },
              ],
            }}
            options={{
              indexAxis: 'y', // HORIZONTAL
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${Number(value).toLocaleString()}`,
                    color: '#4B5563',
                  },
                  title: {
                    display: true,
                    text: 'Monto ($)',
                    color: '#6B7280',
                  },
                },
                y: {
                  ticks: {
                    color: '#374151',
                    font: { weight: 'bold' },
                  },
                },
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `$${context.raw?.toLocaleString()}`,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
};

const PassengerStatsSection = () => {
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');
  const [stats, setStats] = useState({
    passenger_count: 0,
    passenger_growth_pct: 0,
    avg_load_factor: 0,
    load_factor_growth_pct: 0,
  });

  const [classData, setClassData] = useState({ economy: 0, premium: 0, first: 0 });
  const passengerGoal = 50; // Meta ficticia de passengers 
  const [count, setCount] = useState(0);

  useEffect(() => {
  const fetchPassengerStats = async () => {
    const session = await getSession();
    const token = session?.accessToken;
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/passengers/dashboard/kpis?range=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error al obtener estadísticas de pasajeros:', error);
    }
  };
  fetchPassengerStats();

  const fetchDataPassengerByClass = async () => {
      const session = await getSession();
      const token = session?.accessToken;
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/passengers/dashboard/passenger-by-class?range=${filter}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log('Datos por clase:', data);

        setClassData(data);
      } catch (error) {
        console.error('Error al obtener datos por clase:', error);
      }
    };
    fetchDataPassengerByClass();

    const fetchPassengerCount = async () => {
      const session = await getSession();
      const token = session?.accessToken;
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/passengers/dashboard/passenger-count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCount(data.total);
      } catch (error) {
        console.error('Error al obtener total de pasajeros:', error);
      }
    };

    fetchPassengerCount();
  }, [filter]);

  //dona del progreso  para passengers pasajeros al largo del tiempo 
  const data = {
    labels: ['Registrados', 'Faltantes'],
    datasets: [
      {
        data: [count, Math.max(passengerGoal - count, 0)],
        backgroundColor: ['#3b82f6', '#e5e7eb'], // azul + gris
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <section className="mt-10"  id="passenger-stats-report">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-bold text-gray-800">Pasajeros</h2>
        <div className="flex space-x-2">
          {['day', 'week', 'month'].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as 'day' | 'week' | 'month')}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                filter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
              }`}
            >
              {option === 'day' ? 'Día' : option === 'week' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow col-span-1 flex flex-col justify-between">
          <div className="mb-8">
            <h3 className="text-gray-500 text-sm mb-1">Pasajeros Transportados</h3>
            <p className="text-4xl font-bold text-gray-900">
              {stats.passenger_count.toLocaleString()}
            </p>
            <p className="text-green-600 text-sm mt-1">
              ↑ {stats.passenger_growth_pct}% vs periodo anterior
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Factor de Carga Promedio</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.avg_load_factor.toFixed(1)}%
            </p>
            <p className="text-green-600 text-sm mt-1">
              ↑ {stats.load_factor_growth_pct}%
            </p>
          </div>
          
        </div>

        <div className="bg-white p-6 rounded shadow col-span-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Pasajeros a lo largo del tiempo
          </h3>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
            <div className="relative w-48 h-48 mx-auto">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{count.toLocaleString()}</span>
            </div>
          </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow col-span-1">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Pasajeros por Clase
        </h3>
        <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
<Bar
        data={{
          labels: ['Económica', 'Primera', 'Premium'],
          datasets: [
            {
              label: 'Cantidad de Pasajeros',
              data: [classData.economy, classData.first, classData.premium],
              backgroundColor: [
                'rgb(59, 130, 246)',    // azul
                'rgb(234, 179, 8)',     // ámbar
                'rgb(239, 68, 68)',     // rojo
              ],
              borderRadius: 5,
              barPercentage: 0.6,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.raw} pasajeros`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
              title: {
                display: true,
                text: 'Cantidad de Pasajeros',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Clase',
              },
            },
          },
        }}
      />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};


const EmployeeStatsSection = () => {

  const [employeeSummary, setEmployeeSummary] = useState({
    total_employees: 0,
    pilots: 0,
    crew: 0,
    ground: 0,
  });

  useEffect(() => {
    const fetchEmployeeSummary = async () => {
      const session = await getSession();
      const token = session?.accessToken;
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employees/dashboard/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setEmployeeSummary(data);
      } catch (error) {
        console.error('Error al obtener resumen de empleados:', error);
      }
    };

    fetchEmployeeSummary();
  }, []);
  return (
    <section className="mt-10" id="employee-stats-report">
    <div className="flex items-center justify-between mb-4 px-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Resumen de Empleados</h2>
    </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Empleados Totales</h3>
          <p className="text-3xl font-bold text-gray-900">{employeeSummary.total_employees.toLocaleString()}</p>
          <p className="text-green-600 text-sm">Empleados en general</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Pilotos</h3>
          <p className="text-3xl font-bold mb-1">{employeeSummary.pilots.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">Especialistas en aviación</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Tripulantes</h3>
          <p className="text-2xl font-bold text-gray-900">{employeeSummary.crew.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">Tripulantes de cabina de pasajeros</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Personla de tierra</h3>
          <p className="text-2xl font-bold text-gray-900">{employeeSummary.ground.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">Especialistas en seguridad aeronautica</p>
        </div>
      </div>
    </section>
  );
};

const AdminDashboardPage = () => {
  
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'administrator') {
      router.push('/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <p className="text-center mt-20">Cargando...</p>;
  }

  return (
    <section className="mt-24 p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Bienvenido, {session?.user.name || session?.user.username}
      </h1>

      <FlightPerformanceSection />
      <FinancialSummarySection />
      <PassengerStatsSection />
      <EmployeeStatsSection />
      <section className="mt-16 p-6 bg-white rounded shadow" id="generate-reports">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Generar Reportes (PDFs)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => console.log('Botón presionado')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Reporte de Vuelos
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Reporte Financiero
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Reporte de Pasajeros
          </button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            Reporte de Empleados
          </button>
        </div>
      </section>
    </section>

    
  );
};

export default AdminDashboardPage;
