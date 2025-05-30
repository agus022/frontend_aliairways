import { MapPin, Plane, Users,Clock, ArrowLeft, ArrowRight  } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect,useState } from "react"
import { useSession } from "next-auth/react"

interface ReservationCardProps {
  reservation: any
}

export default function ReservationCard({ reservation }: ReservationCardProps) {
  //const { flight, passenger, status, createdAt } = reservation
  const { data: session, status } = useSession()
  const router = useRouter();

  //console.log("ReservationCard Props:", reservation)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Fallido":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Completado":
        return "Confirmada"
      case "Fallido":
        return "Fallida"
      case "Cancelado":
        return "Cancelada"
      case "Pendiente":
        return "Pendiente"
      default:
        return "Desconocido"
    }
  }

  const handleCheckIn =()=>{
    router.push(`/check-in?reservationId=${reservation.reservation_id}&lastName=${reservation.last_name}`);

  }
  const handleCancell=async()=>{
    try {
        const res =await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reservations/cancelReservation/${reservation.reservation_id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
      });
      
        //const contentType = res.headers.get("content-type");
      console.log(res);
        if (!res.ok) {
          console.log("Error al cancelar la reservación:");
        }
    }catch (error) {
        console.error("Error al cancelar la reservación:", error);
    }
  }
  function getTimeDifference(departureTime: string, arrivalTime: string): { hours: number, minutes: number } {
    const [depHour, depMin] = departureTime.split(":").map(Number)
    const [arrHour, arrMin] = arrivalTime.split(":").map(Number)

    const depDate = new Date(0, 0, 0, depHour, depMin)
    let arrDate = new Date(0, 0, 0, arrHour, arrMin)

    // Si la hora de llegada es menor, asumimos que es el día siguiente
    if (arrDate <= depDate) {
      arrDate.setDate(arrDate.getDate() + 1)
    }

    const diffMs = arrDate.getTime() - depDate.getTime()
    const diffMin = Math.floor(diffMs / 1000 / 60)
    const hours = Math.floor(diffMin / 60)
    const minutes = diffMin % 60

    return { hours, minutes }
  }

  const duration = getTimeDifference(reservation.departure_time, reservation.arrival_time)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{reservation?.flight_id ?? "Cargando..."}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                {getStatusText(reservation.status)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Reservación: ALI-{reservation?.reservation_id?? "Cargando..."}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${reservation?.total ?? "Cargando..."}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Precio total</p>
          </div>
        </div>

        {/* Flight Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{reservation?.cityorigin??"Cargando....."}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{reservation?.airportorigin??"Cargando....."}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{reservation?.departure_time??"Cargando....."}</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center">
              <Plane className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {duration.hours}h {duration.minutes}m
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{reservation?.citydestination??"Cargando....."}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{reservation?.airportdestination??"Cargando....."}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{reservation?.departure_time??"Cargando....."}</p>
            </div>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Pasajero</span>
          </div>
          <p className="text-gray-900 dark:text-white font-medium">
            {reservation?.last_name??"Cargando....."}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{reservation?.email??"Cargando....."}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
      
          <button 
            onClick={handleCheckIn}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
            Check-in
          </button>
          <button 
            onClick={handleCancell}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
