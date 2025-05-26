'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Download, Filter, Search } from 'lucide-react';
import FlightHistoryCard from './FlightHistoryCard';

interface Flight {
  id: number;
  flightNumber: number;
  route: string;
  date: string;
  time: string;
  status: string;
  totalPaid: number;
  bookingReference: number;
  aircraft: string;
  duration: string;
  miles: number;
}

export default function FlightHistory() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [flightSummary, setFlightSummary] = useState({ accumulated_flights: 0, sum: '0.00' });
  const [flightHistory, setFlightHistory] = useState<Flight[]>([]);

  useEffect(() => {
    if (session?.user?.userId && session?.accessToken) {
      const fetchFlightSummary = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/v1/passengers/historial/${session.user.userId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFlightSummary(data[0]);
          }
        } catch (err) {
          console.error('Error al obtener el resumen de vuelos', err);
        }
      };

      const fetchFlightHistory = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/v1/passengers/historialFlights/${session.user.userId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          const data = await res.json();
          if (!Array.isArray(data)) {
            console.error('Respuesta inesperada, no es un arreglo:', data);
            setFlightHistory([]);
            return;
          }

          const transformed = data.map((flight: any) => ({
            id: flight.reservation_id,
            flightNumber: flight.flight_id,
            route: `${flight.origin} - ${flight.destination}`,
            date: flight.departure_date,
            time: flight.departure_time,
            status: flight.status,
            totalPaid: parseFloat(flight.cost),
            bookingReference: flight.reservation_id,
            aircraft: flight.model,
            duration: flight.formatted_duration,
            miles: 0,
          }));

          setFlightHistory(transformed);
        } catch (err) {
          console.error('Error al obtener historial de vuelos', err);
        }
      };

      fetchFlightSummary();
      fetchFlightHistory();
    } else {
      console.log('No hay usuario');
    }
  }, [session]);

  const filteredFlights = flightHistory
    .filter((flight) =>
      flight.flightNumber.toString().includes(searchTerm) ||
      flight.route.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((flight) => filterYear === 'all' || flight.date.startsWith(filterYear))
    .filter((flight) => filterStatus === 'all' || flight.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Vuelos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {flightSummary.accumulated_flights}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Gastado</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${parseFloat(flightSummary.sum).toLocaleString()} MXN
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Download className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Millas Acumuladas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12,450</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Filter className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número de vuelo o ruta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los años</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Completado</option>
              <option value="active">Activo</option>
              <option value="delayed">Retrasado</option>
              <option value="cancelled">Cancelado</option>
              <option value="resolved">Resuelto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Historial de Vuelos */}
      <div className="space-y-4">
        {filteredFlights.length > 0 ? (
          filteredFlights.map((flight) => (
            <FlightHistoryCard key={flight.id} flight={flight} />
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-700">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No se encontraron vuelos</h3>
            <p className="text-gray-600 dark:text-gray-300">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
