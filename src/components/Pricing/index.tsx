"use client"
import { useState } from "react"
import SectionTitle from "../Common/SectionTitle"
import OfferList from "./OfferList"
import PricingBox from "./PricingBox"

const Pricing = () => {
  const [isIndividual, setIsIndividual] = useState(true)

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Nuestras Clases y Programas"
          paragraph="Descubre las diferentes opciones de viaje que Ali Airways tiene para ti. Desde vuelos individuales hasta programas de fidelidad diseñados para viajeros frecuentes."
          center
          width="665px"
        />

        <div className="w-full">
          <div className="mb-8 flex justify-center md:mb-12 lg:mb-16">
            <span
              onClick={() => setIsIndividual(true)}
              className={`${
                isIndividual ? "pointer-events-none text-primary" : "text-dark dark:text-white"
              } mr-4 cursor-pointer text-base font-semibold`}
            >
              Vuelos Individuales
            </span>
            <div onClick={() => setIsIndividual(!isIndividual)} className="flex cursor-pointer items-center">
              <div className="relative">
                <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
                <div
                  className={`${
                    isIndividual ? "" : "translate-x-full"
                  } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition`}
                >
                  <span className="active h-4 w-4 rounded-full bg-white"></span>
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsIndividual(false)}
              className={`${
                isIndividual ? "text-dark dark:text-white" : "pointer-events-none text-primary"
              } ml-4 cursor-pointer text-base font-semibold`}
            >
              Programas de Fidelidad
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {isIndividual ? (
            <>
              <PricingBox
                packageName="Clase Económica"
                price={"1,499"}
                duration={"vuelo"}
                subtitle="La opción ideal para viajeros que buscan comodidad a un precio accesible."
              >
                <OfferList text="Equipaje de mano (10kg)" status="active" />
                <OfferList text="Selección de asiento estándar" status="active" />
                <OfferList text="Comida y bebida a bordo" status="active" />
                <OfferList text="Entretenimiento a bordo" status="active" />
                <OfferList text="Cambios de vuelo flexibles" status="inactive" />
                <OfferList text="Acceso a sala VIP" status="inactive" />
              </PricingBox>
              <PricingBox
                packageName="Clase Ejecutiva"
                price={"3,999"}
                duration={"vuelo"}
                subtitle="Mayor comodidad y servicios premium para viajeros de negocios y placer."
              >
                <OfferList text="Equipaje de mano (10kg) + documentado (23kg)" status="active" />
                <OfferList text="Selección de asiento preferente" status="active" />
                <OfferList text="Menú gourmet y bebidas premium" status="active" />
                <OfferList text="Entretenimiento a bordo personalizado" status="active" />
                <OfferList text="Cambios de vuelo flexibles" status="active" />
                <OfferList text="Acceso a sala VIP" status="inactive" />
              </PricingBox>
              <PricingBox
                packageName="Primera Clase"
                price={"7,999"}
                duration={"vuelo"}
                subtitle="La experiencia de vuelo más exclusiva con atención personalizada y máximo confort."
              >
                <OfferList text="Equipaje de mano (10kg) + documentado (32kg)" status="active" />
                <OfferList text="Asientos cama completamente reclinables" status="active" />
                <OfferList text="Menú gourmet de chef reconocido" status="active" />
                <OfferList text="Sistema de entretenimiento premium" status="active" />
                <OfferList text="Cambios y cancelaciones sin costo" status="active" />
                <OfferList text="Acceso a sala VIP y servicio de concierge" status="active" />
              </PricingBox>
            </>
          ) : (
            <>
              <PricingBox
                packageName="Ali Basic"
                price={"0"}
                duration={"inscripción"}
                subtitle="Programa básico para todos nuestros pasajeros. ¡Comienza a acumular millas desde tu primer vuelo!"
              >
                <OfferList text="Acumulación de millas por vuelo" status="active" />
                <OfferList text="Canje de millas por vuelos" status="active" />
                <OfferList text="Ofertas exclusivas por email" status="active" />
                <OfferList text="Check-in prioritario" status="inactive" />
                <OfferList text="Equipaje adicional" status="inactive" />
                <OfferList text="Upgrades de clase" status="inactive" />
              </PricingBox>
              <PricingBox
                packageName="Ali Gold"
                price={"2,499"}
                duration={"año"}
                subtitle="Para viajeros frecuentes que buscan más beneficios y comodidad en cada viaje."
              >
                <OfferList text="Todas las ventajas de Ali Basic" status="active" />
                <OfferList text="Acumulación de millas x2" status="active" />
                <OfferList text="Check-in prioritario" status="active" />
                <OfferList text="1 pieza de equipaje adicional" status="active" />
                <OfferList text="Acceso a salas VIP (2 veces al año)" status="active" />
                <OfferList text="Upgrades de clase automáticos" status="inactive" />
              </PricingBox>
              <PricingBox
                packageName="Ali Platinum"
                price={"5,999"}
                duration={"año"}
                subtitle="La membresía premium para los viajeros más exigentes. Máximos beneficios y atención personalizada."
              >
                <OfferList text="Todas las ventajas de Ali Gold" status="active" />
                <OfferList text="Acumulación de millas x3" status="active" />
                <OfferList text="Fast Track en seguridad" status="active" />
                <OfferList text="2 piezas de equipaje adicional" status="active" />
                <OfferList text="Acceso ilimitado a salas VIP" status="active" />
                <OfferList text="Upgrades de clase (sujeto a disponibilidad)" status="active" />
              </PricingBox>
            </>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg width="239" height="601" viewBox="0 0 239 601" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  )
}

export default Pricing
