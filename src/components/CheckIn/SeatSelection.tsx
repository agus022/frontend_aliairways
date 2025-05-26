"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Plane } from "lucide-react"
import { useSession } from 'next-auth/react';

interface Flight {
  reservation_id: number,
  flight_id: number,
  model: string,
  departure_time: string,
  arrival_time: string,
  origin_id: string,
  destination_id: string,
  departure_date: string,
  seat: string,
  class: string,
  full_name: string,
  email: string,
  phone: string,
  estado: string | null
}

interface Seat {
  seat_id: string
  available: boolean
  class: string
  cost: number
  position: 'window' | 'aisle' | 'middle'
}

interface SeatSelectionProps {
  onSeatSelect: (seat: string) => void
  onBack: () => void
  flighData: Flight
}

export default function SeatSelection({ onSeatSelect, onBack, flighData }: SeatSelectionProps) {
  const { data: session } = useSession();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)

  let aircraft_id;
  useEffect(() => {
    const fetchSeats = async () => {
      if (session?.user?.userId && session?.accessToken) {
        try {
          const res = await fetch(`http://localhost:3000/api/v1/seats/getSeatFlight/${flighData.flight_id}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          });
          const seatData = await res.json();
          aircraft_id=seatData[0].aircraft_id;
          setSeats(seatData);
        } catch (error) {
          console.error("Error al obtener los asientos:", error);
        }
      }
    }
    fetchSeats();
  }, [session, flighData]);

  const getSeatClass = (seatId: string) => {
    const seat = seats.find((s) => s.seat_id === seatId);
    if (!seat) return "unavailable";
    if (!seat.available) return "occupied";
    if (selectedSeat === seatId) return "selected";
    if (seat.class === "premium") return "premium";
    if (seat.class === "first") return "exit";
    return seat.position;
  }

  const getSeatColor = (seatClass: string) => {
    switch (seatClass) {
      case "unavailable":
        return "bg-gray-300 dark:bg-gray-600 cursor-not-allowed";
      case "occupied":
        return "bg-red-400 cursor-not-allowed";
      case "selected":
        return "bg-primary text-white";
      case "premium":
        return "bg-purple-200 dark:bg-purple-800 hover:bg-purple-300 dark:hover:bg-purple-700 cursor-pointer";
      case "exit":
        return "bg-yellow-200 dark:bg-yellow-800 hover:bg-yellow-300 dark:hover:bg-yellow-700 cursor-pointer";
      case "window":
        return "bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700 cursor-pointer";
      case "aisle":
        return "bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700 cursor-pointer";
      case "middle":
        return "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer";
      default:
        return "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer";
    }
  };

  const getSeatPrice = (seatId: string) => {
    const seat = seats.find((s) => s.seat_id === seatId);
    if (!seat) return "Desconocido";
    return `$${seat.cost} USD`;
  };
  const getSeatPosition = (seatId: string) => {
    const seat = seats.find((s) => s.seat_id === seatId);
    if (!seat) return "Desconocido";
    return `$${seat.position}`;
  };

  const handleSeatClick = (seatId: string) => {
    const seatClass = getSeatClass(seatId);
    if (seatClass === "unavailable" || seatClass === "occupied") return;
    setSelectedSeat(seatId);

  };

  const handleContinue = async () => {
  if (session?.user?.userId && session?.accessToken && selectedSeat && flighData?.flight_id) {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/seats/getSeatFlight/${flighData.flight_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          aircraft_id: aircraft_id,
          seat_id: selectedSeat
        })
      });

      if (!res.ok) {
        throw new Error("Error al actualizar el asiento.");
      }

      const updatedSeat = await res.json();
      console.log("Asiento actualizado:", updatedSeat);

      // ✅ Avanza al siguiente paso del check-in
      onSeatSelect(selectedSeat);

    } catch (error) {
      console.error("Error al actualizar el asiento:", error);
    }
  }
};


  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Selecciona tu asiento</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Elige tu asiento preferido en el {flighData.model}. Los asientos marcados en colores tienen tarifas especiales.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leyenda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* leyenda de colores */}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-300 dark:bg-gray-600 rounded-t-full w-32 h-8 flex items-center justify-center">
              <Plane className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 justify-center">
            {seats.map((seat) => {
              const seatClass = getSeatClass(seat.seat_id);
              return (
                <button
                  key={seat.seat_id}
                  onClick={() => handleSeatClick(seat.seat_id)}
                  className={`w-10 h-10 text-xs font-medium rounded ${getSeatColor(seatClass)} transition-colors`}
                  disabled={!seat.available}
                  title={`Asiento ${seat.seat_id} - ${getSeatPrice(seat.seat_id)}`}
                >
                  {seat.seat_id}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedSeat && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Asiento Seleccionado</h3>
          <p className="text-xl font-bold text-primary">{selectedSeat}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Precio: {getSeatPrice(selectedSeat)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Position: {getSeatPosition(selectedSeat)}
          </p>
        </div>
      )}

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
  );
}
