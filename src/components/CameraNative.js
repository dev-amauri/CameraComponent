"use client";
import React, { useState, useEffect } from "react";

const CameraNative = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [processedImages, setProcessedImages] = useState([]);

  useEffect(() => {
    // Cargar OpenCV.js
    const checkOpenCv = setInterval(() => {
      if (window.cv && window.cv.imread) {
        clearInterval(checkOpenCv);
      }
    }, 100);
    return () => clearInterval(checkOpenCv);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgSrc = e.target.result;
        setCapturedImage(imgSrc);
        processImage(imgSrc); // Procesar la imagen capturada
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = (imgSrc) => {
    if (!window.cv) return;

    const processedSteps = [];
    const imgElement = document.createElement("img");
    imgElement.src = imgSrc;

    imgElement.onload = () => {
      const src = window.cv.imread(imgElement);
      processedSteps.push({ title: "Original", image: imgSrc });

      // Convertir a escala de grises
      const gray = new window.cv.Mat();
      window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);
      processedSteps.push({ title: "Escala de Grises", image: matToDataURL(gray) });

      // Aplicar desenfoque
      const blurred = new window.cv.Mat();
      window.cv.GaussianBlur(gray, blurred, new window.cv.Size(5, 5), 0);
      processedSteps.push({ title: "Desenfocado", image: matToDataURL(blurred) });

      // Detección de bordes
      const edges = new window.cv.Mat();
      window.cv.Canny(blurred, edges, 50, 150);
      processedSteps.push({ title: "Bordes Detectados", image: matToDataURL(edges) });

      setProcessedImages(processedSteps);

      // Liberar memoria
      src.delete();
      gray.delete();
      blurred.delete();
      edges.delete();
    };
  };

  const matToDataURL = (mat) => {
    const canvas = document.createElement("canvas");
    window.cv.imshow(canvas, mat);
    return canvas.toDataURL();
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Camara nativa</h1>

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

      {/* Mostrar imagen capturada
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
 */}
      {/* Mostrar imágenes procesadas */}
      {processedImages.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Procesamiento de Imagen:</h3>
          {processedImages.map((step, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h4>{step.title}</h4>
              <img
                src={step.image}
                alt={step.title}
                style={{
                  maxWidth: "100%",
                  borderRadius: "10px",
                  border: "2px solid #4CAF50",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CameraNative;