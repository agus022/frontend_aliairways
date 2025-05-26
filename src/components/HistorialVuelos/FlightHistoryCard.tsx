"use client"

import { Calendar, Clock, MapPin, Download, CreditCard } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Flight {
  id: number;
  flightNumber: number;
  route: string;
  date: string;
  time: string;
  status: string;
  totalPaid: number;
  bookingReference: number;
  aircraft: string;
  duration: string;
  miles: number;
}

interface FlightHistoryCardProps {
  flight: Flight;
}

export default function FlightHistoryCard({ flight }: FlightHistoryCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const ticketRef = useRef<HTMLDivElement>(null)

  const [reservation, setReservation] = useState<any>(null)
  const [checkin, setCheckin] = useState<any>(null)
  const [seat, setSeat] = useState<any>(null)
  const [payment, setPayment] = useState<any>(null)

  // Colores y etiquetas de estado
  const statusColors = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const statusLabels = {
    completed: "Completado",
    cancelled: "Cancelado",
  }

  // Carga datos al montar
  useEffect(() => {
    if (session?.accessToken) {
      const fetchAllData = async () => {
        try {
          const resRes = await fetch(`http://localhost:3000/api/v1/reservetions/${flight.bookingReference}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          const reservationData = await resRes.json();
          setReservation(reservationData);

          const resCheck = await fetch(`http://localhost:3000/api/v1/checkins/${flight.bookingReference}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });

          if (resCheck.status === 404) {
            alert("Este vuelo no tiene check-in. Serás redirigido al formulario.");
            router.push(`/checkin/${flight.bookingReference}`);
            return;
          }

          const checkinData = await resCheck.json();
          setCheckin(checkinData);

          const resSeat = await fetch(`http://localhost:3000/api/v1/seats/${reservationData.aircraft_id}/${reservationData.seat_id}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setSeat(await resSeat.json());

          const resPay = await fetch(`http://localhost:3000/api/v1/payments/${reservationData.payment_id}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setPayment(await resPay.json());

        } catch (error) {
          console.error("Error cargando datos:", error);
        }
      }

      fetchAllData();
    }
  }, [session, flight.bookingReference, router])

  const handleDownload = async () => {
    const element = ticketRef.current
    if (!element) return

    element.style.display = "block"
    await new Promise((res) => setTimeout(res, 100))

    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" })
    const width = pdf.internal.pageSize.getWidth()
    const height = (canvas.height * width) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, width, height)
    pdf.save(`boleto-vuelo-${flight.flightNumber}.pdf`)
    element.style.display = "none"
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* PDF oculto */}
      <div
        ref={ticketRef}
        style={{ display: "none" }}
        className="p-6 w-[600px] bg-white text-black rounded-md shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">🎫 Boleto de Vuelo</h2>
        <p><strong>Vuelo:</strong> {flight.flightNumber}</p>
        <p><strong>Ruta:</strong> {flight.route}</p>
        <p><strong>Fecha:</strong> {flight.date}</p>
        <p><strong>Hora:</strong> {flight.time}</p>
        <p><strong>Duración:</strong> {flight.duration}</p>
        <p><strong>Aeronave:</strong> {flight.aircraft}</p>
        <p><strong>Referencia:</strong> {flight.bookingReference}</p>
        <p><strong>Total Pagado:</strong> ${flight.totalPaid.toLocaleString()} MXN</p>
        <p><strong>Millas:</strong> {flight.miles}</p>

        {/* Datos adicionales */}
        {checkin && <p><strong>Check-in realizado por:</strong> {checkin.passenger_name}</p>}
        {seat && <p><strong>Asiento:</strong> {seat.seat_number}</p>}
        {payment && <p><strong>Método de Pago:</strong> {payment.method}</p>}
      </div>

      {/* Tarjeta de historial de vuelo */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{flight.flightNumber}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[flight.status]}`}>
              {statusLabels[flight.status]}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /><span>{flight.route}</span></div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><span>{flight.date}</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><span>{flight.time} • {flight.duration}</span></div>
            <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400" /><span>${flight.totalPaid.toLocaleString()} MXN</span></div>
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Referencia: {flight.bookingReference}</span>
            <span>Aeronave: {flight.aircraft}</span>
            <span>Millas: {flight.miles.toLocaleString()}</span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Descargar Boleto
          </button>

          {flight.status === "completed" && (
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
              Ver Detalles
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
