"use client"

import { useSearchParams } from "next/navigation"
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"

const SearchSummary = () => {
  const searchParams = useSearchParams()

  // Obtener parámetros de búsqueda (en una implementación real)
  // En este caso usamos valores predeterminados
  const origen = searchParams.get("origin") || "Ciudad de México"
  const destino = searchParams.get("destination") || "Cancún"
  const fechaSalida = searchParams.get("departureDate") || "2023-12-15"
  const fechaRegreso = searchParams.get("returnDate") || "2023-12-22"
  const pasajeros = searchParams.get("passengers") || "2"


  // Formatear fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Resultados de búsqueda</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-start">
          <MapPinIcon className="w-5 h-5 text-primary mr-2 mt-1" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Origen</p>
            <p className="font-medium text-gray-800 dark:text-white">{origen}</p>
          </div>
        </div>

        <div className="flex items-start">
          <MapPinIcon className="w-5 h-5 text-primary mr-2 mt-1" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Destino</p>
            <p className="font-medium text-gray-800 dark:text-white">{destino}</p>
          </div>
        </div>

        <div className="flex items-start">
          <CalendarIcon className="w-5 h-5 text-primary mr-2 mt-1" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fechas</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {formatDate(fechaSalida)} - {formatDate(fechaRegreso)}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <UsersIcon className="w-5 h-5 text-primary mr-2 mt-1" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pasajeros</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {pasajeros} {Number.parseInt(pasajeros) === 1 ? "pasajero" : "pasajeros"}
            </p>
          </div>
        </div>
      </div>

      <button className="mt-4 text-primary hover:text-primary/80 text-sm font-medium flex items-center">
        Modificar búsqueda
      </button>
    </div>
  )
}

export default SearchSummary
