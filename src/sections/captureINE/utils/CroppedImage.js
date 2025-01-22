'use client';
import React, { useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Asegúrate de importar los estilos

// hooks
import useStore from '../hooks/useStore';

export default function CroppedImage() {
    const { setCroppedImage, capturedImage, setCapturedImage } = useStore();

    const cropperRef = useRef(null); // Referencia al Cropper

    // Método para capturar la imagen recortada
    const getCroppedImage = () => {
        const cropper = cropperRef.current?.cropper; // Accede a la instancia de cropper

        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas();
            croppedCanvas.toBlob((blob) => {
                const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpg' });
                setCapturedImage(file); // Guarda la imagen recortada
                setCroppedImage(null); // limpiar estado
            }, 'image/jpeg');
        }
    };

    // Cerrar componente
    const CloseCroppedImage = () => {
        setCroppedImage(null);
    };

    return (
        <Box sx={{ display: 'flex', width: '100%', height: '100vh', paddingTop: '50px', justifyContent: 'center', alignItems:'center', backgroundColor: '#171717', overflowX: 'hidden'}}>
            <Box sx={{ display: 'flex', width: '100%', height: '100%', background: 'white', position: 'relative', backgroundColor: '#171717', justifyContent: 'center'}}>
                <Box sx={{ display: 'flex', width: '100%', height: '90%', position: 'relative', justifyContent: 'center' }}>
                    <Cropper
                        src={URL.createObjectURL(capturedImage)}
                        style={{ width: '100%', height: '90%' }} // Fija la altura al 84% de la pantalla
                        initialAspectRatio={16 / 9} // Ajusta la relación de aspecto como desees
                        guides={true} // Muestra las guías para limitar el área de recorte
                        dragMode="none" // Desactiva el movimiento de la imagen
                        movable={false} // Desactiva el movimiento de la imagen
                        scalable={false} // Desactiva el escalado de la imagen
                        zoomable={false} // Desactiva el zoom
                        ref={cropperRef} // Asigna la referencia aquí
                    />
                </Box>

                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '10px', position: 'absolute', bottom: '70px' }}>
                    <Button color="inherit" onClick={CloseCroppedImage} sx={{ borderRadius: '10px', color: 'white', textTransform: 'none', fontWeight: 'bold' }}>
                        Cancelar
                    </Button>
                    <Button
                        color="inherit"
                        sx={{ borderRadius: '10px', color: 'white', textTransform: 'none', fontWeight: 'bold' }}
                        onClick={getCroppedImage} // Captura la imagen recortada al hacer clic en "Aceptar"
                    >
                        Aceptar
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
