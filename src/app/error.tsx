"use client"

import Link from "next/link"
import { useEffect } from "react"

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="relative z-10 pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[530px] text-center">
              <div className="mx-auto text-center mb-9">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  <path
                    d="M40 0C17.9083 0 0 17.9083 0 40C0 62.0917 17.9083 80 40 80C62.0917 80 80 62.0917 80 40C80 17.9083 62.0917 0 40 0ZM40 72.5C22.0783 72.5 7.5 57.9217 7.5 40C7.5 22.0783 22.0783 7.5 40 7.5C57.9217 7.5 72.5 22.0783 72.5 40C72.5 57.9217 57.9217 72.5 40 72.5Z"
                    fill="#4A6CF7"
                  />
                  <path d="M42.5 42.5H37.5V20H42.5V42.5ZM42.5 60H37.5V55H42.5V60Z" fill="#4A6CF7" />
                </svg>
              </div>
              <h3 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
                ¡Turbulencias inesperadas!
              </h3>
              <p className="mb-6 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                Parece que hemos experimentado algunas turbulencias técnicas.
              </p>
              <p className="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed italic">
                "Nuestros ingenieros de vuelo están trabajando para resolver el problema. Por favor, permanezca en su
                asiento con el cinturón abrochado o intente volver a la ruta principal."
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={reset}
                  className="px-8 py-3 text-base font-bold text-white duration-300 rounded-md bg-primary shadow-signUp hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9"
                >
                  Intentar de nuevo
                </button>
                <Link
                  href="/"
                  className="px-8 py-3 text-base font-bold text-primary border border-primary duration-300 rounded-md bg-transparent shadow-signUp hover:bg-primary hover:text-white md:px-9 lg:px-8 xl:px-9"
                >
                  Volver a la Página Principal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Error
