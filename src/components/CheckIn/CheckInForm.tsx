"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import FlightConfirmation from "./FlightConfirmation"
import SeatSelection from "./SeatSelection"
import BoardingPass from "./BoardingPass"

type CheckInStep = "search" | "confirm" | "seat" | "boarding"

export default function CheckInForm() {
  const [currentStep, setCurrentStep] = useState<CheckInStep>("search")
  const [searchType, setSearchType] = useState<"reservation" | "passenger">("reservation")
  const [formData, setFormData] = useState({
    reservationNumber: "",
    lastName: "",
    firstName: "",
    email: "",
  })
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular búsqueda exitosa
    setCurrentStep("confirm")
  }

  const handleConfirmFlight = () => {
    setCurrentStep("seat")
  }

  const handleSeatSelection = (seat: string) => {
    setSelectedSeat(seat)
    setCurrentStep("boarding")
  }

  const handleBackToSearch = () => {
    setCurrentStep("search")
  }

  if (currentStep === "confirm") {
    return <FlightConfirmation onConfirm={handleConfirmFlight} onBack={handleBackToSearch} />
  }

  if (currentStep === "seat") {
    return <SeatSelection onSeatSelect={handleSeatSelection} onBack={() => setCurrentStep("confirm")} />
  }

  if (currentStep === "boarding") {
    return <BoardingPass selectedSeat={selectedSeat} onBack={() => setCurrentStep("seat")} />
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
