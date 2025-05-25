import { Calendar, Clock, MapPin, Download, CreditCard } from "lucide-react"

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

interface FlightHistoryCardProps {
  flight: Flight;
}

export default function FlightHistoryCard({ flight }: FlightHistoryCardProps) {
  const statusColors = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const statusLabels = {
    completed: "Completado",
    cancelled: "Cancelado",
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Flight Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{flight.flightNumber}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[flight.status]}`}>
              {statusLabels[flight.status]}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{flight.route}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{flight.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">
                {flight.time} • {flight.duration}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">${flight.totalPaid.toLocaleString()} MXN</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Referencia: {flight.bookingReference}</span>
            <span>Aeronave: {flight.aircraft}</span>
            <span>Millas: {flight.miles.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            Descargar Boleto
          </button>

          {flight.status === "completed" && (
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
              Ver Detalles
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
