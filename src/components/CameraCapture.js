"use client";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button, Box, Typography } from "@mui/material";

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      // Crear un canvas para recortar la imagen
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Dimensiones del rectángulo (400x300px)
      const rectWidth = 420;
      const rectHeight = 320;

      // Configurar dimensiones del canvas
      canvas.width = rectWidth;
      canvas.height = rectHeight;

      // Crear una imagen desde el screenshot
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        // Dibujar la imagen recortada en el canvas
        ctx.drawImage(
          img,
          (img.width - rectWidth) / 2, // Centrar el rectángulo
          (img.height - rectHeight) / 2,
          rectWidth,
          rectHeight,
          0,
          0,
          rectWidth,
          rectHeight
        );

        // Obtener la imagen recortada
        const croppedImage = canvas.toDataURL("image/png");
        setPhoto(croppedImage);

        // Descargar la imagen recortada
        const link = document.createElement("a");
        link.href = croppedImage;
        link.download = "captura.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    }
  };

  return (
    <Box textAlign="center" sx={{ mt: 4 }}>
      <Box
        sx={{
          width: "400px",
          height: "300px",
          border: "2px solid #000",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={{
            facingMode: "environment", // Usar cámara trasera en móviles
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={capturePhoto}
          sx={{ mr: 2 }}
        >
          Tomar Foto
        </Button>
      </Box>
      {photo && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Foto Capturada:</Typography>
          <img src={photo} alt="Captura" style={{ maxWidth: "100%" }} />
        </Box>
      )}
    </Box>
  );
};

export default CameraCapture;
