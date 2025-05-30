"use client"
import { CalendarDays, Clock, Plane, MapPin, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

interface FlightSummaryProps {
  flightId: number
}

const FlightSummary = ({ flightId }: FlightSummaryProps) => {
  const [flight, setFlight] = useState<any>(null)
  const [origin, setOrigin] = useState<any>(null)
  const [destination, setDestination] = useState<any>(null)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const resData = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/${flightId}`)
        const flightData = await resData.json()
        setFlight(flightData)

        const resOrigin = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/airports/${flightData.origin_id}`)
        const originData = await resOrigin.json()
        setOrigin(originData)

        const resDest = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/airports/${flightData.destination_id}`)
        const destinationData = await resDest.json()
        setDestination(destinationData)
      } catch (error) {
        console.error("Error al cargar los datos:", error)
      }
    }

    fetchAllData()
  }, [flightId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(":")
    return `${hour}:${minute}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price)
  }

  if (!flight || !origin || !destination) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Cargando información del vuelo...</div>
  }

  return (
    <div className="w-full bg-gradient-to-br from-sky-900 to-indigo-800 text-white py-8 px-4 md:px-16 shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center">Resumen del Vuelo</h2>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center text-cyan-300">
            <CalendarDays className="w-6 h-6 mr-3" />
            <span className="text-lg">{formatDate(flight.departure_date)}</span>
          </div>

          <div className="flex items-center text-cyan-300">
            <Clock className="w-6 h-6 mr-3" />
            <span className="text-lg">{formatTime(flight.departure_time)} — {formatTime(flight.arrival_time)}</span>
          </div>

          <div className="flex items-center text-cyan-300">
            <Plane className="w-6 h-6 mr-3" />
            <span className="text-lg">Avión #{flight.aircraft_id}</span>
          </div>

          <div className="flex items-center text-cyan-300">
            <DollarSign className="w-6 h-6 mr-3" />
            <span className="text-lg font-semibold">{formatPrice(Number(flight.cost))}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <MapPin className="w-6 h-6 mx-auto text-pink-300" />
              <p className="mt-1 text-sm font-semibold">{origin.name}</p>
              <p className="text-xs text-pink-200">{origin.code}</p>
            </div>

            <div className="flex flex-col items-center text-white">
              <div className="w-1 h-8 bg-white rounded-full"></div>
              <Plane className="w-6 h-6 rotate-90" />
              <div className="w-1 h-8 bg-white rounded-full"></div>
            </div>

            <div className="text-center">
              <MapPin className="w-6 h-6 mx-auto text-pink-300" />
              <p className="mt-1 text-sm font-semibold">{destination.name}</p>
              <p className="text-xs text-pink-200">{destination.code}</p>
            </div>
          </div>

          <div className="mt-6 text-sm italic text-center w-full text-gray-200">
            Estado del vuelo: <span className="font-bold capitalize">{flight.status}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightSummary
