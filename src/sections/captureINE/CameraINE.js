'use client';
import React, { useRef, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import styles from './CameraINE.module.css'

export default function CameraINE() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        console.log('Iniciando cámara...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: 'environment' }, // Cámara trasera
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

    // Ajusta el tamaño del canvas al tamaño nativo del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibuja el fotograma actual en el canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Obtén la imagen en alta calidad
    const image = canvas.toDataURL('image/jpeg', 1.0); // Calidad máxima
    setCapturedImage(image);
    console.log('Fotografía capturada:', image);
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
            <CenterFocusStrongRoundedIcon sx={{ fontSize: 36, color: '#000' }} />
          </IconButton>
        </div>

        {capturedImage && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={capturedImage}
              alt="Fotografía capturada"
              style={{ maxWidth: '90%', maxHeight: '90%' }}
            />
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
