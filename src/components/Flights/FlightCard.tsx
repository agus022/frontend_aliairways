import Link from "next/link"
import Image from "next/image"
import type { Flight } from "../../types/flight"

interface FlightCardProps {
  flight: Flight
}

const FlightCard = ({ flight }: FlightCardProps) => {
  // Formatear duración del vuelo
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        {/* Aerolínea y número de vuelo */}
        <div className="flex items-center mb-4 md:mb-0 md:w-1/5">
          <div className="w-12 h-12 relative mr-3">
            <Image
              src={flight.airlineLogo || "/placeholder.svg"}
              alt={flight.airline}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{flight.airline}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Horarios y aeropuertos */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:w-2/5">
          <div className="text-center mb-2 md:mb-0">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {new Date(flight.departureTime).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{flight.departureAirport}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{flight.departureCity}</p>
          </div>

          <div className="flex flex-col items-center mx-4 my-2 md:my-0">
            <div className="text-xs text-gray-500 dark:text-gray-400">{formatDuration(flight.durationMinutes)}</div>
            <div className="relative w-20 md:w-32">
              <div className="border-t-2 border-gray-300 dark:border-gray-600 w-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2">
                {flight.stops === 0 ? (
                  <span className="text-xs text-green-600 dark:text-green-400">Directo</span>
                ) : (
                  <span className="text-xs text-orange-600 dark:text-orange-400">
                    {flight.stops} escala{flight.stops > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {new Date(flight.arrivalTime).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{flight.arrivalAirport}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{flight.arrivalCity}</p>
          </div>
        </div>

        {/* Precio y botón de reserva */}
        <div className="flex flex-col items-end mt-4 md:mt-0 w-full md:w-1/5">
          <div className="mb-2 text-right">
            <p className="text-2xl font-bold text-primary">{formatPrice(flight.price, flight.currency)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Precio final con impuestos ({formatPrice(flight.taxes, flight.currency)})
            </p>
          </div>
          <Link
            href={`/reserva/${flight.id}`}
            className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Seleccionar
          </Link>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap justify-between text-sm">
          <div className="mr-4 mb-2">
            <span className="text-gray-500 dark:text-gray-400 mr-1">Avión:</span>
            <span className="text-gray-700 dark:text-gray-300">{flight.aircraft}</span>
          </div>
          <div className="mr-4 mb-2">
            <span className="text-gray-500 dark:text-gray-400 mr-1">Asientos disponibles:</span>
            <span className="text-gray-700 dark:text-gray-300">{flight.availableSeats}</span>
          </div>
          <div className="mb-2">
            <span className="text-gray-500 dark:text-gray-400 mr-1">Clase:</span>
            <span className="text-gray-700 dark:text-gray-300">Económica</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightCard
