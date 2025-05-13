import { notFound } from "next/navigation"
import { mockFlights } from "@/components/Flights/mockData"
import type { Metadata } from "next"
import ReservationForm from "@/components/Reserva/ReservationForm"
import FlightSummary from "@/components/Reserva/FlightSummary"

export const metadata: Metadata = {
  title: "Reserva de Vuelo | Ali Airways",
  description: "Completa tu reserva de vuelo con Ali Airways",
}

export default function ReservationPage({ params }: { params: { id: string } }) {
  // Buscar el vuelo por ID
  const flight = mockFlights.find((flight) => flight.id === params.id)

  // Si no se encuentra el vuelo, mostrar página 404
  if (!flight) {
    notFound()
  }

  // Calcular precio total (precio base + impuestos)
  const totalPrice = flight.price + flight.taxes

  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Completa tu Reserva</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumen del vuelo seleccionado */}
          <div className="lg:col-span-1">
            <FlightSummary flight={flight} totalPrice={totalPrice} />
          </div>

          {/* Formulario de reserva */}
          <div className="lg:col-span-2">
            <ReservationForm flightId={flight.id} totalPrice={totalPrice} currency={flight.currency} />
          </div>
        </div>
      </div>
    </section>
  )
}
