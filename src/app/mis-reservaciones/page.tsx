'use client';
import type { Metadata } from "next"
import ReservationCard from "@/components/Reservaciones/ReservationCard"
import { mockReservations } from "@/components/Reservaciones/mockReservations"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {useSession } from 'next-auth/react';


export default function MisReservacionesPage() {
   const { data: session, status } = useSession();
  const [dataReservation, setDataReservation]= useState<any>(null);

  useEffect(()=> {
    if(session?.user?.userId && session?.accessToken) {
      const fetchReservations = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reservations/reservationsByUser/${session.user.userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Error al obtener las reservaciones.");
          }

          const reservations = await response.json();
          setDataReservation(reservations);
          console.log("Reservaciones obtenidas:", reservations);
        } catch (error) {
          console.error("Error fetching reservations:", error);
        }
      }
      fetchReservations();
    
    }
    
  }), [session, status];

  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Mis Reservaciones</h1>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reservaciones Activas</h2>
                <p className="text-gray-600 dark:text-gray-300">Gestiona tus próximos vuelos</p>
              </div>
              <div className="flex gap-2">
                <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                  <option value="all">Todas las reservaciones</option>
                  <option value="upcoming">Próximos vuelos</option>
                  <option value="past">Vuelos pasados</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
          {dataReservation &&
            dataReservation.map((reservation: any) => (
              <ReservationCard
                key={reservation.reservation_id}
                reservation={reservation}
              />
            ))}
        </div>


          {mockReservations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tienes reservaciones</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Cuando realices una reservación, aparecerá aquí</p>
              <button className="bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-md transition duration-300">
                Buscar Vuelos
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
