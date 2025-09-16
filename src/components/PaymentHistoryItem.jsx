import styles from "../styles/PaymentHistoryItem.module.css";

function PaymentHistoryItem({ description, invoice, amount }) {
  return (
    <div className={styles.item}>
      <div className={styles.description}>
        <strong>Grade 3 - Term 1 2025</strong>
        <div className={styles.invoice}>Invoice No. 202</div>
      </div>
      <div className={styles.amount}>K1,500</div>
    </div>
  );
}

export default PaymentHistoryItem;
