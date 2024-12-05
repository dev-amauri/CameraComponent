"use client";
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useRouter } from 'next/navigation';
import useStore from './hooks/useStore';

export default function BottomNavigationMenu() {
  const { value, setValue } = useStore();
  const router = useRouter();

  // Persistencia: cargar el estado inicial desde localStorage
  useEffect(() => {
    const savedValue = localStorage.getItem('navigationValue');
    if (savedValue !== null) {
      setValue(Number(savedValue)); // Restaurar el valor del estado
    }
  }, [setValue]);

  // Guardar el estado en localStorage cuando cambie
  useEffect(() => {
    if (value !== null) {
      localStorage.setItem('navigationValue', value);
    }
  }, [value]);

  const handleNavigation = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        router.push('/home');
        break;
      case 1:
        router.push('/inedata');
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex:3,
      }}
    >
      <BottomNavigation value={value} onChange={handleNavigation}>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="INE Data" icon={<CameraAltIcon />} />
      </BottomNavigation>
    </Box>
  );
}
