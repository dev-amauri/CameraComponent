'use client';
import React, { useRef, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import { usePathname } from 'next/navigation';
import styles from './CameraINE.module.css';
import { FormDataINE } from "@/sections/captureINE/FormDataINE";

// hooks
import useStore from './hooks/useStore';
import useMutationOCR from "./hooks/useMutationOCR";


export default function CameraINE() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { activeComponent, setActiveComponent, dataINE, setDataINE } = useStore();
  const pathname = usePathname();

  console.log(dataINE)
  // mutation
  const mutations = useMutationOCR();


  // Reinicia el estado y la cámara cuando cambia la ruta
  useEffect(() => {
    if (!pathname?.endsWith('/inedata')) {
      setActiveComponent(false); // Reinicia el estado cuando la ruta es '/inedata'
    }
  }, [pathname, setActiveComponent]);

  // Si hay datos en dataINE, se activa el formulario
  useEffect(() => {
    if (dataINE !== null) {
      setActiveComponent(true)
    }
  }, [dataINE])

  // Inicia o reinicia la cámara
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            // facingMode: { exact: 'environment' }, // Cámara trasera
            width: { ideal: 1920 },
            height: { ideal: 1080 },
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

    if (!activeComponent) {
      startCamera();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [activeComponent]);

  // Subir imagen
  const handleSubmitImage = async (imagen) => {
    const formData = new FormData()
    formData.append("image", imagen || '')
    const data = await mutations.OCR.post.mutateAsync(formData)
    setDataINE(data)

  };

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

    // Recorta la imagen
    const cropX = canvas.width * 0.1;
    const cropY = canvas.height * 0.1;
    const cropWidth = canvas.width * 0.8;
    const cropHeight = canvas.height * 0.8;

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;

    const croppedContext = croppedCanvas.getContext('2d');
    croppedContext.drawImage(
      canvas,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // Convierte la imagen a un blob para que pueda ser enviada en el FormData
    croppedCanvas.toBlob((blob) => {
      const file = new File([blob], 'captured-image.jpeg', { type: 'image/jpeg' });

      // Pasa el archivo a la función handleSubmitImage
      handleSubmitImage(file);
    }, 'image/jpeg', 1.0);
  };



  return (
    <>
      {!activeComponent && (
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
                sx={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              >
                <CenterFocusStrongRoundedIcon sx={{ fontSize: 36, color: 'var(--primary-sky-blue)' }} />
              </IconButton>
            </div>

          </div>

        </div>
      )}

      {activeComponent && (
        <div style={{ marginTop: '2rem' }}>
          <FormDataINE />
          <button onClick={() => setActiveComponent(false)}>Regresar a la cámara</button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
}
