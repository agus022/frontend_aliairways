"use client"

import type React from "react"

import { useState } from "react"

interface PaymentInfoProps {
  initialData: {
    cardNumber: string
    cardHolder: string
    expiryDate: string
    cvv: string
  }
  onSubmit: (data: PaymentInfoProps["initialData"]) => void
  onBack: () => void
  totalPrice: string
  isSubmitting: boolean
}

const PaymentInfo = ({ initialData, onSubmit, onBack, totalPrice, isSubmitting }: PaymentInfoProps) => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Formatear número de tarjeta
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)
    }

    // Formatear fecha de expiración
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5)
    }

    // Limitar CVV a 3-4 dígitos
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }))

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "El número de tarjeta es requerido"
    } else if (formData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "El número de tarjeta debe tener 16 dígitos"
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "El nombre del titular es requerido"
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "La fecha de expiración es requerida"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Formato inválido (MM/YY)"
    } else {
      const [month, year] = formData.expiryDate.split("/")
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1

      if (
        Number.parseInt(year) < currentYear ||
        (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth) ||
        Number.parseInt(month) > 12 ||
        Number.parseInt(month) < 1
      ) {
        newErrors.expiryDate = "La fecha de expiración no es válida"
      }
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "El código de seguridad es requerido"
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = "El código de seguridad debe tener 3 o 4 dígitos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Información de Pago</h3>

      <div className="mb-6">
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Número de Tarjeta
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.cardNumber ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          }`}
        />
        {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Titular de la Tarjeta
        </label>
        <input
          type="text"
          id="cardHolder"
          name="cardHolder"
          value={formData.cardHolder}
          onChange={handleChange}
          placeholder="NOMBRE COMO APARECE EN LA TARJETA"
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.cardHolder ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          }`}
        />
        {errors.cardHolder && <p className="mt-1 text-sm text-red-500">{errors.cardHolder}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de Expiración
          </label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.expiryDate ? "border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Código de Seguridad (CVV)
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.cvv ? "border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Total a pagar:</span>
          <span className="text-xl font-bold text-primary">{totalPrice}</span>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Volver
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Procesando..." : "Completar Reserva"}
        </button>
      </div>
    </form>
  )
}

export default PaymentInfo
