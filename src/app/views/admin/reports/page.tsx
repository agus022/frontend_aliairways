'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaFilePdf } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

const ReportCard = ({
  title,
  description,
  idToExport,
}: {
  title: string;
  description: string;
  idToExport: string;
}) => {
  const generatePDF = () => {
    const element = document.getElementById(idToExport);
    if (!element) return;

    html2pdf()
      .set({
        margin: 0.5,
        filename: `${title.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .from(element)
      .save();
  };

  return (
    <div className="bg-white p-6 rounded shadow flex flex-col justify-between" id={idToExport}>
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <button
        onClick={generatePDF}
        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        <FaFilePdf className="mr-2" />
        Descargar PDF
      </button>
    </div>
  );
};

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'administrator') {
      router.push('/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <p className="text-center mt-20">Cargando...</p>;
  }

  return (
    <section className="mt-24 p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Generación de Reportes (PDF)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Reporte de Vuelos"
          description="Resumen de vuelos programados, completados, cancelados y crecimiento."
          idToExport="flight-report"
        />
        <ReportCard
          title="Reporte Financiero"
          description="Ingresos, egresos, gastos operativos y comparativa financiera."
          idToExport="financial-report"
        />
        <ReportCard
          title="Reporte de Pasajeros"
          description="Cantidad total de pasajeros, clases y factor de ocupación."
          idToExport="passenger-report"
        />
        <ReportCard
          title="Reporte de Empleados"
          description="Totales por tipo de personal, incluyendo pilotos y tripulación."
          idToExport="employee-report"
        />
      </div>
    </section>
  );
}
