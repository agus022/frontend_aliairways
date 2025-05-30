import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ali-Airways | Acerca de Nosotros",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Acerca de Nosotros"
        description="En Ali Airways, creemos que volar no es solo trasladarse: es una experiencia, una oportunidad de descubrir el mundo con confianza, comodidad y calidez. Nuestra misión es llevarte más allá de las nubes, con un servicio que se siente como en casa."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
