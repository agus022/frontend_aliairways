'use client';
import { useSession, getSession} from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bar,Doughnut } from 'react-chartjs-2';
import {Chart as ChartJS,BarElement,CategoryScale,LinearScale,Tooltip,Legend,} from 'chart.js';
import { ArcElement } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale,ArcElement, Tooltip, Legend);

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
        const res = await fetch(`http://localhost:3000/api/v1/flights/dashboard/kpis?range=${filter}`, {
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

        const res = await fetch('http://localhost:3000/api/v1/flights/dashboard/current-flights', {
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

      const res = await fetch(`http://localhost:3000/api/v1/flights/dashboard/flights-count`, {
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

      const res = await fetch(`http://localhost:3000/api/v1/flights/dashboard/flights-over-time?range=${filter}`, {
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
    <section className="mt-10">
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
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Grafica 1</h3>
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
  return (
    <section className="mt-10">
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
          <p className="text-3xl font-bold text-gray-900">$1,200,000</p>
          <p className="text-green-600 text-sm">Generado por vuelos</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Gastos Totales</h3>
          <p className="text-3xl font-bold text-red-500">$850,000</p>
          <p className="text-gray-600 text-sm">Costo operativo general</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Gastos por Empleados</h3>
          <p className="text-2xl font-bold text-gray-900">$350,000</p>
          <p className="text-gray-600 text-sm">Salarios y beneficios</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Combustible y Mantenimiento</h3>
          <p className="text-2xl font-bold text-gray-900">$500,000</p>
          <p className="text-gray-600 text-sm">Costos técnicos</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Comparación de Ingresos vs Gastos</h3>
        <div className="h-60 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          [ Gráfica de barras de ingresos vs gastos ]
        </div>
      </div>
    </section>
  );
};

const PassengerStatsSection = () => {
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');

  return (
    <section className="mt-10">
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
              {filter === 'day' ? '53,500' : filter === 'week' ? '325,000' : '1.2M'}
            </p>
            <p className="text-green-600 text-sm mt-1">
              ↑ {filter === 'day' ? '13%' : filter === 'week' ? '10%' : '15%'} vs periodo anterior
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Factor de Carga Promedio</p>
            <p className="text-3xl font-bold text-blue-600">
              {filter === 'day' ? '89.1%' : filter === 'week' ? '87.5%' : '85.3%'}
            </p>
            <p className="text-green-600 text-sm mt-1">
              ↑ {filter === 'day' ? '8%' : filter === 'week' ? '6%' : '5%'}
            </p>
          </div>
          
        </div>

        <div className="bg-white p-6 rounded shadow col-span-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Pasajeros a lo largo del tiempo
          </h3>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
            [ Gráfica de barras ]
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow col-span-1">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Pasajeros por Clase
        </h3>
        <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
          [ Gráfica circular: Económica, Ejecutiva, Primera ]
        </div>
      </div>
      </div>
    </section>
  );
};


const EmployeeStatsSection = () => {
  return (
    <section className="mt-10">
    <div className="flex items-center justify-between mb-4 px-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Resumen de Empleados</h2>
    </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Empleados Totales</h3>
          <p className="text-3xl font-bold text-gray-900">1,200</p>
          <p className="text-green-600 text-sm">Empleados en general</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Pilotos</h3>
          <p className="text-3xl font-bold text-red-500">200</p>
          <p className="text-gray-600 text-sm">Especialistas en aviación</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Tripulantes</h3>
          <p className="text-2xl font-bold text-gray-900">800</p>
          <p className="text-gray-600 text-sm">Tripulantes de cabina de pasajeros</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm text-gray-500 mb-1">Personla de tierra</h3>
          <p className="text-2xl font-bold text-gray-900">200</p>
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
    </section>
  );
};

export default AdminDashboardPage;
