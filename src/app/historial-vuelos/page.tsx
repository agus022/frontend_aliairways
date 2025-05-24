import type { Metadata } from "next"
import FlightHistory from "@/components/HistorialVuelos/FlightHistory"

export const metadata: Metadata = {
  title: "Historial de Vuelos | Ali Airways",
  description: "Consulta tu historial de vuelos y compras",
}

export default function HistorialVuelosPage() {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Historial de Vuelos</h1>

          <FlightHistory />
        </div>
      </div>
    </section>
  )
}
