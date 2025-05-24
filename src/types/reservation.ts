export interface Passenger {
  firstName: string
  lastName: string
  email: string
  phone: string
  documentType: string
  documentNumber: string
}

export interface Payment {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
}

export interface Reservation {
  id: string
  flightId: string
  passenger: Passenger
  payment: Payment
  totalPrice: number
  currency: string
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
}

// Importar el tipo Flight
import type { Flight } from "./flight"

// Nuevo tipo que combina reservación con información del vuelo
export interface ReservationWithFlight extends Reservation {
  flight: Flight
}

// Tipo para el historial de vuelos
export interface FlightHistoryItem {
  id: string
  flightNumber: string
  date: string
  route: string
  departureTime: string
  arrivalTime: string
  status: "completed" | "cancelled"
  totalPaid: number
  currency: string
  miles: number
}
