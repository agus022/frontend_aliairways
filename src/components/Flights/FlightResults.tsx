"use client"

import { useState } from "react"
import FlightCard from "./FlightCard"
import { mockFlights } from "./mockData"

const FlightResults = () => {
  const [sortBy, setSortBy] = useState("price")

  // Ordenar vuelos según el criterio seleccionado
  const sortedFlights = [...mockFlights].sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price
    } else if (sortBy === "duration") {
      return a.durationMinutes - b.durationMinutes
    } else if (sortBy === "departure") {
      return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
    }
    return 0
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{mockFlights.length} vuelos encontrados</h2>
        <div className="flex items-center">
          <span className="mr-2 text-gray-600 dark:text-gray-300">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="price">Precio (menor a mayor)</option>
            <option value="duration">Duración (más corto primero)</option>
            <option value="departure">Hora de salida (más temprano)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  )
}

export default FlightResults
