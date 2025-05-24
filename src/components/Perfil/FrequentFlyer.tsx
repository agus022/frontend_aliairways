"use client"

import { useState } from "react"
import { Star, Gift, Plane, Calendar, Trophy, Award, CreditCard } from "lucide-react"

export default function FrequentFlyer() {
  const [membershipData] = useState({
    memberNumber: "AA123456789",
    status: "Gold",
    currentMiles: 45750,
    milesNeeded: 24250,
    nextStatus: "Platinum",
    yearlyMiles: 45750,
    lifetimeMiles: 125430,
    statusExpiry: "31 Dic 2024",
    benefits: [
      "Abordaje prioritario",
      "Equipaje adicional gratuito",
      "Acceso a salas VIP",
      "Upgrade gratuito cuando disponible",
      "Millas de bonificación 50%",
    ],
  })

  const statusLevels = [
    { name: "Silver", miles: 25000, color: "bg-gray-400" },
    { name: "Gold", miles: 50000, color: "bg-yellow-400" },
    { name: "Platinum", miles: 75000, color: "bg-purple-400" },
    { name: "Diamond", miles: 100000, color: "bg-blue-400" },
  ]

  const currentStatusIndex = statusLevels.findIndex((level) => level.name === membershipData.status)
  const progressPercentage = (membershipData.currentMiles / statusLevels[currentStatusIndex + 1]?.miles) * 100

  return (
    <div className="space-y-8">
      {/* Membership Status Card */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Ali Airways Elite</h3>
            <p className="text-primary-foreground/80">Miembro {membershipData.status}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary-foreground/80">Número de Miembro</p>
            <p className="text-lg font-mono">{membershipData.memberNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-primary-foreground/80">Millas Actuales</p>
            <p className="text-2xl font-bold">{membershipData.currentMiles.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-primary-foreground/80">Millas del Año</p>
            <p className="text-2xl font-bold">{membershipData.yearlyMiles.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-primary-foreground/80">Millas de por Vida</p>
            <p className="text-2xl font-bold">{membershipData.lifetimeMiles.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Progress to Next Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Progreso al Siguiente Nivel
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">
              {membershipData.status} → {membershipData.nextStatus}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {membershipData.milesNeeded.toLocaleString()} millas restantes
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            Estás a {membershipData.milesNeeded.toLocaleString()} millas de alcanzar el estatus{" "}
            {membershipData.nextStatus}
          </p>
        </div>
      </div>

      {/* Status Benefits */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Beneficios de tu Estatus {membershipData.status}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {membershipData.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Levels */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Niveles de Membresía
        </h3>

        <div className="space-y-4">
          {statusLevels.map((level, index) => (
            <div
              key={level.name}
              className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                level.name === membershipData.status
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${level.color}`}></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{level.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {level.miles.toLocaleString()} millas anuales
                  </p>
                </div>
              </div>
              {level.name === membershipData.status && (
                <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">Actual</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Detalles de la Cuenta
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Miembro</label>
            <input
              type="text"
              value={membershipData.memberNumber}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vencimiento del Estatus
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{membershipData.statusExpiry}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Plane className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="font-medium text-yellow-800 dark:text-yellow-300">Recordatorio de Renovación</span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Tu estatus {membershipData.status} vence el {membershipData.statusExpiry}. Asegúrate de volar lo suficiente
            para mantener tu nivel o alcanzar el siguiente.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          Canjear Millas
        </button>
        <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
          Ver Historial de Millas
        </button>
      </div>
    </div>
  )
}
