'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const FlightPerformanceSection = () => {
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');

  return (
    <section className="mt-10">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow col-span-1 flex flex-col justify-between">
          <div className="mb-8">
            <h3 className="text-gray-500 text-sm mb-1">Vuelos Totales ({filter})</h3>
            <p className="text-4xl font-bold text-gray-900">
              {filter === 'day' ? '342' : filter === 'week' ? '2,450' : '9,820'}
            </p>
            <p className="text-green-600 text-sm mt-1">
              ↑ {filter === 'day' ? '5%' : filter === 'week' ? '8%' : '11%'} vs periodo anterior
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Vuelos Puntuales</p>
                <p className="font-semibold text-green-600">
                  {filter === 'day' ? '92%' : filter === 'week' ? '89%' : '87%'}
                </p>
              </div>
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">
                  {filter === 'day' ? '92%' : filter === 'week' ? '89%' : '87%'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Vuelos Cancelados</p>
                <p className="font-semibold text-red-500">
                  {filter === 'day' ? '3%' : filter === 'week' ? '4%' : '5%'}
                </p>
              </div>
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-red-500">
                  {filter === 'day' ? '3%' : filter === 'week' ? '4%' : '5%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow col-span-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Vuelos por {filter === 'day' ? 'Hora' : filter === 'week' ? 'Día' : 'Semana'}
          </h3>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
            [ Gráfica de barras ]
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow col-span-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribución de Vuelos</h3>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
            [ Gráfica comparativa ]
          </div>
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
            Comparación de Factor de Carga
          </h3>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
            [ Gráfico apilado ]
          </div>
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
      <PassengerStatsSection />
    </section>
  );
};

export default AdminDashboardPage;
