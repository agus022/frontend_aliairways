"use client"

import { Download, ArrowLeft, Plane, Clock, QrCode } from "lucide-react"
import { useEffect, useState } from "react"
import { useSession } from 'next-auth/react';
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { useRef } from "react"


interface flight {
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

interface BoardingPassProps {
  selectedSeat: string | null
  onBack: () => void
  flightData: flight,
  lastName: string,
}


export default function BoardingPass({ selectedSeat, onBack, flightData, lastName }: BoardingPassProps) {
  const { data: session } = useSession();
  const [origin, setOrigin] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [localFlightData, setLocalFlightData] = useState<flight>(flightData);

  useEffect(() => {
    if (session?.user?.userId && session?.accessToken) {
      const fetchAllData = async () => {
        try {
          const resFlig = await fetch("http://localhost:3000/api/v1/checkins/getData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({ id_reservation: flightData.reservation_id, last_name: lastName }),
          })

          const raw = await resFlig.json();
          const mappedData: flight = {
            reservation_id: raw.reservation_id,
            flight_id: raw.flight_id,
            model: raw.model,
            departure_time: raw.departure_time,
            arrival_time: raw.arrival_time,
            origin_id: raw.origin_id,
            destination_id: raw.destination_id,
            departure_date: raw.departure_date,
            seat: raw.seat,
            class: raw.class,
            full_name: raw.full_name,
            email: raw.email,
            phone: raw.phone,
            estado: raw.estado ?? null,
          }

          setLocalFlightData(mappedData)

          const resOrigin = await fetch(`http://localhost:3000/api/v1/airports/${mappedData.origin_id}`)
          const originData = await resOrigin.json();
          setOrigin(originData);

          const resDest = await fetch(`http://localhost:3000/api/v1/airports/${mappedData.destination_id}`)
          const destinationData = await resDest.json();
          setDestination(destinationData);

        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      }

      fetchAllData();
    }
  }, [session, flightData, lastName]);

  const boardingPassData = {
    flight: {
      gate: "B12",
      terminal: "T2",
    },
    reservation: {
      zone: "2",
    },
    seat: selectedSeat || localFlightData.seat || "12A",
    boardingTime: "13:45",
    sequence: "045",
  }

  const boardingPassRef = useRef<HTMLDivElement>(null)
  const handleDownload = async () => {
    if (session?.user?.userId && session?.accessToken) {
      try {
        const response = await fetch("http://localhost:3000/api/v1/checkins", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            reservation_id: localFlightData.reservation_id,
            estado: 'Check',
            pase_codigo: 'ALI' + localFlightData.reservation_id,
          }),
        })

        if (!response.ok) {
          throw new Error("Error al guardar el check-in")
        }

        console.log("Check-in guardado exitosamente.")

      } catch (error) {
        console.error("Error:", error)
        alert("No se pudo completar el check-in. Verifica los datos.")
      }
    }

    console.log("Descargando pase de abordar...")
    if (!boardingPassRef.current) return;

  const original = boardingPassRef.current;

  // Clonamos el componente del pase
  const clone = original.cloneNode(true) as HTMLElement;

  // Le quitamos todas las clases de Tailwind y aplicamos estilos básicos
  clone.removeAttribute("class");
  clone.style.backgroundColor = "#ffffff";
  clone.style.color = "#000000";
  clone.style.fontFamily = "Arial, sans-serif";
  clone.style.padding = "20px";
  clone.style.border = "1px solid #ccc";
  clone.style.width = "600px";
  clone.style.margin = "0 auto";

  // Elimina clases internas que puedan tener colores problemáticos
  clone.querySelectorAll("*").forEach((child) => {
    child.removeAttribute("class");
    (child as HTMLElement).style.color = "#000";
  });

  // Añade el clon al DOM (fuera de pantalla)
  clone.style.position = "absolute";
  clone.style.top = "-10000px";
  document.body.appendChild(clone);

  // Captura el canvas del clon
  const canvas = await html2canvas(clone, {
    scale: 2,
    backgroundColor: "#fff",
  });

  document.body.removeChild(clone); // Limpieza

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`pase-abordar-${localFlightData.reservation_id}.pdf`);
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    
    <div  ref={boardingPassRef} className="space-y-6">
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
            <li>• Dirígete a la puerta {boardingPassData.flight.gate} en {boardingPassData.flight.terminal}</li>
            <li>• El abordaje inicia a las {boardingPassData.boardingTime}</li>
          </ul>
        </div>
      </div>

      {/* Boarding Pass */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden print:shadow-none">
        {/* Header */}
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
              <p className="text-xl font-bold">{'ALI' + localFlightData.flight_id}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Datos del vuelo y pasajero */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Pasajero
                  </label>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{localFlightData.full_name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Reservación
                  </label>
                  <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                    {localFlightData.reservation_id}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{origin?.name ?? "Cargando..."}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{origin?.city ?? "Cargando..."}</p>
                  <p className="text-lg font-semibold mt-2">{localFlightData.departure_time}</p>
                </div>

                <div className="flex-1 mx-6 text-center">
                  <div className="h-0.5 bg-gray-300 dark:bg-gray-600 relative">
                    <Plane className="w-5 h-5 text-primary absolute left-1/2 -top-2 transform -translate-x-1/2" />
                  </div>
                  <p className="text-xs mt-2">{localFlightData.departure_date}</p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{destination?.name ?? "Cargando..."}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{destination?.city ?? "Cargando..."}</p>
                  <p className="text-lg font-semibold mt-2">{localFlightData.arrival_time}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center lg:border-l lg:border-gray-200 lg:dark:border-gray-700 lg:pl-6">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Código QR para acceso rápido</p>
            </div>
          </div>

          {/* Detalles adicionales */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-xs text-gray-500">Asiento</label>
                <p className="text-xl font-bold text-primary">{localFlightData.seat}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Puerta</label>
                <p className="text-xl font-bold">{boardingPassData.flight.gate}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Terminal</label>
                <p className="text-xl font-bold">{boardingPassData.flight.terminal}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Zona</label>
                <p className="text-xl font-bold">{boardingPassData.reservation.zone}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Clase</label>
                <p className="text-xl font-bold">{localFlightData.class}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Secuencia</label>
                <p className="text-xl font-bold">{boardingPassData.sequence}</p>
              </div>
            </div>
          </div>

          {/* Hora de abordaje */}
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

      {/* Botones */}
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
          Imprimir
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition duration-300"
        >
          <Download className="w-5 h-5" />
          Descargar pase
        </button>
      </div>
    </div>
  )
}
