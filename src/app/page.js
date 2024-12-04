import styles from './page.module.css'

export default function Home() {

  return (
    <div className={styles.containerPage} >
      <div className={styles.containerColor}>
        <div>
        <h1 className={styles.title}>
          Bienvenidos al Sistema OCR de E-sigen ISR
        </h1>
        <p className={styles.text}>
          En representación del equipo de desarrollo, agradecemos la oportunidad de ser parte de este proyecto.
        </p>
        </div>
        
        <img src='/illustration/Esigen_Blue.png' alt='image' className={styles.image}/>
      </div>
    </div>
  );
}
