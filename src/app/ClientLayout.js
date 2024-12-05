'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LoadingScreen from '@/components/loading_screens/LoadingScreen'; // Ruta de tu LoadingScreen
import BottomNavigationMenu from '@/components/navigation/BottomNavigationMenu';
import Navbar from '@/components/navigation/navbar';

const ClientLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const pathname = usePathname(); // Detecta el cambio de ruta

  useEffect(() => {
    setLoading(true); // Muestra el loading screen cuando cambia la ruta
    const timeout = setTimeout(() => setLoading(false), 500); // Simula una carga (puedes reemplazarlo por una lógica real)

    return () => clearTimeout(timeout); // Limpia el timeout
  }, [pathname]);


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Navbar/>
      {children}
      <BottomNavigationMenu />

    </>
  );
};

export default ClientLayout;
