
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Check-in | Ali Airways",
  description: "Gestiona tu check-in y obtén tu pase de abordar",
}
export default function reserva({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}