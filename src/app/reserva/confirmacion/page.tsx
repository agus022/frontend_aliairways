import Link from "next/link"
import { CheckCircle } from "lucide-react"

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>
}

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
const reservationId = typeof searchParams.id === "string" ? searchParams.id : "unknown"
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">¡Reserva Confirmada!</h1>
            <p className="text-gray-600 dark:text-gray-300">Tu reserva ha sido procesada exitosamente.</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-md mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Detalles de la Reserva</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Número de Reserva:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ALI-{reservationId.slice(0, 6).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                <span className="font-medium text-green-600">Confirmada</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Fecha de Reserva:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Próximos Pasos</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full mr-2 flex-shrink-0 text-xs">
                  1
                </span>
                <span>Hemos enviado un correo electrónico con los detalles de tu reserva.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full mr-2 flex-shrink-0 text-xs">
                  2
                </span>
                <span>Puedes realizar el check-in en línea 24 horas antes de tu vuelo.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full mr-2 flex-shrink-0 text-xs">
                  3
                </span>
                <span>
                  Llega al aeropuerto al menos 2 horas antes para vuelos nacionales y 3 horas para vuelos
                  internacionales.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out text-center"
            >
              Volver a Inicio
            </Link>
            <Link
              href="#"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out text-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Ver Mis Reservas
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
