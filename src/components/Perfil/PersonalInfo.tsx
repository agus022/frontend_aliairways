"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Save, Edit, Camera, User } from "lucide-react"

export default function PersonalInfo() {
  const { data: session, status } = useSession()
  //console.log(session.user);
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    passportNumber: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
        if (session?.user?.userId && session?.accessToken) {
          try {
            const res = await fetch(`http://localhost:3000/api/v1/users/profile/${session.user.userId}`, {
              headers: {
                Authorization: `Bearer ${session.accessToken}`, // ← Aquí se envía el token
              },
            })
            const data = await res.json()
            const user = data[0]
            console.log(user)
            setFormData({
              firstName: user.first_name || "",
              lastName: (user.last_name_paternal || "") + " " + (user.last_name_maternal || ""),
              email: user.passenger_email || "",
              phone: user.passenger_phone || "",
              dateOfBirth: user.birth_date?.split("T")[0] || "",
              passportNumber: user.passport || "",
            })
          } catch (err) {
            console.error("Error al obtener datos del usuario:", err)
          }
        }else{
          console.log("No existen estos datos");
        }
      }
    fetchUserData()
  }, [session,status])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    console.log("Guardando datos:", formData)
    // Aquí podrías hacer un POST/PUT a tu API
  }

  return (
    <div>
      {/* Botón editar y título */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Información Personal</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? "Cancelar" : "Editar"}
        </button>
      </div>

      {/* Foto de perfil */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          {isEditing && (
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {formData.firstName} {formData.lastName}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Miembro desde enero 2024</p>
        </div>
      </div>

      {/* Formulario con los campos disponibles */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo electrónico</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de nacimiento</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pasaporte</label>
            <input
              type="text"
              value={formData.passportNumber}
              onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
            >
              <Save className="w-4 h-4" />
              Guardar cambios
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
