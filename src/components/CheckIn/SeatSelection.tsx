"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Plane } from "lucide-react"

interface SeatSelectionProps {
  onSeatSelect: (seat: string) => void
  onBack: () => void
}

export default function SeatSelection({ onSeatSelect, onBack }: SeatSelectionProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)

  // Boeing 737-800 seat map (typical configuration)
  const seatMap = {
    rows: 32,
    seatsPerRow: 6,
    aisleAfter: 3, // Aisle after seat C
    exitRows: [6, 7, 15, 16], // Emergency exit rows
    premiumRows: [1, 2, 3], // Premium economy
    unavailableSeats: ["1A", "1F", "3C", "3D", "12B", "18E", "25A", "30F"],
    occupiedSeats: ["2A", "2B", "4D", "5F", "8A", "8B", "8C", "10D", "10E", "12A", "15C", "20B", "22F", "28A"],
  }

  const getSeatClass = (row: number, seat: string) => {
    const seatId = `${row}${seat}`

    if (seatMap.unavailableSeats.includes(seatId)) return "unavailable"
    if (seatMap.occupiedSeats.includes(seatId)) return "occupied"
    if (selectedSeat === seatId) return "selected"
    if (seatMap.premiumRows.includes(row)) return "premium"
    if (seatMap.exitRows.includes(row)) return "exit"
    if (seat === "A" || seat === "F") return "window"
    if (seat === "C" || seat === "D") return "aisle"
    return "middle"
  }

  const getSeatColor = (seatClass: string) => {
    switch (seatClass) {
      case "unavailable":
        return "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
      case "occupied":
        return "bg-red-400 cursor-not-allowed"
      case "selected":
        return "bg-primary text-white"
      case "premium":
        return "bg-purple-200 dark:bg-purple-800 hover:bg-purple-300 dark:hover:bg-purple-700 cursor-pointer"
      case "exit":
        return "bg-yellow-200 dark:bg-yellow-800 hover:bg-yellow-300 dark:hover:bg-yellow-700 cursor-pointer"
      case "window":
        return "bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700 cursor-pointer"
      case "aisle":
        return "bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700 cursor-pointer"
      case "middle":
        return "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
      default:
        return "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
    }
  }

  const handleSeatClick = (row: number, seat: string) => {
    const seatId = `${row}${seat}`
    const seatClass = getSeatClass(row, seat)

    if (seatClass === "unavailable" || seatClass === "occupied") return

    setSelectedSeat(seatId)
  }

  const handleContinue = () => {
    if (selectedSeat) {
      onSeatSelect(selectedSeat)
    }
  }

  const getSeatPrice = (row: number) => {
    if (seatMap.premiumRows.includes(row)) return "$25 USD"
    if (seatMap.exitRows.includes(row)) return "$15 USD"
    return "Gratis"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Selecciona tu asiento</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Elige tu asiento preferido en el Boeing 737-800. Los asientos marcados en colores tienen tarifas especiales.
        </p>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leyenda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Seleccionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Ocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-200 dark:bg-purple-800 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Premium (+$25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-800 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Salida emergencia (+$15)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">No disponible</span>
          </div>
        </div>
      </div>

      {/* Seat Map */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="max-w-md mx-auto">
          {/* Aircraft nose */}
          <div className="flex justify-center mb-4">
            <div className="bg-gray-300 dark:bg-gray-600 rounded-t-full w-32 h-8 flex items-center justify-center">
              <Plane className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>

          {/* Seat rows */}
          <div className="space-y-2">
            {Array.from({ length: seatMap.rows }, (_, i) => i + 1).map((row) => (
              <div key={row} className="flex items-center justify-center gap-1">
                {/* Row number */}
                <div className="w-6 text-center text-xs font-medium text-gray-600 dark:text-gray-400">{row}</div>

                {/* Seats A, B, C */}
                <div className="flex gap-1">
                  {["A", "B", "C"].map((seat) => {
                    const seatClass = getSeatClass(row, seat)
                    return (
                      <button
                        key={seat}
                        onClick={() => handleSeatClick(row, seat)}
                        className={`w-8 h-8 text-xs font-medium rounded ${getSeatColor(seatClass)} transition-colors`}
                        disabled={seatClass === "unavailable" || seatClass === "occupied"}
                        title={`${row}${seat} - ${getSeatPrice(row)}`}
                      >
                        {seat}
                      </button>
                    )
                  })}
                </div>

                {/* Aisle */}
                <div className="w-4"></div>

                {/* Seats D, E, F */}
                <div className="flex gap-1">
                  {["D", "E", "F"].map((seat) => {
                    const seatClass = getSeatClass(row, seat)
                    return (
                      <button
                        key={seat}
                        onClick={() => handleSeatClick(row, seat)}
                        className={`w-8 h-8 text-xs font-medium rounded ${getSeatColor(seatClass)} transition-colors`}
                        disabled={seatClass === "unavailable" || seatClass === "occupied"}
                        title={`${row}${seat} - ${getSeatPrice(row)}`}
                      >
                        {seat}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Seat Info */}
      {selectedSeat && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Asiento Seleccionado</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-primary">{selectedSeat}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Precio: {getSeatPrice(Number.parseInt(selectedSeat))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Tipo de asiento</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {seatMap.premiumRows.includes(Number.parseInt(selectedSeat))
                  ? "Premium Economy"
                  : seatMap.exitRows.includes(Number.parseInt(selectedSeat))
                    ? "Salida de Emergencia"
                    : selectedSeat.includes("A") || selectedSeat.includes("F")
                      ? "Ventana"
                      : selectedSeat.includes("C") || selectedSeat.includes("D")
                        ? "Pasillo"
                        : "Centro"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedSeat}
          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-md transition duration-300"
        >
          Continuar al pase de abordar
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
