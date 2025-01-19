'use client';
import React, { useRef, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import CircularProgress from '@mui/material/CircularProgress';

import { usePathname } from 'next/navigation';
import styles from './CameraINE.module.css';
import { FormDataINE } from "@/sections/captureINE/FormDataINE";

// hooks
import useStore from './hooks/useStore';
import useMutationOCR from "./hooks/useMutationOCR";
import { Button } from '@mui/material';


export default function CameraINE() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { activeComponent, setActiveComponent, dataINE, setDataINE, isLoading, setIsLoading, isError, setIsError } = useStore();
  const pathname = usePathname();

  // const [imageFile, setImageFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

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
  }, [activeComponent, capturedImage]);

  // Subir imagen
  const handleSubmitImage = async (imagen) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("image", imagen || '')
    const data = await mutations.OCR.post.mutateAsync(formData)
    setDataINE(data)
    setIsLoading(false)

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

    // Convierte la imagen completa del canvas a un blob
    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured-image.jpg', { type: 'image/jpg' });
      setCapturedImage(URL.createObjectURL(file)); // Guarda la imagen capturada para mostrarla
    }, 'image/jpeg', 1.0);

    // Convierte la imagen a un blob para que pueda ser enviada en el FormData
    croppedCanvas.toBlob((blob) => {
      const file = new File([blob], 'captured-image.jpg', { type: 'image/jpg' });

      // Pasa el archivo a la función handleSubmitImage
      handleSubmitImage(file);
    }, 'image/jpg', 1.0);
  };

  const changeStateError = () => {
    setIsError(false);
    setCapturedImage(null);
  };


  // // Manejo de carga de archivo manual
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImageFile(file);
  //     console.log({ file })  // Establecer el archivo cargado
  //     handleSubmitImage(file);  // Subir la imagen directamente
  //   }
  // };


  return (
    <>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingMessage}>
            <CircularProgress color="inherit" />
            <p>Extrayendo datos, por favor espere...</p>
          </div>
        </div>
      )}

      {!activeComponent && (
        <div className={styles.container}>
          <div className={styles.cameraContainer}>
            {capturedImage ? (  // Mostrar la imagen capturada si está disponible
              <img src={capturedImage} alt="Captured" className={styles.capturedImage} />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={styles.cameraVideo}
              />
            )}
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

              {isError || capturedImage ?
                <Button variant='contained' color='inherit' onClick={changeStateError} sx={{ textTransform: 'none', fontWeight: 'bold', color:'var(--secondary-dark-blue)' }}> Reintentar </Button>
                :
                <IconButton
                  variant="contained"
                  onClick={capturePhoto}
                  disabled={!isCameraActive}
                  sx={{
                    backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', '&:hover': {
                      backgroundColor: 'white', '& svg': {
                        color: 'gray',  // Cambiar el color del ícono a gris al hacer hover
                      },
                    }
                  }}
                >
                  <CenterFocusStrongRoundedIcon sx={{ fontSize: 36, color: 'var(--primary-sky-blue)' }} />
                </IconButton>
              }
            </div>

          </div>

        </div>
      )}

      {activeComponent && (
        <div style={{ marginTop: '2rem' }}>
          <FormDataINE />
        </div>
      )}

      {/* Campo de carga de imagen
      <div style={{ paddingBottom: '500px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: '1rem' }}
        />
      </div> */}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
}
