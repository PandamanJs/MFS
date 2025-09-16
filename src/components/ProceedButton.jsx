import { useState } from "react";
import styles from "../styles/ProceedButton.module.css";

function ProceedButton({ onClick, initialCount = 10 }) {
  // state for number of items in the bag
  const [itemCount] = useState(initialCount);

  return (
    <div className={styles.wrapper}>
      <div className={styles.iconBox}>
        {/* shopping bag SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="45"
          viewBox="0 0 40 45"
          fill="none"
        >
          <path
            d="M13.3333 15H11.2956C9.12952 15 8.0474 15 7.27701 15.4971C6.60095 15.9334 6.08128 16.6225 5.80991 17.4445C5.50087 18.3805 5.67875 19.5812 6.0344 21.9819L6.03515 21.9864L7.5907 32.4864C7.85458 34.2676 7.98739 35.1585 8.38244 35.8269C8.73067 36.416 9.2195 36.8817 9.79328 37.1713C10.4442 37.4998 11.2464 37.5 12.8516 37.5H27.1489C28.754 37.5 29.5557 37.4998 30.2066 37.1713C30.7804 36.8817 31.2696 36.416 31.6178 35.8269C32.0129 35.1585 32.145 34.2676 32.4088 32.4864L33.9644 21.9864L33.9659 21.9791C34.3213 19.5803 34.4991 18.3801 34.1902 17.4445C33.9188 16.6225 33.4004 15.9334 32.7243 15.4971C31.9539 15 30.87 15 28.704 15H26.6667M13.3333 15H26.6667M13.3333 15C13.3333 10.8579 16.3181 7.5 20 7.5C23.6819 7.5 26.6667 10.8579 26.6667 15"
            stroke="#003049"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* badge */}
        {itemCount > 0 && <div className={styles.badge}>{itemCount}</div>}
      </div>

      <button className={styles.button} onClick={onClick}>
        <span>Proceed</span>
        <span className={styles.arrow}>→</span>
      </button>
    </div>
  );
}

export default ProceedButton;
