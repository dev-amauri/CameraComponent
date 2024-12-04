'use client';
import React, { useRef, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import styles from './CameraINE.module.css';

export default function CameraINE() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        console.log('Iniciando cámara...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: 'environment' }, // Cámara trasera
            width: { ideal: 1920 }, // Ancho ideal
            height: { ideal: 1080 }, // Altura ideal
          },
          audio: false, // Desactiva el audio
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
          console.log('Cámara activada con éxito.');
        }
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Ajusta el tamaño del canvas a la resolución del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Definir las coordenadas y dimensiones del recorte (ajústalas según tu marco punteado)
    const cropX = canvas.width * 0.10; // 25% desde la izquierda
    const cropY = canvas.height * 0.10; // 25% desde arriba
    const cropWidth = canvas.width * 0.2; // 50% del ancho total
    const cropHeight = canvas.height * 0.2; // 50% de la altura total

    // Crear un nuevo canvas para el recorte
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

    // Descargar la imagen recortada
    const croppedImage = croppedCanvas.toDataURL('image/jpeg', 1.0); // Calidad máxima
    const link = document.createElement('a');
    link.href = croppedImage;
    link.download = `recorte_${new Date().toISOString()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cameraContainer}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={styles.cameraVideo}
        />

        {/* Overlay */}
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
            onClick={capturePhoto}
            disabled={!isCameraActive}
            sx={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          >
            <CenterFocusStrongRoundedIcon sx={{ fontSize: 36, color: 'var(--primary-sky-blue)' }} />
          </IconButton>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

