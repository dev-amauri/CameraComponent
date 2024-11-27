"use client";
import React, { useState, useEffect } from "react";

const CameraNative = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [opencvLoaded, setOpencvLoaded] = useState(false);

  useEffect(() => {
    // Asegurar que OpenCV esté cargado
    if (cv && cv["onRuntimeInitialized"]) {
      cv["onRuntimeInitialized"] = () => {
        setOpencvLoaded(true);
      };
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = e.target.result;
        setCapturedImage(img); // Guardar la imagen capturada
        if (opencvLoaded) {
          processImage(img); // Procesar la imagen con OpenCV
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = (imageData) => {
    try {
      const img = new Image();
      img.src = imageData;
      img.onload = () => {
        const src = cv.imread(img); // Cargar la imagen en formato OpenCV
        const gray = new cv.Mat();
        const edges = new cv.Mat();

        // Convertir a escala de grises
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

        // Aplicar detección de bordes con Canny
        cv.Canny(gray, edges, 50, 150);

        // Mostrar el resultado
        const canvas = document.createElement("canvas");
        cv.imshow(canvas, edges);
        setProcessedImage(canvas.toDataURL()); // Guardar la imagen procesada como base64

        // Liberar memoria
        src.delete();
        gray.delete();
        edges.delete();
      };
    } catch (error) {
      console.error("Error procesando la imagen:", error);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Captura y Detección de Bordes</h1>

      {/* Botón para abrir la cámara */}
      <label
        style={{
          display: "inline-block",
          padding: "10px 20px",
          fontSize: "16px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        📸 Tomar Foto
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </label>

      {/* Mostrar imagen capturada */}
      {capturedImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Imagen Capturada:</h3>
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              maxWidth: "100%",
              borderRadius: "10px",
              border: "2px solid #4CAF50",
            }}
          />
        </div>
      )}

      {/* Mostrar imagen procesada */}
      {processedImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Detección de Bordes:</h3>
          <img
            src={processedImage}
            alt="Processed"
            style={{
              maxWidth: "100%",
              borderRadius: "10px",
              border: "2px solid #2196F3",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CameraNative;