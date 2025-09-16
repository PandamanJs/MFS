import React, { useState } from "react";
import styles from "../styles/ReceiptDestination.module.css";

export default function ReceiptDestination({ onClose, onMakePayment }) {
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className={styles.container}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
        ×
      </button>

      <h2 className={styles.heading}>Checkout</h2>

      <div className={styles.card}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <svg
            className={styles.cardIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 4H20V20H4V4Z"
              stroke="#003049"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 9H20"
              stroke="#003049"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className={styles.cardTitle}>Receipt Destination</div>
        </div>

        {/* Info box */}
        <div className={styles.infoBox}>
          The receipts for all your transactions will be sent to your whatsapp
          as well as your email upon payment.
        </div>

        {/* Inputs */}
        <label className={styles.field}>
          <span className={styles.labelText}>
            Enter the WhatsApp number to receive your receipt
          </span>
          <div className={styles.inputRow}>
            <input
              type="text"
              className={styles.countryCode}
              value="+260"
              readOnly
            />
            <input
              type="tel"
              className={styles.whatsappInput}
              placeholder="XXX-XXX-XXX"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
        </label>

        <label className={styles.field}>
          <span className={styles.labelText}>Enter your email (optional)</span>
          <input
            type="email"
            className={styles.emailInput}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {/* Secured payments */}
        <div className={styles.secured}>
          <svg
            className={styles.lockIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M17 10H7V7a5 5 0 0110 0v3z"
              stroke="#2D3648"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="5"
              y="10"
              width="14"
              height="10"
              rx="2"
              stroke="#2D3648"
              strokeWidth="2"
            />
          </svg>
          <span>Secured payments</span>
        </div>
      </div>

      {/* Make Payment button */}
      <button
        className={styles.payBtn}
        onClick={() => onMakePayment({ whatsapp, email })}
      >
        Make Payment <span className={styles.arrow}>→</span>
      </button>

      {/* Logos */}
      <div className={styles.logos}>
        <img src="/logos/visa.svg" alt="Visa" className={styles.logo} />
        <img
          src="/logos/mastercard.svg"
          alt="Mastercard"
          className={styles.logo}
        />
        <img src="/logos/airtel.svg" alt="Airtel" className={styles.logo} />
        <img src="/logos/mtn.svg" alt="MTN" className={styles.logo} />
        <img src="/logos/zamtel.svg" alt="Zamtel" className={styles.logo} />
      </div>
    </div>
  );
}
