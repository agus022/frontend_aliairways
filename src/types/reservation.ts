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
