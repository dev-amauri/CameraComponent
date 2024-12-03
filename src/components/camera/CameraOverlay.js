"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const CameraOverlay = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isOpenCvReady, setIsOpenCvReady] = useState(false);

  const videoConstraints = {
    facingMode: "environment",
  };

  // Cargar OpenCV.js
  useEffect(() => {
    const checkOpenCv = setInterval(() => {
      if (window.cv && window.cv.imread) {
        setIsOpenCvReady(true);
        clearInterval(checkOpenCv);
      }
    }, 100);
    return () => clearInterval(checkOpenCv);
  }, []);

  const handleCaptureAndDownload = () => {
    if (!webcamRef.current || !canvasRef.current || !isOpenCvReady) return;

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Configurar el tamaño del canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame actual en el canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Procesar con OpenCV para recortar el área marcada
    const frame = window.cv.imread(canvas);

    try {
      // Definir el área delimitada por el rectángulo (coordenadas del overlay)
      const rectX = (canvas.width - 300) / 2; // Centrado horizontalmente
      const rectY = (canvas.height - 200) / 2; // Centrado verticalmente
      const rectWidth = 300;
      const rectHeight = 200;

      // Crear un canvas para mejorar la calidad de la imagen recortada
      const scaledCanvas = document.createElement("canvas");
      const scaleFactor = 2; // Factor de escalado para mejorar calidad
      scaledCanvas.width = rectWidth * scaleFactor;
      scaledCanvas.height = rectHeight * scaleFactor;

      const scaledCtx = scaledCanvas.getContext("2d");
      scaledCtx.drawImage(
        canvas,
        rectX,
        rectY,
        rectWidth,
        rectHeight,
        0,
        0,
        scaledCanvas.width,
        scaledCanvas.height
      );

      // Convertir el canvas escalado en una imagen descargable
      const scaledImage = scaledCanvas.toDataURL("image/jpeg", 1.0); // Calidad máxima
      downloadImage(scaledImage, "captura.jpg");
    } catch (err) {
      console.error("Error al capturar el área:", err);
    } finally {
      frame.delete();
    }
  };

  const downloadImage = (dataUrl, filename) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Webcam */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Canvas para procesamiento */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "none", // Oculto al usuario
        }}
      ></canvas>

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
          Coloca el objeto dentro del rectángulo y presiona el botón para
          capturar
        </p>
      </div>

      {/* Botón para capturar */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleCaptureAndDownload}
          disabled={!isOpenCvReady}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            background: isOpenCvReady ? "#4CAF50" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: isOpenCvReady ? "pointer" : "not-allowed",
          }}
        >
          {isOpenCvReady ? "Capturar y Descargar" : "Cargando..."}
        </button>
      </div>
    </div>
  );
};

export default CameraOverlay;
