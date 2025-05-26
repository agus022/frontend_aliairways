"use client"

import { Plane, Clock, MapPin, Users, ArrowLeft, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
interface flight{
  reservation_id:number,
  flight_id:number,
  model:string,
  departure_time:string,
  arrival_time:string,
  origin_id:string,
  destination_id:string,
  departure_date:string,
  seat:string,
  class:string,
  full_name:string,
  email:string,
  phone:string,
  estado:string|null
}

interface FlightConfirmationProps {
  onConfirm: () => void
  onBack: () => void
  CheckData: flight // Idealmente, define bien el tipo
}

export default function FlightConfirmation({ onConfirm, onBack,  CheckData }: FlightConfirmationProps) {
  // Mock flight data
  const [origin,setOrigin]=useState<any>(null);
  const [destination,setDestintion]=useState<any>(null);
  

  function getTimeDifference(departureTime: string, arrivalTime: string): { hours: number, minutes: number } {
    const [depHour, depMin] = departureTime.split(":").map(Number)
    const [arrHour, arrMin] = arrivalTime.split(":").map(Number)

    const depDate = new Date(0, 0, 0, depHour, depMin)
    let arrDate = new Date(0, 0, 0, arrHour, arrMin)

    // Si la hora de llegada es menor, asumimos que es el día siguiente
    if (arrDate <= depDate) {
      arrDate.setDate(arrDate.getDate() + 1)
    }

    const diffMs = arrDate.getTime() - depDate.getTime()
    const diffMin = Math.floor(diffMs / 1000 / 60)
    const hours = Math.floor(diffMin / 60)
    const minutes = diffMin % 60

    return { hours, minutes }
  }
  console.log(CheckData);

  useEffect(()=>{
    const fetchAllData= async ()=>{
      try{
       const res= await fetch(`http://localhost:3000/api/v1/airports/${CheckData.origin_id}`)
       const originData=await res.json();
       setOrigin(originData);

       const resDes=await fetch(`http://localhost:3000/api/v1/airports/${CheckData.destination_id}`)
       const destinationData=await resDes.json();
       setDestintion(destinationData);
      }catch(error){
        console.log("Error al cargar los datos:",error);
      }
    }
    fetchAllData();
  })
  
  console.log("ORIGIN",origin);
  console.log("dESTINAION",destination);
  const flightData = {
    reservationNumber: "ALI-789456",
    passenger: {
      name: "Juan Carlos Pérez",
      email: "juan.perez@email.com",
      phone: "+52 55 1234 5678",
    },
    flight: {
      number: "ALI-2024",
      aircraft: "Boeing 737-800",
      from: {
        code: "MEX",
        city: "Ciudad de México",
        airport: "Aeropuerto Internacional Benito Juárez",
        terminal: "Terminal 2",
      },
      to: {
        code: "CUN",
        city: "Cancún",
        airport: "Aeropuerto Internacional de Cancún",
        terminal: "Terminal 3",
      },
      departure: {
        date: "2024-02-15",
        time: "14:30",
      },
      arrival: {
        date: "2024-02-15",
        time: "17:45",
      },
      duration: "3h 15m",
      class: "Económica",
      seat: "Por asignar",
    },
    baggage: {
      carry: "1 pieza (10kg)",
      checked: "1 pieza (23kg)",
    },
  }
  const duration = getTimeDifference(CheckData.departure_time, CheckData.arrival_time)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Confirma tu vuelo</h2>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
            Confirmado
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Verifica que todos los detalles de tu reservación sean correctos antes de continuar.
        </p>
      </div>

      {/* Flight Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Plane className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vuelo {CheckData.flight_id}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{CheckData.model}</p>
          </div>
        </div>

        {/* Route */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Departure */}
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{CheckData.departure_date}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{origin?.city ?? "Cargando..."}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{origin?.name ?? "Cargando..."}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">{origin?.code ?? ""}</div>
          </div>

          {/* Duration */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{duration.hours}h {duration.minutes}m</div>
            <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-600 relative">
              <Plane className="w-4 h-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800" />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">Vuelo directo</div>
          </div>

          {/* Arrival */}
          <div className="text-center md:text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{CheckData.arrival_time}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{destination?.city ?? "Cargando..."}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{destination?.name ?? "Cargando..."}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">{destination?.code ?? ""}</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {CheckData.departure_date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Clase {CheckData.class}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Asiento: {CheckData.seat}</span>
          </div>
        </div>
      </div>

      {/* Passenger Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información del Pasajero</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo</label>
            <p className="text-gray-900 dark:text-white">{CheckData.full_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Número de reservación</label>
            <p className="text-gray-900 dark:text-white font-mono">{"ALI"+CheckData.reservation_id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
            <p className="text-gray-900 dark:text-white">{CheckData.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
            <p className="text-gray-900 dark:text-white">{CheckData.phone}</p>
          </div>
        </div>
      </div>

      {/* Baggage Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Equipaje Incluido</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16a2 2 0 002 2h4a2 2 0 002-2V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v10z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Equipaje de mano</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{flightData.baggage.carry}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Equipaje documentado</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{flightData.baggage.checked}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a buscar
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
        >
          Continuar con selección de asiento
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
