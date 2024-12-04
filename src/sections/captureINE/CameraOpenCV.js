'use client';
import React, { useRef, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import styles from './CameraINE.module.css';

export default function CameraOpenCV() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [opencvLoaded, setOpenCVLoaded] = useState(false);

  useEffect(() => {
    // Espera a que OpenCV se cargue
    const checkOpenCV = () => {
      if (window.cv) {
        console.log('OpenCV.js cargado correctamente.');
        setOpenCVLoaded(true);
      } else {
        setTimeout(checkOpenCV, 100);
      }
    };
    checkOpenCV();
  }, []);

  useEffect(() => {
    if (!opencvLoaded) return;

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
  }, [opencvLoaded]);

  const detectRectangle = (imageData) => {
    const src = cv.matFromImageData(imageData);
    const gray = new cv.Mat();
    const edges = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.Canny(gray, edges, 50, 150);

    // Encuentra contornos
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

    let rect = null;
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const approx = new cv.Mat();
      cv.approxPolyDP(contour, approx, 0.02 * cv.arcLength(contour, true), true);

      if (approx.rows === 4) {
        const boundingRect = cv.boundingRect(approx);
        if (!rect || boundingRect.width * boundingRect.height > rect.width * rect.height) {
          rect = boundingRect; // Rectángulo más grande encontrado
        }
      }
      approx.delete();
    }

    src.delete();
    gray.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();

    return rect;
  };

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Ajusta el tamaño del canvas al tamaño del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Obtén la imagen y detecta el rectángulo
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const rect = detectRectangle(imageData);

    if (rect) {
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = rect.width;
      croppedCanvas.height = rect.height;

      const croppedContext = croppedCanvas.getContext('2d');
      croppedContext.drawImage(
        canvas,
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        0,
        0,
        rect.width,
        rect.height
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
        <video ref={videoRef} autoPlay playsInline className={styles.cameraVideo} />
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
            onClick={capturePhoto}
            disabled={!isCameraActive || !opencvLoaded}
            sx={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          >
            <CenterFocusStrongRoundedIcon sx={{ fontSize: 36, color: '#000' }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
