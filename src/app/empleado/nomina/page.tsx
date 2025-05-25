"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import EmployeeHeader from "@/components/EmployeeHeader"
import PayrollDashboard from "@/components/Empleado/PayrollDashboard"

const EmpleadoNominaPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session || session.user.role !== "employee") {
      router.push("/signin")
    }
  }, [session, status, router])

  if (status === "loading") {
    return <p className="text-center mt-20">Cargando...</p>
  }

  return (
    <>
      <EmployeeHeader />
      <section className="pt-[120px] pb-[120px]">
        <div className="container">
          <PayrollDashboard />
        </div>
      </section>
    </>
  )
}

export default EmpleadoNominaPage
