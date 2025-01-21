"use client";
import * as React from 'react';
import { Box, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useRouter } from 'next/navigation';
import useStore from './hooks/useStore';

export default function Navbar() {
    const { setValue } = useStore();
    const router = useRouter();

    const handleNavigation = () => {
        router.push('/help');
        setValue(null)
    };

    const handleNavigationLogo = () => {
        router.push('/');
        setValue(null)
    };

    return (
        <Box
            sx={{
                width: '100%',
                position: 'fixed',
                top: 0,
                padding: '5px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
                background:'white',
                zIndex:3,
            }}
        >
            <img src='/Logos/logoEsigen.png' alt='immage_logo' style={{ width: '120px', height: 'auto', transform: 'scale(0.8)', cursor: 'pointer' }} onClick={handleNavigationLogo} />
            {/* <IconButton color='white' onClick={handleNavigation}>
                <HelpOutlineIcon sx={{ color: 'gray', width: '25px', height: '25px', transform: 'scale(1.1)' }} />
            </IconButton> */}
        </Box>
    );
}
