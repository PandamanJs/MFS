import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CreditCheckout.module.css";

export default function CreditCheckout({
  student = { name: "Isaiah Kapambwe", code: "C20012" },
  service = {
    label: "School Fees - Grade 3B",
    term: "Term 1 2025",
    amount: 1500,
  },
  total = 0,
  onProceed,
  onClose,
}) {
  const navigate = useNavigate();

  return (
    <main className={styles.container}>
      <button
        className={styles.closeBtn}
        onClick={() => (onClose ? onClose() : navigate(-1))}
        aria-label="Close"
      >
        ×
      </button>

      <h2 className={styles.heading}>Checkout</h2>

      {/* Dark credit card */}
      <div className={styles.creditCard}>
        <div className={styles.pattern} />
        <svg
          className={styles.cardIcon}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path
            d="M9 8.33342C9 10.0593 10.3431 11.4584 12 11.4584C13.6569 11.4584 15 10.0593 15 8.33342M3 17.5003V7.50029C3 6.33351 3 5.74969 3.21799 5.30404C3.40973 4.91203 3.71547 4.59355 4.0918 4.39382C4.51962 4.16675 5.08009 4.16675 6.2002 4.16675H17.8002C18.9203 4.16675 19.4796 4.16675 19.9074 4.39382C20.2837 4.59355 20.5905 4.91203 20.7822 5.30404C21 5.74925 21 6.33237 21 7.49686V17.5038C21 18.6683 21 19.2506 20.7822 19.6958C20.5905 20.0878 20.2837 20.4068 19.9074 20.6066C19.48 20.8334 18.921 20.8334 17.8031 20.8334H6.19691C5.07899 20.8334 4.5192 20.8334 4.0918 20.6066C3.71547 20.4068 3.40973 20.0878 3.21799 19.6958C3 19.2501 3 18.6671 3 17.5003Z"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div>
          <div className={styles.cardTitle}>Credit Payment</div>
          <div className={styles.cardLabel}>Total</div>
        </div>
        <div className={styles.cardAmount}>{total.toFixed(2)}</div>
      </div>

      {/* White service card */}
      <div className={styles.serviceCard}>
        <p className={styles.instruction}>Enter the amount you want to pay.</p>
        <div className={styles.studentInfo}>
          {student.name} – {student.code}
        </div>
        <div className={styles.serviceRow}>
          <div>
            <div className={styles.serviceLabel}>{service.label}</div>
            <div className={styles.termLabel}>{service.term}</div>
          </div>
          <div className={styles.serviceAmount}>
            K{service.amount.toLocaleString()}
          </div>
        </div>

        <div className={styles.inputRow}>
          <span className={styles.inputAmount}>0.00</span>
        </div>
      </div>

      <button
        className={styles.proceedBtn}
        onClick={() => onProceed && onProceed()}
      >
        Proceed <span className={styles.arrow}>→</span>
      </button>
    </main>
  );
}
