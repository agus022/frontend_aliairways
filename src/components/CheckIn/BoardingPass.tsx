"use client"

import { Download, ArrowLeft, Plane, Clock, QrCode } from "lucide-react"

interface BoardingPassProps {
  selectedSeat: string | null
  onBack: () => void
}

export default function BoardingPass({ selectedSeat, onBack }: BoardingPassProps) {
  // Mock boarding pass data
  const boardingPassData = {
    passenger: {
      name: "PEREZ/JUAN CARLOS",
      title: "Sr.",
    },
    flight: {
      number: "ALI2024",
      from: "MEX",
      to: "CUN",
      date: "15FEB24",
      departure: "14:30",
      arrival: "17:45",
      gate: "B12",
      terminal: "T2",
      aircraft: "Boeing 737-800",
    },
    reservation: {
      number: "ALI789456",
      class: "Y", // Economy
      zone: "2",
    },
    seat: selectedSeat || "12A",
    boardingTime: "13:45",
    sequence: "045",
  }

  const handleDownload = () => {
    // Aquí iría la lógica para generar y descargar el PDF
    console.log("Descargando pase de abordar...")
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">¡Check-in completado!</h2>
            <p className="text-gray-600 dark:text-gray-300">Tu pase de abordar está listo</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Información importante</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Llega al aeropuerto 2 horas antes para vuelos nacionales</li>
            <li>• Presenta tu pase de abordar y documento de identidad</li>
            <li>
              • Dirígete a la puerta {boardingPassData.flight.gate} en {boardingPassData.flight.terminal}
            </li>
            <li>• El abordaje inicia a las {boardingPassData.boardingTime}</li>
          </ul>
        </div>
      </div>

      {/* Boarding Pass */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden print:shadow-none">
        {/* Header with airline branding */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plane className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Ali Airways</h1>
                <p className="text-primary-100">Pase de Abordar</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-100">Vuelo</p>
              <p className="text-xl font-bold">{boardingPassData.flight.number}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Passenger and Flight Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Passenger Info */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Pasajero
                  </label>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{boardingPassData.passenger.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Reservación
                  </label>
                  <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                    {boardingPassData.reservation.number}
                  </p>
                </div>
              </div>

              {/* Flight Route */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{boardingPassData.flight.from}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ciudad de México</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                      {boardingPassData.flight.departure}
                    </p>
                  </div>

                  <div className="flex-1 mx-6">
                    <div className="relative">
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                      <Plane className="w-5 h-5 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800" />
                    </div>
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {boardingPassData.flight.date}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{boardingPassData.flight.to}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cancún</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                      {boardingPassData.flight.arrival}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center lg:border-l lg:border-gray-200 lg:dark:border-gray-700 lg:pl-6">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Código QR para acceso rápido</p>
            </div>
          </div>

          {/* Boarding Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Asiento
                </label>
                <p className="text-xl font-bold text-primary">{boardingPassData.seat}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Puerta
                </label>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{boardingPassData.flight.gate}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Terminal
                </label>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{boardingPassData.flight.terminal}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Zona
                </label>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{boardingPassData.reservation.zone}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Clase
                </label>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{boardingPassData.reservation.class}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Secuencia
                </label>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{boardingPassData.sequence}</p>
              </div>
            </div>
          </div>

          {/* Boarding Time */}
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-200">
                  Abordaje: {boardingPassData.boardingTime}
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">Preséntate en la puerta 30 minutos antes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Cambiar asiento
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-md hover:bg-primary/10 transition duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Imprimir
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
        >
          <Download className="w-5 h-5" />
          Descargar PDF
        </button>
      </div>
    </div>
  )
}
