// Definición del tipo Flight para los vuelos
export interface Flight {
  id: string
  airline: string
  airlineLogo: string
  flightNumber: string
  departureTime: string
  arrivalTime: string
  departureAirport: string
  arrivalAirport: string
  departureCity: string
  arrivalCity: string
  durationMinutes: number
  price: number
  taxes: number
  currency: string
  aircraft: string
  stops: number
  availableSeats: number
}

// Tipos para los filtros de vuelos
export interface Airline {
  id: string
  name: string
}

export interface PriceRange {
  id: string
  name: string
  min: number
  max: number
}

export interface StopOption {
  id: string
  name: string
  value: number
}

export interface DepartureTimeOption {
  id: string
  name: string
  start: number
  end: number
}

// Tipo para los parámetros de búsqueda
export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass?: string
}
