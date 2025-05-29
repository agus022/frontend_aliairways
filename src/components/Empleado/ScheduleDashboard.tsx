"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Clock, BadgeInfo, User, Briefcase } from "lucide-react"

export default function ScheduleDashboard() {
  const { data: session } = useSession()
  const [turno, setTurno] = useState<any>(null)

  useEffect(() => {
    if (session?.user?.userId && session?.accessToken) {
      const fetchTurno = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/v1/shifts/employee/horario/${session.user.userId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })
          if (!res.ok) throw new Error("Error al cargar el turno")
          const data = await res.json()
          setTurno(data)
        } catch (error) {
          console.error("Error fetching turno:", error)
        }
      }
      fetchTurno()
    }
  }, [session])

  if (!turno) {
    return <div className="text-center text-gray-500 dark:text-gray-400 mt-10">Cargando turno...</div>
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Turno Actual</h1>

      <div className="flex items-center gap-3">
        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <p className="text-gray-800 dark:text-gray-200 font-medium">{turno.first_name}</p>
      </div>

      <div className="flex items-center gap-3">
        <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <p className="text-gray-800 dark:text-gray-200">{turno.title}</p>
      </div>

      <div className="flex items-center gap-3">
        <BadgeInfo className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <p className="text-gray-800 dark:text-gray-200">ID de Empleado: {turno.employee_id}</p>
      </div>

      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <p className="text-gray-800 dark:text-gray-200">
          Horario: {turno.start_time} - {turno.end_time}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <p className="text-gray-800 dark:text-gray-200">Descripción: {turno.shift_desc}</p>
      </div>
    </div>
  )
}
