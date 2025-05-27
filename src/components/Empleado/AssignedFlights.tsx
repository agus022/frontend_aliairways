"use client"

import { useState,useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plane, Clock, CheckCircle } from "lucide-react"
import { Session } from "inspector/promises";

export default function AssignedFlights() {
   const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "today" | "completed">("today");
  const [flightsToday,setFlightsToday]=useState<any[]>([]);
  const [flightsCompleted,setFlightsCompleted]=useState<any[]>([]);
  const [flightsUpcoming,setFlightsUpcoming]=useState<any[]>([]);
  

  useEffect(()=>{
    if(session?.user?.userId && session?.accessToken){
        const fetchAllData=async () =>{
          try{
            const res = await fetch(`http://localhost:3000/api/v1/flights/employee/flightsNow/${session.user.userId}`, {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            })
            if (!res.ok) throw new Error("Error al cargar el turno")
            const data = await res.json()
            setFlightsToday(data);
          }catch(error){
              console.error(error);
          }
          try{
            const res = await fetch(`http://localhost:3000/api/v1/flights/employee/flightsAfter/${session.user.userId}`, {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            })
            if (!res.ok) throw new Error("Error al cargar el turno")
            const data = await res.json()
            setFlightsUpcoming(data);
          }catch(error){
              console.error(error);
          }
          try{
            const res = await fetch(`http://localhost:3000/api/v1/flights/employee/flightsBefore/${session.user.userId}`, {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            })
            if (!res.ok) throw new Error("Error al cargar el turno")
            const data = await res.json()
            setFlightsCompleted(data);
          }catch(error){
              console.error(error);
          }
        }
        fetchAllData();
    }
  })

  console.log(flightsCompleted);
  console.log(flightsToday)
  console.log(flightsUpcoming)
  // Mock data para vuelos asignados
  const flightsData = {
    today: [
      {
        id: "1",
        flightNumber: "ALI-2024",
        route: {
          from: { code: "MEX", city: "Ciudad de México", terminal: "T2" },
          to: { code: "CUN", city: "Cancún", terminal: "T3" },
        },
        schedule: {
          departure: "14:30",
          arrival: "17:45",
          duration: "3h 15m",
        },
        aircraft: {
          type: "Boeing 737-800",
          registration: "XA-ALI",
          gate: "B12",
        },
        crew: {
          captain: "Carlos Mendoza",
          firstOfficer: "Ana García",
          cabinCrew: ["María López", "Pedro Ruiz", "Carmen Silva"],
        },
        passengers: {
          booked: 156,
          checkedIn: 142,
          capacity: 189,
        },
        status: "on_time",
        tasks: [
          { id: "1", task: "Revisión pre-vuelo", completed: true },
          { id: "2", task: "Briefing de tripulación", completed: true },
          { id: "3", task: "Verificación de documentos", completed: false },
          { id: "4", task: "Inspección de cabina", completed: false },
        ],
      },
      {
        id: "2",
        flightNumber: "ALI-2025",
        route: {
          from: { code: "CUN", city: "Cancún", terminal: "T3" },
          to: { code: "MEX", city: "Ciudad de México", terminal: "T2" },
        },
        schedule: {
          departure: "19:15",
          arrival: "22:30",
          duration: "3h 15m",
        },
        aircraft: {
          type: "Boeing 737-800",
          registration: "XA-ALI",
          gate: "A8",
        },
        crew: {
          captain: "Carlos Mendoza",
          firstOfficer: "Ana García",
          cabinCrew: ["María López", "Pedro Ruiz", "Carmen Silva"],
        },
        passengers: {
          booked: 178,
          checkedIn: 45,
          capacity: 189,
        },
        status: "scheduled",
        tasks: [
          { id: "1", task: "Revisión pre-vuelo", completed: false },
          { id: "2", task: "Briefing de tripulación", completed: false },
          { id: "3", task: "Verificación de documentos", completed: false },
          { id: "4", task: "Inspección de cabina", completed: false },
        ],
      },
    ],
    upcoming: [
      {
        id: "3",
        flightNumber: "ALI-2026",
        route: {
          from: { code: "MEX", city: "Ciudad de México", terminal: "T2" },
          to: { code: "GDL", city: "Guadalajara", terminal: "T1" },
        },
        schedule: {
          departure: "08:30",
          arrival: "10:15",
          duration: "1h 45m",
        },
        date: "2024-02-16",
        aircraft: {
          type: "Airbus A320",
          registration: "XA-ALJ",
          gate: "C5",
        },
        crew: {
          captain: "Carlos Mendoza",
          firstOfficer: "Sandra Morales",
          cabinCrew: ["Diego Castro", "Elena Vega"],
        },
        passengers: {
          booked: 134,
          checkedIn: 0,
          capacity: 150,
        },
        status: "scheduled",
      },
    ],
    completed: [
      {
        id: "4",
        flightNumber: "ALI-2023",
        route: {
          from: { code: "GDL", city: "Guadalajara", terminal: "T1" },
          to: { code: "MEX", city: "Ciudad de México", terminal: "T2" },
        },
        schedule: {
          departure: "12:00",
          arrival: "13:45",
          actualDeparture: "12:05",
          actualArrival: "13:50",
          duration: "1h 45m",
        },
        date: "2024-02-14",
        aircraft: {
          type: "Airbus A320",
          registration: "XA-ALJ",
          gate: "C5",
        },
        passengers: {
          booked: 145,
          checkedIn: 145,
          capacity: 150,
        },
        status: "completed",
        performance: {
          onTimePerformance: "95%",
          fuelEfficiency: "Excelente",
          passengerSatisfaction: "4.8/5",
        },
      },
    ],
  }

 const getFlightStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "in progress":
      case "completed":
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "on hold":
      case "delayed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "suspended":
      case "cancelled":
        return "bg-yellow-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "on_time":
        return "A tiempo"
      case "delayed":
        return "Retrasado"
      case "scheduled":
        return "Programado"
      case "completed":
        return "Completado"
      default:
        return "Desconocido"
    }
  }

  const getCurrentFlights = () => {
  switch (selectedTab) {
    case "today":
      return flightsToday
    case "upcoming":
      return flightsUpcoming
    case "completed":
      return flightsCompleted
    default:
      return []
  }
}


  const handleTaskToggle = (flightId: string, taskId: string) => {
    // Aquí iría la lógica para marcar/desmarcar tareas
    console.log(`Toggle task ${taskId} for flight ${flightId}`)
  }

  const handleConfirmAssignment = (flightId: string) => {
    // Aquí iría la lógica para confirmar asignación
    console.log(`Confirm assignment for flight ${flightId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vuelos Asignados</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gestiona tus vuelos asignados y confirma las tareas requeridas
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab("today")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "today"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Hoy ({flightsToday.length})
            </button>
            <button
              onClick={() => setSelectedTab("upcoming")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "upcoming"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Próximos ({flightsUpcoming.length})
            </button>
            <button
              onClick={() => setSelectedTab("completed")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "completed"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Completados ({flightsCompleted.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {getCurrentFlights().map((flight) => (
                <div key={flight.flight_id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Plane className="w-6 h-6 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Vuelo #{flight.flight_id}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{flight.model}</p>
                      </div>
                    </div>
                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFlightStatusColor(flight.status)}`}>
                      {flight.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Origen</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{flight.origen}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Horario</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {flight.departure_date}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {flight.departure_time} → {flight.arrival_time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Destino</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{flight.destino}</p>
                    </div>
                  </div>
                </div>
              ))}

          </div>
        </div>
      </div>
    </div>
  )
}
