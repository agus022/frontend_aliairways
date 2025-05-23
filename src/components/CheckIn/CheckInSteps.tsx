import { CheckCircle, Clock, Plane, CreditCard } from "lucide-react"

interface CheckInStepsProps {
  currentStep?: number
}

export default function CheckInSteps({ currentStep = 1 }: CheckInStepsProps) {
  const steps = [
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Ingresa tus datos",
      description: "Número de reservación o datos del pasajero",
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Confirma tu vuelo",
      description: "Verifica los detalles de tu reservación",
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      icon: <Plane className="w-6 h-6" />,
      title: "Selecciona asiento",
      description: "Elige tu asiento preferido",
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Obtén tu pase",
      description: "Descarga tu pase de abordar",
      completed: currentStep > 4,
      current: currentStep === 4,
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Proceso de Check-in</h2>

      <div className="flex flex-col md:flex-row justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center mb-6 md:mb-0 relative">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                step.completed
                  ? "bg-green-500 text-white"
                  : step.current
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {step.completed ? <CheckCircle className="w-6 h-6" /> : step.icon}
            </div>

            <h3 className={`font-semibold mb-1 ${step.current ? "text-primary" : "text-gray-900 dark:text-white"}`}>
              {step.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-32">{step.description}</p>

            {index < steps.length - 1 && (
              <div
                className={`hidden md:block w-16 h-0.5 mt-6 absolute translate-x-20 ${
                  step.completed ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
