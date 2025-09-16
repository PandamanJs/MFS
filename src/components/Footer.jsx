import styles from "../styles/Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topArt}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="63"
          height="119"
          viewBox="0 0 63 119"
          fill="none"
        >
          <path
            d="M-44 23.4101L39.484 18.0739L44.7739 100.832"
            stroke="#98FBCB"
            stroke-opacity="0.65"
            stroke-width="35"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="125"
          height="119"
          viewBox="0 0 125 119"
          fill="none"
        >
          <path
            d="M18 23.4101L101.484 18.0739L106.774 100.832"
            stroke="#B2CCFF"
            stroke-opacity="0.1"
            stroke-width="35"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div className={styles.bottomArt}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="118"
          height="119"
          viewBox="0 0 118 119"
          fill="none"
        >
          <path
            d="M11 23.4101L94.484 18.0739L99.7738 100.832"
            stroke="#B2CCFF"
            stroke-opacity="0.3"
            stroke-width="35"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="125"
          height="92"
          viewBox="0 0 125 92"
          fill="none"
        >
          <path
            d="M18 23.4101L101.484 18.0739L106.774 100.832"
            stroke="#B2CCFF"
            stroke-opacity="0.45"
            stroke-width="35"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </footer>
  );
}

export default Footer;
