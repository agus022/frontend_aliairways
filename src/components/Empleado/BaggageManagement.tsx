"use client"

import { useState } from "react"
import { Package, Scale, QrCode, AlertTriangle, Search, Printer, User } from "lucide-react"

export default function BaggageManagement() {
  const [activeTab, setActiveTab] = useState<"checkin" | "tracking" | "boarding">("checkin")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data para gestión de equipaje
  const baggageData = {
    stats: {
      processedToday: 156,
      overweightBags: 12,
      pendingBags: 8,
      averageWeight: 18.5,
    },
    checkinQueue: [
      {
        id: "1",
        passenger: {
          name: "María González",
          reservation: "ALI-789456",
          seat: "12A",
          destination: "CUN",
        },
        bags: [
          {
            id: "BAG-001",
            type: "checked",
            weight: 22.5,
            dimensions: "60x40x25",
            status: "pending",
            specialHandling: false,
          },
          {
            id: "BAG-002",
            type: "carry_on",
            weight: 8.2,
            dimensions: "55x35x20",
            status: "approved",
            specialHandling: false,
          },
        ],
        flight: "ALI-2024",
        gate: "B12",
      },
      {
        id: "2",
        passenger: {
          name: "Carlos Ruiz",
          reservation: "ALI-789457",
          seat: "15C",
          destination: "CUN",
        },
        bags: [
          {
            id: "BAG-003",
            type: "checked",
            weight: 28.3,
            dimensions: "65x45x30",
            status: "overweight",
            specialHandling: false,
            overweightFee: 850,
          },
        ],
        flight: "ALI-2024",
        gate: "B12",
      },
    ],
    trackingData: [
      {
        id: "BAG-004",
        passenger: "Ana Martínez",
        reservation: "ALI-789458",
        flight: "ALI-2025",
        status: "loaded",
        location: "Aircraft Cargo Hold",
        weight: 19.8,
        destination: "MEX",
        timeline: [
          { time: "14:30", status: "Check-in", location: "Counter 12" },
          { time: "15:15", status: "Security Screening", location: "Baggage Screening" },
          { time: "16:00", status: "Sorted", location: "Baggage Sorting" },
          { time: "16:45", status: "Loaded", location: "Aircraft Cargo Hold" },
        ],
      },
      {
        id: "BAG-005",
        passenger: "Pedro López",
        reservation: "ALI-789459",
        flight: "ALI-2025",
        status: "sorting",
        location: "Baggage Sorting Area",
        weight: 21.2,
        destination: "MEX",
        timeline: [
          { time: "14:45", status: "Check-in", location: "Counter 8" },
          { time: "15:30", status: "Security Screening", location: "Baggage Screening" },
          { time: "16:15", status: "Sorting", location: "Baggage Sorting" },
        ],
      },
    ],
    boardingPasses: [
      {
        id: "1",
        passenger: "Laura Hernández",
        reservation: "ALI-789460",
        flight: "ALI-2024",
        seat: "8A",
        gate: "B12",
        boardingTime: "13:45",
        zone: "1",
        status: "ready",
        bags: {
          checked: 1,
          carryOn: 1,
        },
      },
      {
        id: "2",
        passenger: "Roberto Silva",
        reservation: "ALI-789461",
        flight: "ALI-2024",
        seat: "22F",
        gate: "B12",
        boardingTime: "13:45",
        zone: "3",
        status: "pending_baggage",
        bags: {
          checked: 2,
          carryOn: 1,
        },
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "loaded":
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
      case "sorting":
      case "pending_baggage":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "overweight":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprobado"
      case "pending":
        return "Pendiente"
      case "overweight":
        return "Sobrepeso"
      case "loaded":
        return "Cargado"
      case "sorting":
        return "Clasificando"
      case "ready":
        return "Listo"
      case "pending_baggage":
        return "Equipaje Pendiente"
      default:
        return "Desconocido"
    }
  }

  const handleProcessBag = (bagId: string) => {
    console.log(`Processing bag ${bagId}`)
  }

  const handleGenerateBoardingPass = (passengerId: string) => {
    console.log(`Generating boarding pass for passenger ${passengerId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Gestión de Equipaje y Check-in</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Procesa equipaje, valida peso y genera pases de abordar para los pasajeros
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Procesados Hoy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{baggageData.stats.processedToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Scale className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sobrepeso</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{baggageData.stats.overweightBags}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{baggageData.stats.pendingBags}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Scale className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Peso Promedio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{baggageData.stats.averageWeight} kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("checkin")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "checkin"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Check-in y Equipaje
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tracking"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Seguimiento
            </button>
            <button
              onClick={() => setActiveTab("boarding")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "boarding"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Pases de Abordar
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Check-in Tab */}
          {activeTab === "checkin" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar por reservación o nombre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {baggageData.checkinQueue.map((passenger) => (
                  <div key={passenger.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    {/* Passenger Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {passenger.passenger.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {passenger.passenger.reservation} | Asiento {passenger.passenger.seat} | Vuelo{" "}
                            {passenger.flight}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Destino</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{passenger.passenger.destination}</p>
                      </div>
                    </div>

                    {/* Bags */}
                    <div className="space-y-3">
                      {passenger.bags.map((bag) => (
                        <div key={bag.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {bag.type === "checked" ? "Equipaje Documentado" : "Equipaje de Mano"} - {bag.id}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Peso: {bag.weight} kg | Dimensiones: {bag.dimensions} cm
                                </p>
                                {bag.overweightFee && (
                                  <p className="text-sm text-red-600 dark:text-red-400">
                                    Tarifa por sobrepeso: ${bag.overweightFee} MXN
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bag.status)}`}
                              >
                                {getStatusText(bag.status)}
                              </span>
                              {bag.status === "pending" && (
                                <button
                                  onClick={() => handleProcessBag(bag.id)}
                                  className="bg-primary hover:bg-primary/80 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-300"
                                >
                                  Procesar
                                </button>
                              )}
                              {bag.status === "overweight" && (
                                <button
                                  onClick={() => handleProcessBag(bag.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-300"
                                >
                                  Cobrar Sobrepeso
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracking Tab */}
          {activeTab === "tracking" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar por ID de equipaje..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {baggageData.trackingData.map((bag) => (
                  <div key={bag.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{bag.id}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {bag.passenger} | {bag.reservation} | Vuelo {bag.flight}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bag.status)}`}>
                          {getStatusText(bag.status)}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{bag.location}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Historial de seguimiento</h4>
                      <div className="space-y-2">
                        {bag.timeline.map((event, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                index === bag.timeline.length - 1 ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {event.status}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{event.time}</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-500">{event.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boarding Pass Tab */}
          {activeTab === "boarding" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar por reservación o nombre..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {baggageData.boardingPasses.map((passenger) => (
                  <div key={passenger.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <QrCode className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{passenger.passenger}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {passenger.reservation} | Vuelo {passenger.flight} | Asiento {passenger.seat}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Puerta {passenger.gate} | Zona {passenger.zone} | Abordaje: {passenger.boardingTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(passenger.status)}`}
                          >
                            {getStatusText(passenger.status)}
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Equipaje: {passenger.bags.checked} documentado, {passenger.bags.carryOn} de mano
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleGenerateBoardingPass(passenger.id)}
                            className="bg-primary hover:bg-primary/80 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center gap-1"
                          >
                            <Printer className="w-4 h-4" />
                            Generar Pase
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
