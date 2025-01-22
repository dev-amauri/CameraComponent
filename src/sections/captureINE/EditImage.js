'use client';
import React, { useRef, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import CircularProgress from '@mui/material/CircularProgress';

import { usePathname } from 'next/navigation';
import styles from './CameraINE.module.css';
import { FormDataINE } from "@/sections/captureINE/FormDataINE";

//mui
import { Box, Button } from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CropFreeRoundedIcon from '@mui/icons-material/CropFreeRounded';

// hooks
import useStore from './hooks/useStore';
import useMutationOCR from "./hooks/useMutationOCR";
import CroppedImage from './utils/CroppedImage';


export default function EditImage() {
    // mutation
    const mutations = useMutationOCR();
    // Global state
    const { dataINE, setDataINE, isLoading, setIsLoading, capturedImage, setCapturedImage, croppedImage, setCroppedImage} = useStore();


    // Cerrar componente
    const CloseEditImage = () => {
        setCapturedImage(null);
    };

    // Descargar imagen
    const downloadImage = (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'imagen-descargada.jpg';
        link.click();
        URL.revokeObjectURL(url);
    };

    // Recortar imagen
    const handleCroppedImage = () =>{
        setCroppedImage(capturedImage);
    };

    // Subir imagen
    const handleSubmitImage = async (imagen) => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("image", imagen || '')
        const data = await mutations.OCR.post.mutateAsync(formData)
        setDataINE(data)
        setIsLoading(false)

    };

    return (
        <>
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingMessage}>
                        <CircularProgress color="inherit" />
                        <p>Extrayendo datos, por favor espere...</p>
                    </div>
                </div>
            )}
            {!dataINE && croppedImage === null &&(
                <Box sx={{ width: '100%', height: '100vh', paddingTop: '50px' }}>
                    <Box sx={{ display: 'flex', width: '100%', height: '100%', background: 'white', position: 'relative', backgroundColor: '#171717', }}>
                        <Box sx={{ display: 'flex', width: '100%', height: '86%', position: 'relative', justifyContent: 'center' }}>
                            <img src={URL.createObjectURL(capturedImage)} alt={'capturedImage'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>

                        {/* Botón de descarga */}
                        <Button variant="contained" color="inherit" onClick={() => downloadImage(capturedImage)} sx={{ position: 'absolute', top: '10px', right: '10px', borderRadius: '50%', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', width: '42px', height: '42px', minWidth: 'auto', padding: 0, }} >
                            <DownloadRoundedIcon />
                        </Button>

                        {/* Botón de recorte */}
                        <Button variant="contained" color="inherit" onClick={handleCroppedImage} sx={{ position: 'absolute', top: '10px', right: '65px', borderRadius: '50%', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', width: '42px', height: '42px', minWidth: 'auto', padding: 0, }}>
                            <CropFreeRoundedIcon />
                        </Button>

                        {/* Botón de cerrar */}
                        <Button variant="contained" color="inherit" onClick={CloseEditImage} sx={{ position: 'absolute', top: '10px', left: '10px', borderRadius: '50%', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', width: '42px', height: '42px', minWidth: 'auto', padding: 0, }}>
                            <CloseRoundedIcon />
                        </Button>

                        {/* Botón de enviar */}
                        <Button variant="contained" color="inherit" endIcon={<SendRoundedIcon />} onClick={() => handleSubmitImage(capturedImage)} sx={{ position: 'absolute', bottom: '70px', left: '50%', transform: 'translateX(-50%)', borderRadius: '10px', width: '95%', color: 'var(--primary-blue)' }}>
                            Enviar
                        </Button>

                    </Box>
                </Box>
            )}

            {dataINE && croppedImage === null &&(
                <div style={{ marginTop: '2rem' }}>
                    <FormDataINE />
                </div>
            )}

            {croppedImage && (
                <div>
                    <CroppedImage />
                </div>
            )}
        </>
    );
}
