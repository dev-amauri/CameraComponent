'use client'
import React, { useRef, useEffect, useState } from 'react';

export default function INEDataPage() {
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true, // Accede a la cámara
          audio: false // Si necesitas audio, cámbialo a true
        });
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
      }
    };

    startCamera();

    // Limpiar el stream al desmontar el componente
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      {isCameraActive ? (
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
      ) : (
        <p>Accediendo a la cámara...</p>
      )}
    </div>
  );

};
