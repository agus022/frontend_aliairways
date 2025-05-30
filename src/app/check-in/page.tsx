import { Suspense } from 'react'
import CheckInSteps from '@/components/CheckIn/CheckInSteps'
import CheckInForm from '@/components/CheckIn/CheckInForm'

export default function CheckInPage() {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Check-in Online
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Confirma tu asistencia, selecciona tu asiento y obtén tu pase de abordar
            </p>
          </div>

          <CheckInSteps />

          <div className="mt-12">
            <Suspense fallback={<div>Cargando formulario...</div>}>
              <CheckInForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
