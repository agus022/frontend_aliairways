"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const FlightFilters = () => {
  const [priceRange, setPriceRange] = useState([1000, 10000])
  const [departureTimeFilter, setDepartureTimeFilter] = useState<string[]>([])
  const [airlinesFilter, setAirlinesFilter] = useState<string[]>([])
  const [stopsFilter, setStopsFilter] = useState<number[]>([])

  // Toggle para secciones de filtros
  const [showPriceFilter, setShowPriceFilter] = useState(true)
  const [showTimeFilter, setShowTimeFilter] = useState(true)
  const [showAirlineFilter, setShowAirlineFilter] = useState(true)
  const [showStopsFilter, setShowStopsFilter] = useState(true)

  // Manejadores para filtros
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange([Number.parseInt(e.target.min), Number.parseInt(e.target.value)])
  }

  const handleDepartureTimeToggle = (time: string) => {
    setDepartureTimeFilter((prev) => (prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]))
  }

  const handleAirlineToggle = (airline: string) => {
    setAirlinesFilter((prev) => (prev.includes(airline) ? prev.filter((a) => a !== airline) : [...prev, airline]))
  }

  const handleStopsToggle = (stops: number) => {
    setStopsFilter((prev) => (prev.includes(stops) ? prev.filter((s) => s !== stops) : [...prev, stops]))
  }

  // Datos de muestra para filtros
  const airlines = ["Ali Airways", "Aeroméxico", "Volaris", "VivaAerobus", "Interjet"]

  const timeSlots = [
    { label: "Mañana (00:00 - 11:59)", value: "morning" },
    { label: "Tarde (12:00 - 17:59)", value: "afternoon" },
    { label: "Noche (18:00 - 23:59)", value: "evening" },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Filtros</h2>

      {/* Filtro de precio */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => setShowPriceFilter(!showPriceFilter)}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Precio</h3>
          {showPriceFilter ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {showPriceFilter && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">MXN {priceRange[0]}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">MXN {priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="100"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        )}
      </div>

      {/* Filtro de horario de salida */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => setShowTimeFilter(!showTimeFilter)}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Horario de salida</h3>
          {showTimeFilter ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {showTimeFilter && (
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <div key={slot.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`time-${slot.value}`}
                  checked={departureTimeFilter.includes(slot.value)}
                  onChange={() => handleDepartureTimeToggle(slot.value)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor={`time-${slot.value}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {slot.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filtro de aerolíneas */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => setShowAirlineFilter(!showAirlineFilter)}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Aerolíneas</h3>
          {showAirlineFilter ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {showAirlineFilter && (
          <div className="space-y-2">
            {airlines.map((airline) => (
              <div key={airline} className="flex items-center">
                <input
                  type="checkbox"
                  id={`airline-${airline.toLowerCase().replace(/\s/g, "-")}`}
                  checked={airlinesFilter.includes(airline)}
                  onChange={() => handleAirlineToggle(airline)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor={`airline-${airline.toLowerCase().replace(/\s/g, "-")}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  {airline}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filtro de escalas */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => setShowStopsFilter(!showStopsFilter)}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Escalas</h3>
          {showStopsFilter ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {showStopsFilter && (
          <div className="space-y-2">
            {[0, 1, 2].map((stops) => (
              <div key={stops} className="flex items-center">
                <input
                  type="checkbox"
                  id={`stops-${stops}`}
                  checked={stopsFilter.includes(stops)}
                  onChange={() => handleStopsToggle(stops)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor={`stops-${stops}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {stops === 0 ? "Directo" : stops === 1 ? "1 escala" : `${stops} escalas`}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón para aplicar filtros */}
      <button className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
        Aplicar filtros
      </button>
    </div>
  )
}

export default FlightFilters
