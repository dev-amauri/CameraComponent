"use client";
import React, { useState } from "react";

const CameraNative = () => {
  const [capturedImage, setCapturedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* Marco del documento */}
        <div
          style={{
            width: "85%",
            height: "40%",
            border: "4px dashed rgba(255, 255, 255, 0.8)",
            borderRadius: "15px",
            background: "rgba(255, 255, 255, 0.2)",
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
          }}
        ></div>
        <p
          style={{
            color: "#fff",
            marginTop: "20px",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          Centra tu documento dentro del marco y presiona Abrir Cámara
        </p>
      </div>

      {/* Botón para abrir cámara nativa */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <label
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
          📸 Abrir Cámara
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
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
            style={{ maxWidth: "80%", maxHeight: "80%", borderRadius: "10px" }}
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

export default CameraNative;