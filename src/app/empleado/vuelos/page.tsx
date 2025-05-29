"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AssignedFlights from "@/components/Empleado/AssignedFlights"

const EmpleadoVuelosPage = () => {
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
      <section className="pt-[120px] pb-[120px]">
        <div className="container">
          <AssignedFlights />
        </div>
      </section>
    </>
  )
}

export default EmpleadoVuelosPage
