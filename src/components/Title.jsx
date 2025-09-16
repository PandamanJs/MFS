import styles from "../styles/Title.module.css";

function Title() {
  return (
    <nav className={styles.navigation}>
      <div className={styles.iconNname}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 25 25"
          fill="none"
        >
          <path
            d="M25 12.5L12.5 0L-2.48028e-06 12.5L12.5 25L25 12.5Z"
            fill="#003049"
          />
          <path
            d="M6.7478 11.9285L12.4006 6.27563L18.0043 11.8793"
            stroke="#98FBCB"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span className={styles.title}>Master Fees</span>
      </div>
    </nav>
  );
}

export default Title;
