import type { Metadata } from "next"
import ProfileTabs from "@/components/Perfil/ProfileTabs"

export const metadata: Metadata = {
  title: "Mi Perfil | Ali Airways",
  description: "Gestiona tu perfil y preferencias de viaje",
}

export default function PerfilPage() {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Mi Perfil</h1>

          <ProfileTabs />
        </div>
      </div>
    </section>
  )
}
