"use client"

import { useState } from "react"
import { Plane, Clock, CheckCircle } from "lucide-react"

export default function AssignedFlights() {
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "today" | "completed">("today")

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_time":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "delayed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
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
        return flightsData.today
      case "upcoming":
        return flightsData.upcoming
      case "completed":
        return flightsData.completed
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
              Hoy ({flightsData.today.length})
            </button>
            <button
              onClick={() => setSelectedTab("upcoming")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "upcoming"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Próximos ({flightsData.upcoming.length})
            </button>
            <button
              onClick={() => setSelectedTab("completed")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "completed"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Completados ({flightsData.completed.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {getCurrentFlights().map((flight) => (
              <div key={flight.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                {/* Flight Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Plane className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{flight.flightNumber}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{flight.aircraft.type}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(flight.status)}`}>
                    {getStatusText(flight.status)}
                  </span>
                </div>

                {/* Flight Route */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Origen</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {flight.route.from.code} - {flight.route.from.city}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{flight.route.from.terminal}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duración</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{flight.schedule.duration}</p>
                    {flight.date && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(flight.date).toLocaleDateString("es-ES")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Destino</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {flight.route.to.code} - {flight.route.to.city}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{flight.route.to.terminal}</p>
                  </div>
                </div>

                {/* Flight Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Salida</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{flight.schedule.departure}</p>
                      {flight.schedule.actualDeparture && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Real: {flight.schedule.actualDeparture}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Llegada</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{flight.schedule.arrival}</p>
                      {flight.schedule.actualArrival && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Real: {flight.schedule.actualArrival}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Aircraft and Gate Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Aeronave</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{flight.aircraft.registration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Puerta</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{flight.aircraft.gate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pasajeros</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {flight.passengers.checkedIn}/{flight.passengers.booked} ({flight.passengers.capacity} cap.)
                    </p>
                  </div>
                </div>

                {/* Crew Information */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Tripulación</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cabina de mando</p>
                      <p className="text-sm text-gray-900 dark:text-white">Capitán: {flight.crew.captain}</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Primer Oficial: {flight.crew.firstOfficer}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tripulación de cabina</p>
                      {flight.crew.cabinCrew.map((member, index) => (
                        <p key={index} className="text-sm text-gray-900 dark:text-white">
                          TCP: {member}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tasks (only for today's flights) */}
                {selectedTab === "today" && flight.tasks && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Tareas Pre-vuelo</h4>
                    <div className="space-y-2">
                      {flight.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3">
                          <button
                            onClick={() => handleTaskToggle(flight.id, task.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              task.completed
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {task.completed && <CheckCircle className="w-3 h-3" />}
                          </button>
                          <span
                            className={`text-sm ${
                              task.completed
                                ? "text-gray-500 dark:text-gray-400 line-through"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {task.task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance (only for completed flights) */}
                {selectedTab === "completed" && flight.performance && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Rendimiento</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Puntualidad</p>
                        <p className="font-semibold text-green-600">{flight.performance.onTimePerformance}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Eficiencia de combustible</p>
                        <p className="font-semibold text-green-600">{flight.performance.fuelEfficiency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Satisfacción del pasajero</p>
                        <p className="font-semibold text-green-600">{flight.performance.passengerSatisfaction}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {selectedTab === "upcoming" && (
                    <button
                      onClick={() => handleConfirmAssignment(flight.id)}
                      className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                    >
                      Confirmar Asignación
                    </button>
                  )}
                  <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                    Ver Detalles
                  </button>
                  <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                    Descargar Briefing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
