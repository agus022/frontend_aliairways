"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Search } from "lucide-react"
import FlightConfirmation from "./FlightConfirmation"
import SeatSelection from "./SeatSelection"
import BoardingPass from "./BoardingPass"

type CheckInStep = "search" | "confirm" | "seat" | "boarding"

interface Flight {
  reservation_id: number
  flight_id: number
  model: string
  departure_time: string
  arrival_time: string
  origin_id: string
  destination_id: string
  departure_date: string
  seat: string
  class: string
  full_name: string
  email: string
  phone: string
  estado: string | null
}

export default function CheckInForm() {
  const searchParams = useSearchParams()
  const reservationIdFromURL = searchParams.get("reservation_id") || ""
  const lastNameFromURL = searchParams.get("last_name") || ""

  const { data: session } = useSession()
  const [flightData, setFlightData] = useState<Flight | null>(null)
  const [currentStep, setCurrentStep] = useState<CheckInStep>("search")
  const [searchType, setSearchType] = useState<"reservation" | "passenger">("reservation")
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    reservationNumber: reservationIdFromURL,
    lastName: lastNameFromURL,
    firstName: "",
    email: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (session?.user?.userId && session?.accessToken) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/checkins/getData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            id_reservation: formData.reservationNumber,
            last_name: formData.lastName,
          }),
        })

        if (!response.ok) {
          throw new Error("Error al obtener datos de la reserva.")
        }

        const raw = await response.json()

        const mappedData: Flight = {
          reservation_id: raw.reservation_id,
          flight_id: raw.flight_id,
          model: raw.model,
          departure_time: raw.departure_time,
          arrival_time: raw.arrival_time,
          origin_id: raw.origin_id,
          destination_id: raw.destination_id,
          departure_date: raw.departure_date,
          seat: raw.seat,
          class: raw.class,
          full_name: raw.full_name,
          email: raw.email,
          phone: raw.phone,
          estado: raw.estado ?? null,
        }

        if (mappedData.estado === null) {
          setFlightData(mappedData)
          setCurrentStep("confirm")
        } else {
          alert("Este vuelo ya fue registrado para check-in.")
        }
      } catch (error) {
        console.error("Error:", error)
        alert("No se pudo completar la búsqueda. Verifica los datos.")
      }
    }
  }

  const handleConfirmFlight = () => {
    if (flightData?.seat === null) {
      setCurrentStep("seat")
    } else {
      setCurrentStep("boarding")
    }
  }

  const handleSeatSelection = (seat: string) => {
    setSelectedSeat(seat)
    setCurrentStep("boarding")
  }

  const handleBackToSearch = () => setCurrentStep("search")

  if (currentStep === "confirm") {
    return (
      <FlightConfirmation
        CheckData={flightData}
        onConfirm={handleConfirmFlight}
        onBack={handleBackToSearch}
      />
    )
  }

  if (currentStep === "seat") {
    return (
      <SeatSelection
        flighData={flightData}
        onSeatSelect={handleSeatSelection}
        onBack={() => setCurrentStep("confirm")}
      />
    )
  }

  if (currentStep === "boarding") {
    return (
      <BoardingPass
        flightData={flightData}
        lastName={formData.lastName}
        selectedSeat={selectedSeat}
        onBack={() => setCurrentStep("seat")}
      />
    )
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Buscar tu reservación</h2>

      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setSearchType("reservation")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            searchType === "reservation"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Por número de reservación
        </button>
        <button
          onClick={() => setSearchType("passenger")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            searchType === "passenger"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Por datos del pasajero
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {searchType === "reservation" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de reservación
              </label>
              <input
                type="text"
                placeholder="ALI-123456"
                value={formData.reservationNumber}
                onChange={(e) => setFormData({ ...formData, reservationNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Apellido del pasajero
              </label>
              <input
                type="text"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
              <input
                type="text"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellido</label>
              <input
                type="text"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-md transition duration-300 flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          Buscar mi vuelo
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Información importante</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• El check-in online está disponible desde 24 horas antes del vuelo</li>
          <li>• Puedes realizar check-in hasta 2 horas antes de vuelos nacionales</li>
          <li>• Para vuelos internacionales, hasta 3 horas antes</li>
          <li>• Asegúrate de tener tu documentación en regla</li>
        </ul>
      </div>
    </div>
  )
}
