"use client"

import { useState } from "react"
import { Calendar, Clock, Plane, MapPin, Bell, CheckCircle, AlertCircle } from "lucide-react"

export default function ScheduleDashboard() {
  const [selectedWeek, setSelectedWeek] = useState(0)

  // Mock data para horarios
  const scheduleData = {
    employee: {
      name: "Carlos Mendoza",
      id: "EMP-001",
      position: "Piloto Comercial",
      base: "Ciudad de México (MEX)",
    },
    currentWeek: {
      start: "2024-02-12",
      end: "2024-02-18",
    },
    schedule: [
      {
        date: "2024-02-12",
        day: "Lunes",
        shifts: [
          {
            id: "1",
            type: "Vuelo",
            flightNumber: "ALI-2024",
            route: "MEX → CUN",
            startTime: "06:00",
            endTime: "12:30",
            status: "confirmed",
            aircraft: "Boeing 737-800",
            crew: ["Copiloto: Ana García", "TCP: María López", "TCP: Pedro Ruiz"],
          },
        ],
      },
      {
        date: "2024-02-13",
        day: "Martes",
        shifts: [
          {
            id: "2",
            type: "Vuelo",
            flightNumber: "ALI-2025",
            route: "CUN → MEX",
            startTime: "14:00",
            endTime: "20:15",
            status: "confirmed",
            aircraft: "Boeing 737-800",
            crew: ["Copiloto: Luis Hernández", "TCP: Carmen Silva", "TCP: Roberto Díaz"],
          },
        ],
      },
      {
        date: "2024-02-14",
        day: "Miércoles",
        shifts: [
          {
            id: "3",
            type: "Descanso",
            description: "Día de descanso programado",
            status: "rest",
          },
        ],
      },
      {
        date: "2024-02-15",
        day: "Jueves",
        shifts: [
          {
            id: "4",
            type: "Entrenamiento",
            description: "Simulador de vuelo - Recertificación",
            startTime: "09:00",
            endTime: "17:00",
            location: "Centro de Entrenamiento ALI",
            status: "pending",
          },
        ],
      },
      {
        date: "2024-02-16",
        day: "Viernes",
        shifts: [
          {
            id: "5",
            type: "Vuelo",
            flightNumber: "ALI-2026",
            route: "MEX → GDL → MEX",
            startTime: "08:30",
            endTime: "16:45",
            status: "confirmed",
            aircraft: "Airbus A320",
            crew: ["Copiloto: Sandra Morales", "TCP: Diego Castro", "TCP: Elena Vega"],
          },
        ],
      },
      {
        date: "2024-02-17",
        day: "Sábado",
        shifts: [
          {
            id: "6",
            type: "Standby",
            description: "Disponibilidad en aeropuerto",
            startTime: "06:00",
            endTime: "18:00",
            location: "Aeropuerto MEX - Sala de tripulaciones",
            status: "confirmed",
          },
        ],
      },
      {
        date: "2024-02-18",
        day: "Domingo",
        shifts: [
          {
            id: "7",
            type: "Descanso",
            description: "Día de descanso programado",
            status: "rest",
          },
        ],
      },
    ],
    notifications: [
      {
        id: "1",
        type: "schedule_change",
        title: "Cambio de horario",
        message: "El vuelo ALI-2026 del viernes se ha adelantado 30 minutos",
        time: "Hace 2 horas",
        read: false,
      },
      {
        id: "2",
        type: "training",
        title: "Recordatorio de entrenamiento",
        message: "Simulador programado para mañana a las 09:00",
        time: "Hace 1 día",
        read: true,
      },
      {
        id: "3",
        type: "crew_change",
        title: "Cambio de tripulación",
        message: "Nuevo copiloto asignado para el vuelo ALI-2025",
        time: "Hace 2 días",
        read: true,
      },
    ],
    stats: {
      hoursThisWeek: 42,
      flightsThisWeek: 3,
      hoursThisMonth: 168,
      flightsThisMonth: 12,
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "rest":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Horario de Trabajo</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {scheduleData.employee.name} - {scheduleData.employee.position}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Base: {scheduleData.employee.base} | ID: {scheduleData.employee.id}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              Semana del {scheduleData.currentWeek.start} al {scheduleData.currentWeek.end}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Horas esta semana</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{scheduleData.stats.hoursThisWeek}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Plane className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vuelos esta semana</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{scheduleData.stats.flightsThisWeek}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Horas este mes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{scheduleData.stats.hoursThisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Plane className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vuelos este mes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{scheduleData.stats.flightsThisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Horario Semanal</h2>
            <div className="space-y-4">
              {scheduleData.schedule.map((day) => (
                <div key={day.date} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {day.day} - {new Date(day.date).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {day.shifts.map((shift) => (
                      <div key={shift.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shift.status)}`}
                              >
                                {getStatusIcon(shift.status)}
                                <span className="ml-1">
                                  {shift.status === "confirmed" && "Confirmado"}
                                  {shift.status === "pending" && "Pendiente"}
                                  {shift.status === "rest" && "Descanso"}
                                </span>
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">{shift.type}</span>
                            </div>

                            {shift.flightNumber && (
                              <div className="space-y-1">
                                <p className="font-semibold text-primary">{shift.flightNumber}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{shift.route}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{shift.aircraft}</p>
                                {shift.crew && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Tripulación:</p>
                                    {shift.crew.map((member, index) => (
                                      <p key={index} className="text-xs text-gray-600 dark:text-gray-400">
                                        {member}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {shift.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">{shift.description}</p>
                            )}

                            {shift.location && (
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-gray-500" />
                                <p className="text-xs text-gray-500 dark:text-gray-400">{shift.location}</p>
                              </div>
                            )}
                          </div>

                          {shift.startTime && shift.endTime && (
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {shift.startTime} - {shift.endTime}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {(() => {
                                  const start = new Date(`2024-01-01 ${shift.startTime}`)
                                  const end = new Date(`2024-01-01 ${shift.endTime}`)
                                  const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                                  return `${diff}h`
                                })()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notificaciones</h2>
          </div>

          <div className="space-y-4">
            {scheduleData.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read
                    ? "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{notification.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{notification.time}</p>
                  </div>
                  {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium">
            Ver todas las notificaciones
          </button>
        </div>
      </div>
    </div>
  )
}
