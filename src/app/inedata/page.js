'use client';
import React, { useRef, useEffect, useState } from 'react';

export default function INEDataPage() {
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        console.log('Iniciando cámara...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true, // Accede a la cámara
          audio: false // Cambiar a true si necesitas audio
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
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
    </div>
  );
}
