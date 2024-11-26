"use client";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const CameraOverlay = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [detecting, setDetecting] = useState(false);

  const videoConstraints = {
    facingMode: "environment",
  };

  const handleDetection = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      // Simular la detección: aquí podrías integrar una librería de detección
      // Si cumple los criterios, captura automáticamente
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setDetecting(false);
      }
    }
  };

  const startDetection = () => {
    setDetecting(true);
    const interval = setInterval(() => {
      if (detecting) {
        handleDetection();
      } else {
        clearInterval(interval);
      }
    }, 1000); // Verificar cada segundo
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Webcam */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "300px",
            height: "200px",
            border: "4px dashed #fff",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.2)",
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
          }}
        ></div>
        <p style={{ color: "#fff", marginTop: "20px", textAlign: "center" }}>
          Coloca el objeto dentro del rectángulo y espera para capturar la foto
        </p>
      </div>

      {/* Botones */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {!detecting ? (
          <button
            onClick={startDetection}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Iniciar Detección
          </button>
        ) : (
          <p style={{ color: "#fff" }}>Detectando...</p>
        )}
      </div>

      {/* Mostrar imagen capturada */}
      {capturedImage && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={capturedImage}
            alt="Captured"
            style={{ maxWidth: "80%", maxHeight: "80%" }}
          />
          <button
            onClick={() => setCapturedImage(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "#ff4c4c",
              color: "#fff",
              border: "none",
              padding: "10px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraOverlay;
