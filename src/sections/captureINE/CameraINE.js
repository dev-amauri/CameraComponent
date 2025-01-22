'use client';
import React, { useRef, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CameraRoundedIcon from '@mui/icons-material/CameraRounded';

import styles from './CameraINE.module.css';

// sections
import EditImage from './EditImage';


// hooks
import useStore from './hooks/useStore';


export default function CameraINE() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { dataINE, capturedImage, setCapturedImage } = useStore();
  // const pathname = usePathname();


  // // Reinicia el estado y la cámara cuando cambia la ruta
  // useEffect(() => {
  //   if (!pathname?.endsWith('/inedata')) {
  //     setActiveComponent(false); // Reinicia el estado cuando la ruta es '/inedata'
  //   }
  // }, [pathname, setActiveComponent]);

  // Inicia o reinicia la cámara
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: 'environment' }, // Cámara trasera
            width: { ideal: 2560 },  // Resolución ideal 2K
            height: { ideal: 1440 }, // Resolución de altura 1440
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
      }
    };

    if (!dataINE) {
      startCamera();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [dataINE, capturedImage]);

  // capturar imagen

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Ajusta el tamaño del canvas a la resolución del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convierte la imagen completa del canvas a un blob
    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured-image.jpg', { type: 'image/jpg' });
      setCapturedImage(file); // Guarda la imagen capturada para mostrarla
    }, 'image/jpeg', 1.0);
  };


  return (
    <>
      {!capturedImage && (
        <div className={styles.container}>
          <div className={styles.cameraContainer}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={styles.cameraVideo}
            />
            <div className={styles.cameraOverlay}>
              <div className={styles.cameraFrame}></div>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 40,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <IconButton
                variant="contained"
                onClick={capturePhoto}
                disabled={!isCameraActive}
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: 'white',
                    '& svg': {
                      color: 'gray', // Cambiar el color del ícono a gris al hacer hover
                    },
                  },
                }}
              >
                <CameraRoundedIcon
                  sx={{ fontSize: 36, color: 'var(--primary-sky-blue)' }}
                />
              </IconButton>
            </div>
          </div>
        </div>
      )}

      {capturedImage && (
        <div>
          <EditImage />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
}
