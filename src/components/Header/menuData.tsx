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
    {
      id: 7,
      title: "Personas",
      newTab: false,
      submenu: [
        { id: 71, title: "Roles", path: "/views/admin/roles", newTab: false },
        { id: 72, title: "Usuarios", path: "/views/admin/users", newTab: false },
        { id: 74, title: "Trabajos", path: "/views/admin/jobs", newTab: false },
        { id: 75, title: "Horarios", path: "/views/admin/shifts", newTab: false },
        { id: 73, title: "Empleados", path: "/views/admin/employees", newTab: false },

      ],
    },

    {
      id: 4,
      title: "Empresa",
      newTab: false,
      submenu: [
        { id: 41, title: "Vuelos", path: "/views/admin/flights", newTab: false },
        { id: 42, title: "Aeropuertos", path: "/views/admin/airports", newTab: false },
        { id: 43, title: "Aeronaves", path: "/views/admin/aircrafts", newTab: false },
        { id: 43, title: "Asientos", path: "/views/admin/seats", newTab: false },
      ],
    },
  ],

};

export default menusByRole;
