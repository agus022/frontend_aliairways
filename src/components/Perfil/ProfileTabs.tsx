"use client"

import { useState } from "react"
import PersonalInfo from "./PersonalInfo"
import TravelPreferences from "./TravelPreferences"
import FrequentFlyer from "./FrequentFlyer"
import { User, Settings, Star } from "lucide-react"

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("personal")

  const tabs = [
    {
      id: "personal",
      label: "Información Personal",
      icon: <User className="w-5 h-5" />,
      component: <PersonalInfo />,
    },
    {
      id: "preferences",
      label: "Preferencias de Viaje",
      icon: <Settings className="w-5 h-5" />,
      component: <TravelPreferences />,
    },
    {
      id: "frequent",
      label: "Viajero Frecuente",
      icon: <Star className="w-5 h-5" />,
      component: <FrequentFlyer />,
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">{tabs.find((tab) => tab.id === activeTab)?.component}</div>
    </div>
  )
}
