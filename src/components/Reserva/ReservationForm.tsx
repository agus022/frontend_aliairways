"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PassengerInfo from "./PassengerInfo"
import PaymentInfo from "./PaymentInfo"

interface ReservationFormProps {
  flightId: string
  totalPrice: number
  currency: string
}

const ReservationForm = ({ flightId, totalPrice, currency }: ReservationFormProps) => {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [passengerData, setPassengerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    documentType: "passport",
    documentNumber: "",
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePassengerSubmit = (data: typeof passengerData) => {
    setPassengerData(data)
    setStep(2)
    window.scrollTo(0, 0)
  }

  const handlePaymentSubmit = async (data: typeof paymentData) => {
    setPaymentData(data)
    setIsSubmitting(true)

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redireccionar a página de confirmación (se implementará después)
    router.push(`/reserva/confirmacion?id=${flightId}`)
  }

  const handleBack = () => {
    setStep(1)
    window.scrollTo(0, 0)
  }

  // Formatear precio
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Pasos de la reserva */}
      <div className="flex mb-8">
        <div className={`flex-1 text-center pb-4 relative ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
          >
            1
          </div>
          <span className="text-sm font-medium">Información del Pasajero</span>
          <div className={`absolute bottom-0 left-1/2 right-0 h-1 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
        </div>
        <div className={`flex-1 text-center pb-4 ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
          >
            2
          </div>
          <span className="text-sm font-medium">Pago</span>
        </div>
      </div>

      {/* Formulario según el paso actual */}
      {step === 1 ? (
        <PassengerInfo initialData={passengerData} onSubmit={handlePassengerSubmit} />
      ) : (
        <PaymentInfo
          initialData={paymentData}
          onSubmit={handlePaymentSubmit}
          onBack={handleBack}
          totalPrice={formatPrice(totalPrice, currency)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}

export default ReservationForm
