'use client';
import React, { useRef, useEffect, useState } from 'react';

export default function INEDataPage() {
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
    <div>
      <div>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
      </div>

      <button onClick={capturePhoto} disabled={!isCameraActive}>
        Capturar Foto
      </button>

      {capturedImage && (
        <div>
          <h3>Fotografía capturada:</h3>
          <img src={capturedImage} alt="Fotografía capturada" style={{width: '100%'}} />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}