"use client"

import { useState } from "react"
import { DollarSign, Calendar, Download, Eye, TrendingUp, Clock } from "lucide-react"

export default function PayrollDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("current")

  // Mock data para nómina
  const payrollData = {
    employee: {
      name: "Carlos Mendoza",
      id: "EMP-001",
      position: "Piloto Comercial",
      department: "Operaciones de Vuelo",
      hireDate: "2020-03-15",
    },
    currentPeriod: {
      period: "Febrero 2024",
      startDate: "2024-02-01",
      endDate: "2024-02-29",
      payDate: "2024-03-05",
      status: "processed",
      grossSalary: 85000,
      netSalary: 62750,
      deductions: {
        taxes: 15300,
        socialSecurity: 4250,
        healthInsurance: 2700,
        total: 22250,
      },
      bonuses: {
        flightHours: 8500,
        performance: 5000,
        punctuality: 2000,
        total: 15500,
      },
      hours: {
        regular: 160,
        overtime: 24,
        flight: 85,
        standby: 16,
      },
    },
    yearToDate: {
      grossEarnings: 170000,
      netEarnings: 125500,
      totalDeductions: 44500,
      totalBonuses: 31000,
      totalHours: 368,
      flightHours: 170,
    },
    payHistory: [
      {
        period: "Enero 2024",
        payDate: "2024-02-05",
        grossSalary: 85000,
        netSalary: 62750,
        status: "paid",
      },
      {
        period: "Diciembre 2023",
        payDate: "2024-01-05",
        grossSalary: 90000,
        netSalary: 66250,
        status: "paid",
      },
      {
        period: "Noviembre 2023",
        payDate: "2023-12-05",
        grossSalary: 85000,
        netSalary: 62750,
        status: "paid",
      },
    ],
    benefits: [
      {
        name: "Seguro de vida",
        coverage: "$500,000 MXN",
        premium: "Pagado por la empresa",
      },
      {
        name: "Seguro médico mayor",
        coverage: "Familiar",
        premium: "$2,700 MXN/mes",
      },
      {
        name: "Fondo de ahorro",
        coverage: "6% del salario",
        premium: "Aportación patronal 6%",
      },
      {
        name: "Vacaciones",
        coverage: "20 días anuales",
        premium: "Prima vacacional 25%",
      },
    ],
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "paid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "processed":
        return "Procesado"
      case "pending":
        return "Pendiente"
      case "paid":
        return "Pagado"
      default:
        return "Desconocido"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nómina</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {payrollData.employee.name} - {payrollData.employee.position}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: {payrollData.employee.id} | Departamento: {payrollData.employee.department}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                payrollData.currentPeriod.status,
              )}`}
            >
              {getStatusText(payrollData.currentPeriod.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Current Period Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Salario Bruto</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(payrollData.currentPeriod.grossSalary)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Salario Neto</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(payrollData.currentPeriod.netSalary)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bonificaciones</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(payrollData.currentPeriod.bonuses.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Horas de Vuelo</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {payrollData.currentPeriod.hours.flight}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Period Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Período Actual</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              {payrollData.currentPeriod.period}
            </div>
          </div>

          {/* Period Info */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Inicio del período</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(payrollData.currentPeriod.startDate).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Fin del período</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(payrollData.currentPeriod.endDate).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Fecha de pago</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(payrollData.currentPeriod.payDate).toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
          </div>

          {/* Hours Breakdown */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Desglose de Horas</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Horas regulares</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {payrollData.currentPeriod.hours.regular}h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Horas extra</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {payrollData.currentPeriod.hours.overtime}h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Horas de vuelo</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {payrollData.currentPeriod.hours.flight}h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Standby</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {payrollData.currentPeriod.hours.standby}h
                </span>
              </div>
            </div>
          </div>

          {/* Bonuses */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Bonificaciones</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Horas de vuelo</span>
                <span className="text-sm font-medium text-green-600">
                  +{formatCurrency(payrollData.currentPeriod.bonuses.flightHours)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rendimiento</span>
                <span className="text-sm font-medium text-green-600">
                  +{formatCurrency(payrollData.currentPeriod.bonuses.performance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Puntualidad</span>
                <span className="text-sm font-medium text-green-600">
                  +{formatCurrency(payrollData.currentPeriod.bonuses.punctuality)}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Deducciones</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Impuestos</span>
                <span className="text-sm font-medium text-red-600">
                  -{formatCurrency(payrollData.currentPeriod.deductions.taxes)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Seguridad Social</span>
                <span className="text-sm font-medium text-red-600">
                  -{formatCurrency(payrollData.currentPeriod.deductions.socialSecurity)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Seguro médico</span>
                <span className="text-sm font-medium text-red-600">
                  -{formatCurrency(payrollData.currentPeriod.deductions.healthInsurance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Year to Date & History */}
        <div className="space-y-6">
          {/* Year to Date */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Acumulado del Año</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Ingresos brutos</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(payrollData.yearToDate.grossEarnings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Ingresos netos</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(payrollData.yearToDate.netEarnings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total deducciones</span>
                <span className="text-sm font-medium text-red-600">
                  -{formatCurrency(payrollData.yearToDate.totalDeductions)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total bonificaciones</span>
                <span className="text-sm font-medium text-green-600">
                  +{formatCurrency(payrollData.yearToDate.totalBonuses)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Horas de vuelo</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {payrollData.yearToDate.flightHours}h
                </span>
              </div>
            </div>
          </div>

          {/* Pay History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Historial de Pagos</h2>
            <div className="space-y-4">
              {payrollData.payHistory.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{payment.period}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pagado: {new Date(payment.payDate).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(payment.netSalary)}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                      <button className="text-primary hover:text-primary/80">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-primary hover:text-primary/80">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Beneficios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {payrollData.benefits.map((benefit, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{benefit.name}</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cobertura</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{benefit.coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Prima</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{benefit.premium}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Acciones</h2>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md font-medium transition duration-300">
            <Download className="w-4 h-4" />
            Descargar Recibo Actual
          </button>
          <button className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md font-medium transition duration-300">
            <Eye className="w-4 h-4" />
            Ver Detalles Completos
          </button>
          <button className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md font-medium transition duration-300">
            <Calendar className="w-4 h-4" />
            Historial Completo
          </button>
        </div>
      </div>
    </div>
  )
}
