'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // Redirige si no hay sesión o si no es administrador
    if (!session || session.user.role !== 'administrator') {
      router.push('/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <p className="text-center mt-20">Cargando...</p>;
  }

  return (
    <section className="mt-24 p-8">
      <p className="text-gray-600 mb-8">Bienvenido, {session?.user.name || session?.user.username}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Gestión de usuarios</h2>
          <p className="text-gray-600">Aquí puedes ver, crear y eliminar usuarios.</p>
        </div>

        <div className="p-6 border rounded shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Reportes del sistema</h2>
          <p className="text-gray-600">Accede a métricas y reportes generales.</p>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
