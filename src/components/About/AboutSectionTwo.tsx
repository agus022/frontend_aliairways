import Image from "next/image"

const AboutSectionTwo = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div className="relative mx-auto mb-12 aspect-25/24 max-w-[500px] text-center lg:m-0" data-wow-delay=".15s">
              <Image
                src="/images/about/about-image-2.svg"
                alt="Fundadores de Ali Airways"
                fill
                className="drop-shadow-three dark:hidden dark:drop-shadow-none"
              />
              <Image
                src="/images/about/about-image-2-dark.svg"
                alt="Fundadores de Ali Airways"
                fill
                className="hidden drop-shadow-three dark:block dark:drop-shadow-none"
              />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Nuestros Fundadores
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Ali Airways fue fundada por cuatro estudiantes visionarios del Tecnológico de México en Celaya, quienes
                  combinaron sus talentos y pasión por la aviación para crear una aerolínea diferente.
                </p>
              </div>
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Equipo Directivo
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  <strong>Ali Vladimir Cañada</strong> (CEO), <strong>Agustin Flores</strong> (COO),{" "}
                  <strong>Natasha Sevilla</strong> (CMO), <strong>Cristian Castañeda</strong> (CTO) {" "}
                   lideran nuestra compañía con innovación y compromiso.
                </p>
              </div>
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Nuestra Misión
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Conectar personas y destinos con un servicio de excelencia, seguridad y responsabilidad ambiental,
                  transformando cada vuelo en una experiencia memorable para nuestros pasajeros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSectionTwo
