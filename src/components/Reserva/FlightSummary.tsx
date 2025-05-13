import type { Flight } from "@/types/flight"
import { CalendarDays, Clock, Plane } from "lucide-react"

interface FlightSummaryProps {
  flight: Flight
  totalPrice: number
}

const FlightSummary = ({ flight, totalPrice }: FlightSummaryProps) => {
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Formatear hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Formatear duración
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Formatear precio
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Resumen del Vuelo</h2>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <CalendarDays className="w-5 h-5 text-primary mr-2" />
          <span className="text-gray-700 dark:text-gray-300">{formatDate(flight.departureTime)}</span>
        </div>

        <div className="flex items-start mt-4">
          <div className="min-w-[60px] text-right mr-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatTime(flight.departureTime)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{flight.departureAirport}</div>
          </div>

          <div className="flex flex-col items-center mx-2">
            <div className="h-full border-l-2 border-dashed border-gray-300 dark:border-gray-600"></div>
            <div className="my-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(flight.durationMinutes)}
            </div>
            <div className="h-full border-l-2 border-dashed border-gray-300 dark:border-gray-600"></div>
          </div>

          <div className="min-w-[60px] ml-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatTime(flight.arrivalTime)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{flight.arrivalAirport}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center mb-1">
            <Plane className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">
              {flight.airline} - {flight.flightNumber}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 ml-6">{flight.aircraft}</div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400">Tarifa base:</span>
          <span className="text-gray-800 dark:text-gray-200">{formatPrice(flight.price, flight.currency)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400">Impuestos y cargos:</span>
          <span className="text-gray-800 dark:text-gray-200">{formatPrice(flight.taxes, flight.currency)}</span>
        </div>
        <div className="flex justify-between font-bold mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-900 dark:text-white">Total:</span>
          <span className="text-primary">{formatPrice(totalPrice, flight.currency)}</span>
        </div>
      </div>
    </div>
  )
}

export default FlightSummary
