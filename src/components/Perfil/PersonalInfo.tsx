"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Save, Edit, Camera, User } from "lucide-react"

export default function PersonalInfo() {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [profileImageAntUrl, setProfileImageAntUrl] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastNamePaternal: "",
    lastNameMaternal: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    passportNumber: "",
  })

  const [userMeta, setUserMeta] = useState({
    passengerId: null,
    accumulatedFlights: 0,
    frequentFlyer: false,
    userId: null,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.userId && session?.accessToken) {
        try {
          const res = await fetch(`http://localhost:3000/api/v1/users/profile/${session.user.userId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })
          const data = await res.json()
          const user = data[0];
          console.log(data);
          setProfileImageAntUrl(user.photo);
          console.log("****************Ant");
          console.log(profileImageAntUrl);
          setFormData({
            firstName: user.first_name || "",
            lastNamePaternal: user.last_name_paternal || "",
            lastNameMaternal: user.last_name_maternal || "",
            email: user.passenger_email || user.user_email || "",
            phone: user.passenger_phone || user.user_phone || "",
            dateOfBirth: user.birth_date?.split("T")[0] || "",
            passportNumber: user.passport || "",
          })
          setUserMeta({
            passengerId: user.passenger_id,
            accumulatedFlights: user.accumulated_flights || 0,
            frequentFlyer: user.frequent_flyer || false,
            userId: user.user_id,
          })
        } catch (err) {
          console.error("Error al obtener datos del usuario:", err)
        }
      }
    }
    fetchUserData()
  }, [session, status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)

    try {
      const res = await fetch(`http://localhost:3000/api/v1/passengers/${session.user.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name_maternal: formData.lastNameMaternal,
          last_name_paternal: formData.lastNamePaternal,
          photo: profileImageUrl || null,
          birth_date: formData.dateOfBirth,
          passport: formData.passportNumber,
          phone: formData.phone,
          email: formData.email,
          accumulated_flights: userMeta.accumulatedFlights,
          frecuent_flyer: userMeta.frequentFlyer,
          user_id: userMeta.userId,
        }),
      })

      if (!res.ok) throw new Error("Error al actualizar el perfil")
      console.log("Perfil actualizado correctamente")
    } catch (err) {
      console.error("Error en el PUT:", err)
    }
  }
const UploadImage = () => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId",session.user.userId)

    const res = await fetch("http://localhost:3000/api/v1/bucket/bucketImagen", {
      method: "POST",
      body: formData,
      headers:{
        Authorization: `Bearer ${session?.accessToken}`,
      }
    });

    const data = await res.json();
    console.log("URL de la imagen:", data.imageUrl);
    setProfileImageUrl(data.imageUrl);

  };

  return (
    <label className="cursor-pointer w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors">
      <Camera className="w-4 h-4" />
      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </label>
  );
};


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
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
          ) : profileImageAntUrl?(
            <img src={profileImageAntUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
          ): (
            <User className="w-10 h-10 text-gray-400" />
          )}
        </div>
          {isEditing && (
            <div className="absolute -bottom-1 -right-1">
              <UploadImage />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {formData.firstName} {formData.lastNamePaternal+" "+formData.lastNameMaternal}
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
              value={formData.lastNamePaternal}
              onChange={(e) => setFormData({ ...formData, lastNamePaternal: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
            <input
              type="text"
              value={formData.lastNameMaternal}
              onChange={(e) => setFormData({ ...formData, lastNameMaternal: e.target.value })}
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
