'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import IconButton from '@mui/material/IconButton';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import styles from './CameraINE.module.css';

export default function CameraOpenCV() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(() => {
    // Carga el modelo de detección
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      console.log('Modelo Coco-SSD cargado');
      setModel(loadedModel);
    };

    loadModel();

    const startCamera = async () => {
      try {
        console.log('Iniciando cámara...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: 'environment' },
          },
          audio: false,
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

  const detectObjects = async () => {
    if (!model || !videoRef.current) return;

    const video = videoRef.current;
    const predictions = await model.detect(video);

    // Encuentra el rectángulo más relevante (si existe)
    const rect = predictions.find(
      (p) => p.class === 'person' || p.class === 'rectangle'
    );

    if (rect) {
      console.log('Rectángulo detectado:', rect);

      // Dibuja el rectángulo en el canvas
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.strokeStyle = 'red';
      context.lineWidth = 2;
      context.strokeRect(rect.bbox[0], rect.bbox[1], rect.bbox[2], rect.bbox[3]);

      // Recorta y guarda la imagen
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = rect.bbox[2];
      croppedCanvas.height = rect.bbox[3];
      const croppedContext = croppedCanvas.getContext('2d');
      croppedContext.drawImage(
        canvas,
        rect.bbox[0],
        rect.bbox[1],
        rect.bbox[2],
        rect.bbox[3],
        0,
        0,
        rect.bbox[2],
        rect.bbox[3]
      );

      const croppedImage = croppedCanvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = `recorte_${new Date().toISOString()}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log('No se detectó un rectángulo.');
    }
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
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <IconButton
            onClick={detectObjects}
            disabled={!isCameraActive || !model}
            sx={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          >
            <CenterFocusStrongRoundedIcon sx={{ fontSize: 36, color: '#000' }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
