import React from "react";
import styles from "./LoadingScreen.module.css";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <img
        src="/Logos/logoEsigen.png"
        alt="Logo Esigen"
        className={styles.logo}
      />
      <div className={styles.textContainer}>
        <p className={styles.text}>
          Copyright © 2024 Todos los derechos reservados, 2024
        </p>
        <p className={styles.text}>
          Un producto de <span className={styles.textSpan}>LogicSystems</span>
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
