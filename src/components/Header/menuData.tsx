'use client'
import type { Menu } from "@/types/menu"


export const menusByRole: Record<string, Menu[]> = {
  passenger: [
    { id: 1, title: "Home", path: "/", newTab: false },
    { id: 2, title: "About", path: "/about", newTab: false },
    {
      id: 5,
      title: "Mi Cuenta",
      newTab: false,
      submenu: [
        { id: 51, title: "Mis Reservaciones", path: "/mis-reservaciones", newTab: false },
        { id: 52, title: "Check-in Online", path: "/check-in", newTab: false },
        { id: 53, title: "Mi Perfil", path: "/perfil", newTab: false },
        { id: 54, title: "Historial de Vuelos", path: "/historial-vuelos", newTab: false },
      ],
    },
    { id: 3, title: "Support", path: "/contact", newTab: false },
  ],

  administrator: [
    { id: 1, title: "Dashboard", path: "/views/admin", newTab: false },
    { id: 2, title: "Empleados", path: "/admin/employees", newTab: false },
    { id: 3, title: "Trabajos", path: "/admin/jobs", newTab: false },
    {
      id: 4,
      title: "Empresa",
      newTab: false,
      submenu: [
        { id: 41, title: "Vuelos", path: "/admin/flights", newTab: false },
        { id: 42, title: "Aeropuertos", path: "/admin/airports", newTab: false },
        { id: 43, title: "Aeronaves", path: "/admin/aircrafts", newTab: false },
      ],
    },
    { id: 5, title: "Reservaciones", path: "/admin/reservations", newTab: false },
    { id: 6, title: "Equipaje", path: "/admin/baggage", newTab: false },
  ],

};

export default menusByRole;
