import FlightResults from "@/components/Flights/FlightResults"
import SearchSummary from "@/components/Flights/SearchSummary"
import FlightFilters from "@/components/Flights/FlightFilters"

export const metadata = {
  title: "Resultados de Búsqueda | Ali Airways",
  description: "Encuentra y reserva tu vuelo ideal con Ali Airways",
}

const ResultadosBusqueda = () => {
  return (
    <>
      <section className="pt-[150px] pb-[120px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar con filtros */}
            <div className="w-full lg:w-1/4">
              <FlightFilters />
            </div>

            {/* Resultados de vuelos */}
            <div className="w-full lg:w-3/4">
              <SearchSummary />
              <FlightResults />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ResultadosBusqueda
