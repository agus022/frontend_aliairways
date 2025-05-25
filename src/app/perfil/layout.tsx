
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Mi Perfil | Ali Airways",
  description: "Gestiona tu perfil y preferencias de viaje",
}
export default function perfil({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}