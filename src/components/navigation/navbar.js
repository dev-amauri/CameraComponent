"use client";
import * as React from 'react';
import { Box, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/help'); 
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        position: 'fixed', 
        top: 0, 
        backgroundColor: 'var(--primary-blue)', 
        padding: '15px 20px', 
        display:'flex',
        justifyContent:'space-between'
      }}
    >
        <img src='/Logos/logoEsigenDark.png' alt='immage_logo' style={{width:'120px', height:'auto'}}/>
        <IconButton color='white' onClick={handleNavigation}>
            <HelpOutlineIcon sx={{color:'white', width:'32px', height:'32px'}} />
        </IconButton>
    </Box>
  );
}
