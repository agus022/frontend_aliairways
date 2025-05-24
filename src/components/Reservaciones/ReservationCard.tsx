import { MapPin, Plane, Users } from "lucide-react"
import type { ReservationWithFlight } from "@/types/reservation"

interface ReservationCardProps {
  reservation: ReservationWithFlight
}

export default function ReservationCard({ reservation }: ReservationCardProps) {
  const { flight, passenger, status, createdAt } = reservation

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "pending":
        return "Pendiente"
      case "cancelled":
        return "Cancelada"
      default:
        return "Desconocido"
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{flight.flightNumber}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {getStatusText(status)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Reservación: ALI-{reservation.id.slice(0, 6).toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(flight.price + flight.taxes).toLocaleString()} {flight.currency}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Precio total</p>
          </div>
        </div>

        {/* Flight Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{flight.departureCity}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{flight.departureAirport}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{flight.departureTime}</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center">
              <Plane className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {Math.floor(flight.durationMinutes / 60)}h {flight.durationMinutes % 60}m
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {flight.stops === 0 ? "Directo" : `${flight.stops} escala${flight.stops > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{flight.arrivalCity}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{flight.arrivalAirport}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{flight.arrivalTime}</p>
            </div>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Pasajero</span>
          </div>
          <p className="text-gray-900 dark:text-white font-medium">
            {passenger.firstName} {passenger.lastName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{passenger.email}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
            Ver Detalles
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
            Check-in
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition duration-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
            Modificar
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
