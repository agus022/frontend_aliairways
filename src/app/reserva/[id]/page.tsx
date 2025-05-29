"use client"

import { notFound, useParams } from "next/navigation"
import ReservationForm from "@/components/Reserva/ReservationForm"
import FlightSummary from "@/components/Reserva/FlightSummary"
import { useState, useEffect } from "react"
import { useSession } from 'next-auth/react'

export default function ReservationPage() {
  const params = useParams();
  const id = Number(params?.id); // Asegúrate de convertirlo a número

  // Validación: si el ID no es válido, podrías redirigir o mostrar un error
  if (isNaN(id)) {
    notFound(); // o muestra un mensaje de error
  }

  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Completa tu Reserva
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Resumen del vuelo seleccionado */}
          <div className="lg:col-span-1">
            <FlightSummary flightId={id} />
          </div>

          {/* Formulario de reserva */}
          <div className="lg:col-span-2">
            <ReservationForm flightId={id} />
          </div>
        </div>
      </div>
    </section>
  );
}
