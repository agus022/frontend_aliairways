"use client"

import { useState } from "react"
import { Plane, Utensils, Music, Wifi, Car, Hotel } from "lucide-react"

export default function TravelPreferences() {
  const [preferences, setPreferences] = useState({
    seatPreference: "window",
    mealPreference: "regular",
    specialAssistance: false,
    notifications: {
      email: true,
      sms: true,
      push: false,
    },
    services: {
      wifi: true,
      entertainment: true,
      extraLegroom: false,
      priorityBoarding: true,
    },
    travel: {
      carRental: false,
      hotelBooking: true,
      insurance: true,
    },
  })

  const handlePreferenceChange = (category: string, key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        //...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleSimpleChange = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="space-y-8">
      {/* Seat Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plane className="w-5 h-5" />
          Preferencias de Asiento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: "window", label: "Ventana" },
            { value: "aisle", label: "Pasillo" },
            { value: "middle", label: "Centro" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <input
                type="radio"
                name="seatPreference"
                value={option.value}
                checked={preferences.seatPreference === option.value}
                onChange={(e) => handleSimpleChange("seatPreference", e.target.value)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Meal Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Utensils className="w-5 h-5" />
          Preferencias de Comida
        </h3>
        <select
          value={preferences.mealPreference}
          onChange={(e) => handleSimpleChange("mealPreference", e.target.value)}
          className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="regular">Comida Regular</option>
          <option value="vegetarian">Vegetariana</option>
          <option value="vegan">Vegana</option>
          <option value="kosher">Kosher</option>
          <option value="halal">Halal</option>
          <option value="gluten-free">Sin Gluten</option>
          <option value="diabetic">Diabética</option>
        </select>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferencias de Notificaciones</h3>
        <div className="space-y-4">
          {[
            { key: "email", label: "Notificaciones por Email" },
            { key: "sms", label: "Notificaciones por SMS" },
            { key: "push", label: "Notificaciones Push" },
          ].map((notification) => (
            <label key={notification.key} className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.notifications[notification.key as keyof typeof preferences.notifications]}
                onChange={(e) => handlePreferenceChange("notifications", notification.key, e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary rounded"
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">{notification.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Wifi className="w-5 h-5" />
          Servicios Preferidos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "wifi", label: "WiFi a Bordo", icon: <Wifi className="w-4 h-4" /> },
            { key: "entertainment", label: "Entretenimiento", icon: <Music className="w-4 h-4" /> },
            { key: "extraLegroom", label: "Espacio Extra para Piernas", icon: <Plane className="w-4 h-4" /> },
            { key: "priorityBoarding", label: "Abordaje Prioritario", icon: <Plane className="w-4 h-4" /> },
          ].map((service) => (
            <label
              key={service.key}
              className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={preferences.services[service.key as keyof typeof preferences.services]}
                onChange={(e) => handlePreferenceChange("services", service.key, e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary rounded"
              />
              <span className="ml-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                {service.icon}
                {service.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Travel Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Car className="w-5 h-5" />
          Servicios de Viaje
        </h3>
        <div className="space-y-4">
          {[
            { key: "carRental", label: "Alquiler de Autos", icon: <Car className="w-4 h-4" /> },
            { key: "hotelBooking", label: "Reservas de Hotel", icon: <Hotel className="w-4 h-4" /> },
            { key: "insurance", label: "Seguro de Viaje", icon: <Plane className="w-4 h-4" /> },
          ].map((service) => (
            <label key={service.key} className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.travel[service.key as keyof typeof preferences.travel]}
                onChange={(e) => handlePreferenceChange("travel", service.key, e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary rounded"
              />
              <span className="ml-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                {service.icon}
                {service.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Special Assistance */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Asistencia Especial</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={preferences.specialAssistance}
            onChange={(e) => handleSimpleChange("specialAssistance", e.target.checked)}
            className="w-4 h-4 text-primary focus:ring-primary rounded"
          />
          <span className="ml-3 text-gray-700 dark:text-gray-300">Requiero asistencia especial durante el viaje</span>
        </label>
        {preferences.specialAssistance && (
          <textarea
            placeholder="Describe el tipo de asistencia que necesitas..."
            className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
          />
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          Guardar Preferencias
        </button>
      </div>
    </div>
  )
}
