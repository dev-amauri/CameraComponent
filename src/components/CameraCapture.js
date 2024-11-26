"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const CameraOverlay = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [detecting, setDetecting] = useState(false);
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

  const handleDetection = () => {
    if (!webcamRef.current || !canvasRef.current || !isOpenCvReady) return;

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Configurar el tamaño del canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame actual en el canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Procesar con OpenCV
    const frame = window.cv.imread(canvas);
    const gray = new window.cv.Mat();
    const edges = new window.cv.Mat();
    const contours = new window.cv.MatVector();
    const hierarchy = new window.cv.Mat();

    try {
      // Convertir a escala de grises
      window.cv.cvtColor(frame, gray, window.cv.COLOR_RGBA2GRAY, 0);

      // Detectar bordes
      window.cv.Canny(gray, edges, 50, 150);

      // Encontrar contornos
      window.cv.findContours(
        edges,
        contours,
        hierarchy,
        window.cv.RETR_EXTERNAL,
        window.cv.CHAIN_APPROX_SIMPLE
      );

      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const rect = window.cv.boundingRect(contour);

        // Verificar si el rectángulo está dentro del área delimitada
        if (
          rect.width > 100 &&
          rect.height > 100 &&
          rect.x > 150 &&
          rect.y > 100 &&
          rect.x + rect.width < 450 &&
          rect.y + rect.height < 300
        ) {
          // Dibujar el rectángulo detectado en el canvas
          ctx.strokeStyle = "red";
          ctx.lineWidth = 4;
          ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

          // Capturar la región del rectángulo
          const rectCanvas = document.createElement("canvas");
          rectCanvas.width = rect.width;
          rectCanvas.height = rect.height;
          const rectCtx = rectCanvas.getContext("2d");
          rectCtx.drawImage(
            canvas,
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            0,
            0,
            rect.width,
            rect.height
          );

          // Guardar la imagen capturada
          const rectImage = rectCanvas.toDataURL("image/jpeg");
          setCapturedImage(rectImage);

          // Detener la detección
          setDetecting(false);
          break;
        }
      }
    } catch (err) {
      console.error("Error durante la detección:", err);
    } finally {
      frame.delete();
      gray.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();
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
    }, 500); // Verificar cada 500ms
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
