"use client"

import { useState,useEffect } from "react"
import { useSession } from "next-auth/react"
import { Package, Scale, QrCode, AlertTriangle, Search, Printer, User } from "lucide-react"

export default function BaggageManagement() {
  const { data: session } = useSession();
  const [averageWeight, setAverageWeight] = useState<any>(null);
  const [processedToday,setProcessedToday] = useState<any>(null);
  const [overweightBags,setOverWeightBags] = useState<any>(null);

  const [bags,setBags] =useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<"checkin" | "tracking" | "boarding">("checkin")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (session?.user?.userId && session?.accessToken) {
      const fetchAllData= async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/luggages/avgLuggageByEmployee`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })
          if (!res.ok) throw new Error("Error al cargar el turno")
          const data = await res.json()
          setAverageWeight(data);
        } catch (error) {
          console.error("Error fetching turno:", error)
        }
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/luggages/totalLuggageOverByEmployee/${session.user.userId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })
          if (!res.ok) throw new Error("Error al cargar el turno")
          const data = await res.json()
          setOverWeightBags(data);
        } catch (error) {
          console.error("Error fetching turno:", error)
        }
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/luggages/totalLuggageByEmployee/${session.user.userId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })
          if (!res.ok) throw new Error("Error al cargar el turno")
          const data = await res.json()
          setProcessedToday(data);
        } catch (error) {
          console.error("Error fetching turno:", error)
        }
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/luggages/luggagesByEmployeeNow/${session.user.userId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })
          if (!res.ok) throw new Error("Error al cargar el turno")
          const data = await res.json()
          setBags(data);
        } catch (error) {
          console.error("Error fetching turno:", error)
        }

      }
      
      fetchAllData() 
    }
  }, [session])


  function getAvg():number{
    const avg=Number(averageWeight?.avg) || 0;
    return parseFloat(avg.toFixed(2));
  }
  console.log(bags);
  // Mock data para gestión de equipaje
  

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Procesados Hoy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{processedToday?.total || 'cargando'}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overweightBags?.total || 'cargando'}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{getAvg()} kg</p>
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
                      placeholder="Buscar por vuelo,nombre o reservacion..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {bags
                  .filter((bag) =>
                    bag.concat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    bag.reservation_id.toString().includes(searchQuery) ||
                    bag.flight_id.toString().includes(searchQuery)
                  )
                  .map((bag) => (
                    <div key={bag.luggage_id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{bag.concat}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Reservación {bag.reservation_id} | Asiento {bag.seat_id} ({bag.position}) | Vuelo {bag.flight_id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Destino</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{bag.destination}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                Equipaje #{bag.luggage_id}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {bag.description}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Peso: {bag.weight} kg
                              </p>
                              {parseFloat(bag.price) > 0 && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  Tarifa por sobrepeso: ${parseFloat(bag.price).toFixed(2)} MXN
                                </p>
                              )}
                              <p className="text-sm">
                                Estado:{" "}
                                <span className={`font-semibold ${bag.checkin === null ? 'text-yellow-500' : 'text-green-500'}`}>
                                  {bag.checkin === null ? "Pendiente" : "Procesado"}
                                </span>
                              </p>
                            </div>
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
