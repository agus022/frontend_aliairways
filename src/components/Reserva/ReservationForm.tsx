"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PassengerInfo from "./PassengerInfo"
import PaymentInfo from "./PaymentInfo"
import { useSession } from 'next-auth/react';

interface ReservationFormProps {
  flightId: number
}

const ReservationForm = ({ flightId }: ReservationFormProps) => {
  const { data: session } = useSession();
  const [seats, setSeats] = useState<any[]>([]);
  const [flight, setFlight] = useState<any>(null)
  const [selectedSeat, setSelectedSeat] = useState<any | null>(null)
  const [aircraftId, setAircraftId] = useState(null);
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [passengerData, setPassengerData] = useState({
    firstName: "",
    lastName: "",
    lastNameMaternal:"",
    email: "",
    birth_date:"",
    phone: "",
    documentType: "passport",
    documentNumber: "",
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchSeats = async () => {
      if (session?.user?.userId && session?.accessToken) {
        try {
          const res = await fetch(`http://localhost:3000/api/v1/seats/getSeatFlight/${flightId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          });
          const seatData = await res.json();
          if (seatData.length > 0) {
            setAircraftId(seatData[0].aircraft_id);
          }
          setSeats(seatData);
        } catch (error) {
          console.error("Error al obtener los asientos:", error);
        }
        try {
          const resData = await fetch(`http://localhost:3000/api/v1/flights/${flightId}`)
          const flightData = await resData.json()
          setFlight(flightData)
        } catch (error) {
          console.error("Error al cargar los datos:", error)
        }
      }
    }
    fetchSeats();
  }, [session, flightId])

  const handlePassengerSubmit = (data: typeof passengerData) => {
    if (!selectedSeat) {
      alert("Debes seleccionar un asiento antes de continuar.")
      return
    }
    setPassengerData(data)
    setStep(2)
    window.scrollTo(0, 0)
  }

  const handlePaymentSubmit = async (data: typeof paymentData) => {
    setPaymentData(data)
    setIsSubmitting(true)

    if (!selectedSeat) {
      alert("Por favor selecciona un asiento antes de continuar.")
      setIsSubmitting(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const reservationPayload = {
        first_name: passengerData.firstName,
        last_name_paternal: passengerData.lastName,
        last_name_maternal: passengerData.lastNameMaternal,
        birth_date: passengerData.birth_date,
        passport: passengerData.documentNumber,
        phone: passengerData.phone,
        email: passengerData.email,
        accumulated_flight: 0,
        frequent_flyer: true,
        user_id: session?.user?.userId || 1,
        flight_id: flight?.flight_id,
        method: "paypal",
        transaction_amount: parseFloat(selectedSeat.cost),
        status: "pagado",
        date: new Date().toISOString().split("T")[0],
        aircraft_id: selectedSeat.aircraft_id,
        seat_id: selectedSeat.seat_id,
      }

      const response = await fetch("http://localhost:3000/api/v1/reservations/crear_reservacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(reservationPayload),
      })

      if (!response.ok) {
        throw new Error("Error al crear la reservación")
      }

      router.push(`/reserva/confirmacion?id=${flight?.flight_id}`)
    } catch (error) {
      console.error("Error al enviar la reservación:", error)
      alert("Ocurrió un error al procesar la reservación.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex mb-8">
        <div className={`flex-1 text-center pb-4 relative ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
          <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
            1
          </div>
          <span className="text-sm font-medium">Información del Pasajero</span>
          <div className={`absolute bottom-0 left-1/2 right-0 h-1 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
        </div>
        <div className={`flex-1 text-center pb-4 ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
          <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
            2
          </div>
          <span className="text-sm font-medium">Pago</span>
        </div>
      </div>

      {step === 1 && (
        <>
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Selecciona tu asiento</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {seats.length === 0 && <p>No hay asientos disponibles.</p>}
              {seats.map((seat) => (
                <button
                  key={seat.seat_id}
                  type="button"
                  onClick={() => setSelectedSeat(seat)}
                  disabled={!seat.available}
                  className={`border rounded-md p-2 text-sm transition-colors duration-200 ${!seat.available ? "bg-gray-200 text-gray-400 cursor-not-allowed" : selectedSeat?.seat_id === seat.seat_id ? "bg-primary text-white" : "bg-white text-gray-800 dark:bg-gray-700 dark:text-white"}`}
                >
                  <div className="font-semibold capitalize">{seat.class}</div>
                  <div>{seat.position}</div>
                  <div className="text-xs text-gray-500">${parseFloat(seat.cost).toFixed(2)}</div>
                </button>
              ))}
            </div>
            {selectedSeat && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Asiento seleccionado: <strong>{selectedSeat.class}</strong>, posición <strong>{selectedSeat.position}</strong>, costo <strong>${parseFloat(selectedSeat.cost).toFixed(2)}</strong>
                </p>
              </div>
            )}
          </div>
          <PassengerInfo initialData={passengerData} onSubmit={handlePassengerSubmit} />
        </>
      )}

      {step === 2 && (
        <PaymentInfo
          initialData={paymentData}
          onSubmit={handlePaymentSubmit}
          onBack={() => setStep(1)}
          totalPrice={`$${selectedSeat?.cost || "0.00"}`}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}

export default ReservationForm;
