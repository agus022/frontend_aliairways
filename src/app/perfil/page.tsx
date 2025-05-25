'use client';

import ProfileTabs from "@/components/Perfil/ProfileTabs"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {useSession } from 'next-auth/react';


export default function PerfilPage() {
  const { data: session, status } = useSession();

    const router = useRouter();
  
    useEffect(() => {
      if (status === 'loading') return;
  
      // Redirige si no hay sesión o si no es administrador
      if (!session || session.user.role !== 'passenger') {
        router.push('/singin');
      }
    }, [session, status, router]);
  
    if (status === 'loading') {
      return <p className="text-center mt-20">Cargando...</p>;
   }
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Mi Perfil</h1>

          <ProfileTabs />
        </div>
      </div>
    </section>
  )
}
