"use client"

import { useEffect,useState } from "react"
import FlightCard from "./FlightCard"
import { mockFlights } from "./mockData"
import { useSearchParams } from "next/navigation"

const FlightResults = () => {
  const searchParams = useSearchParams()
  const [flights, setFlights] = useState([])
  const [sortBy, setSortBy] = useState("price")
  const [loading, setLoading] = useState(true)
  // Obtener parámetros de búsqueda desde la URL
  const origin = searchParams.get("origin") || ""
  const destination = searchParams.get("destination") || ""
  const departureDate = searchParams.get("departureDate") || ""
  const returnDate = searchParams.get("returnDate") || ""
  const passengers = searchParams.get("passengers") || "1"

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams({
          origin,
          destination,
          departureDate,
          returnDate,
          passengers,
        })

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/search/flights?${query.toString()}`)
        const data = await response.json()
        console.log(data);
        setFlights(
        (data || []).map((f, index) => ({
          id: `flight-${f.id ?? index}`,
          airline: f.airline,
          airlineLogo: f.airlinelogo,
          flightNumber: f.flightnumber,
          departureTime: f.departuretime,
          arrivalTime: f.arrivaltime,
          departureAirport: f.departureairport,
          arrivalAirport: f.arrivalairport,
          departureCity: f.departurecity,
          arrivalCity: f.arrivalcity,
          price: parseFloat(f.price),
          taxes: Number(f.taxes),
          currency: f.currency,
          durationMinutes: Math.max(0, parseFloat(f.durationminutes)),
          stops: Number(f.stops),
          aircraft: f.aircraft,
          availableSeats: parseInt(f.availableseats),
        }))
      )
// `data.flights` depende de tu API
        console.log("fligths-------------")
      } catch (error) {
        console.error("Error al buscar vuelos:", error)
        setFlights([])
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
  }, [origin, destination, departureDate, returnDate, passengers])
  // Ordenar vuelos según el criterio seleccionado
  const sortedFlights = [...flights].sort((a, b) => {
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
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{flights.length} vuelos encontrados</h2>
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
