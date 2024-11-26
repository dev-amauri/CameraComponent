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
      setPhoto(imageSrc);
    }
  };

  return (
    <Box textAlign="center" sx={{ mt: 4 }}>
      <Box
        sx={{
          width: "300px",
          height: "200px",
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
