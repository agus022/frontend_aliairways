"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import {
  DollarSign,
  Banknote,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Download,
  Eye,
  Building2,
} from "lucide-react"

type Payroll = {
  base_salary: string
  bonus: string
  deduction: string
  net_salary: string
  total_earnings: string
  company: string
  date_issued: string
  period_start: string
  period_end: string
}

type Employee = {
  employee_id: string
  first_name: string
  title: string
  salary: string
}

export default function PayrollDashboard() {
  const { data: session } = useSession()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [payrolls, setPayrolls] = useState<Payroll[]>([])

  useEffect(() => {
    const fetchPayrollData = async () => {
      if (!session?.user?.userId || !session?.accessToken) return

      try {
        const [payrollRes, employeeRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payrolls/payrollsByEmployee/${session.user.userId}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payrolls/dataEmployee/${session.user.userId}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }),
        ])

        const [payrollData, employeeData] = await Promise.all([
          payrollRes.json(),
          employeeRes.json(),
        ])

        setPayrolls(payrollData)
        setEmployee(employeeData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchPayrollData()
  }, [session])

  const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(value))

  const totalGross = payrolls.reduce((acc, p) => acc + parseFloat(p.total_earnings), 0)
  const totalNet = payrolls.reduce((acc, p) => acc + parseFloat(p.net_salary), 0)
  const totalBonuses = payrolls.reduce((acc, p) => acc + parseFloat(p.bonus), 0)
  const totalDeductions = payrolls.reduce((acc, p) => acc + parseFloat(p.deduction), 0)

  const generatePayrollPDF = (payroll: Payroll, index: number) => {
  const doc = new jsPDF()
  const title = `Recibo de Nómina - ${payroll.company}`

  doc.setFontSize(16)
  doc.text(title, 14, 20)

  doc.setFontSize(12)
  doc.text(`Periodo: ${new Date(payroll.period_start).toLocaleDateString()} - ${new Date(payroll.period_end).toLocaleDateString()}`, 14, 30)
  doc.text(`Fecha de emisión: ${new Date(payroll.date_issued).toLocaleDateString()}`, 14, 38)
 
  doc.setFontSize(15)
  doc.text(`Empleado: ${employee.first_name}`, 14, 46)
  
  doc.setFontSize(16)
  doc.text(`Trabajador en: ${employee.title}`, 14, 54)
  
  autoTable(doc, {
    startY: 62,
    head: [["Concepto", "Monto"]],
    body: [
      ["Salario base", formatCurrency(payroll.base_salary)],
      ["Bonificación", formatCurrency(payroll.bonus)],
      ["Deducción", `-${formatCurrency(payroll.deduction)}`],
      ["Ganancias totales", formatCurrency(payroll.total_earnings)],
      ["Salario neto", formatCurrency(payroll.net_salary)],
      ["Empresa", payroll.company],
    ],
  })

  doc.save(`nomina_${payroll.company}_${index + 1}.pdf`)
}
  const summaryCards = [
    {
      label: "Total Bruto",
      value: formatCurrency(totalGross),
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Total Neto",
      value: formatCurrency(totalNet),
      icon: Banknote,
      color: "text-blue-600",
    },
    {
      label: "Bonificaciones",
      value: formatCurrency(totalBonuses),
      icon: ArrowUpCircle,
      color: "text-emerald-500",
    },
    {
      label: "Deducciones",
      value: `-${formatCurrency(totalDeductions)}`,
      icon: ArrowDownCircle,
      color: "text-red-500",
    },
  ]
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Nómina de Empleado
          <Building2 className="w-6 h-6 text-primary" />
        </h1>
        {employee && (
          <div className="mt-2 text-gray-600 dark:text-gray-300 space-y-1">
            <p className="text-lg font-medium">
              {employee.first_name} — {employee.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: {employee.employee_id} • Salario base: {formatCurrency(employee.salary)}
            </p>
          </div>
        )}
      </div>

      {/* Resumen con iconos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center gap-4">
            <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Historial de pagos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Historial de Pagos
        </h2>
        <div className="space-y-4">
          {payrolls.map((p, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {new Date(p.period_start).toLocaleDateString()} - {new Date(p.period_end).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  Emitido: {new Date(p.date_issued).toLocaleDateString()}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-800 dark:text-gray-200">
                <p>Salario base: {formatCurrency(p.base_salary)}</p>
                <p>Bonificación: {formatCurrency(p.bonus)}</p>
                <p>Deducción: -{formatCurrency(p.deduction)}</p>
                <p>Total ganado: {formatCurrency(p.total_earnings)}</p>
                <p>Salario neto: {formatCurrency(p.net_salary)}</p>
                <p>Empresa: {p.company}</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => generatePayrollPDF(p, idx)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                  <Download className="w-4 h-4" /> Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
