'use client';
import React, { useRef, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import styles from './CameraINE.module.css';

export default function CameraINE() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const croppedCanvasRef = useRef(null); // Canvas para mostrar el recorte
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Estados para los parámetros de recorte
  const [cropX, setCropX] = useState(0.1);
  const [cropY, setCropY] = useState(0.1);
  const [cropWidth, setCropWidth] = useState(0.8);
  const [cropHeight, setCropHeight] = useState(0.8);

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
    if (!canvasRef.current || !videoRef.current || !croppedCanvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Ajusta el tamaño del canvas al tamaño del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Calcula las coordenadas y dimensiones del área de recorte
    const cropStartX = canvas.width * cropX;
    const cropStartY = canvas.height * cropY;
    const cropW = canvas.width * cropWidth;
    const cropH = canvas.height * cropHeight;

    // Canvas secundario para mostrar el recorte
    const croppedCanvas = croppedCanvasRef.current;
    croppedCanvas.width = cropW;
    croppedCanvas.height = cropH;

    const croppedContext = croppedCanvas.getContext('2d');
    croppedContext.drawImage(
      canvas,
      cropStartX,
      cropStartY,
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH
    );

    // Dibuja el área de recorte en rojo en el canvas principal
    context.strokeStyle = 'red';
    context.lineWidth = 3;
    context.strokeRect(cropStartX, cropStartY, cropW, cropH);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        {/* Inputs para ajustar los valores de recorte */}
        <label>
          Crop X (%):
          <input
            type="number"
            step="0.01"
            value={cropX}
            onChange={(e) => setCropX(Number(e.target.value))}
          />
        </label>
        <label>
          Crop Y (%):
          <input
            type="number"
            step="0.01"
            value={cropY}
            onChange={(e) => setCropY(Number(e.target.value))}
          />
        </label>
        <label>
          Crop Width (%):
          <input
            type="number"
            step="0.01"
            value={cropWidth}
            onChange={(e) => setCropWidth(Number(e.target.value))}
          />
        </label>
        <label>
          Crop Height (%):
          <input
            type="number"
            step="0.01"
            value={cropHeight}
            onChange={(e) => setCropHeight(Number(e.target.value))}
          />
        </label>
      </div>

      <div className={styles.cameraContainer}>
        <video ref={videoRef} autoPlay playsInline className={styles.cameraVideo} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <canvas
          ref={croppedCanvasRef}
          style={{
            border: '2px solid black',
            marginTop: '10px',
            display: 'block',
          }}
        />
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
      </div>
    </div>
  );
}
