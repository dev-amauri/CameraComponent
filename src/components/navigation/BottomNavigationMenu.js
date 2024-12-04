"use client";
import React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useRouter } from 'next/navigation';
import useStore from './hooks/useStore';

export default function BottomNavigationMenu() {
  const { value, setValue } = useStore();

  const router = useRouter();

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
    <Box sx={{ width: '100%', position: 'fixed', bottom: 0, boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)', }}>
      <BottomNavigation value={value} onChange={handleNavigation} >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        {/* <BottomNavigationAction label="Help" icon={<HelpIcon />} /> */}
        <BottomNavigationAction label="INE Data" icon={<CameraAltIcon />} />
      </BottomNavigation>
    </Box>
  );
}
