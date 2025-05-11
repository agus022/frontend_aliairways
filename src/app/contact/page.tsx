import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page | Free Next.js Template for Startup and SaaS",
  description: "This is Contact Page for Startup Nextjs Template",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contáctanos"
        description="Ya sea una consulta, sugerencia o asistencia con tu viaje, en Ali Airways estamos listos para escucharte. Tu comodidad y confianza son nuestra prioridad."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
