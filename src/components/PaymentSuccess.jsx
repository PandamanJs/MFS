import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/PaymentSuccess.module.css";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Success Icon */}
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 80"
        fill="none"
      >
        <circle cx="40" cy="40" r="36" stroke="#2D3648" strokeWidth="4" />
        <path
          d="M54 32L36 50L26 40"
          stroke="#2D3648"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Message */}
      <p className={styles.message}>Payment Successfully made</p>

      {/* View Receipts Button */}
      <button className={styles.button} onClick={() => navigate("/receipts")}>
        <span>View Receipts</span>
        <span className={styles.arrow}>→</span>
      </button>
    </div>
  );
}
