import styles from "../styles/PaymentHistoryBox.module.css";
import { useEffect, useState } from "react";
import { getStudentPayments } from "../services/api";

function PaymentHistoryBox({ student }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student) return;
    setLoading(true);
    setError(null);
    
    getStudentPayments(student.id)
      .then((result) => {
        if (!result.success) throw new Error(result.error || "Failed to fetch payments");
        setPayments(result.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [student]);

  if (!student) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.icon}>{/* svg icon */}</div>
        <div className={styles.message}>Select a Pupil to View Payment History</div>
      </div>
    );
  }
  if (loading) return <div className={styles.loading}>Loading payment history...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (payments.length === 0) {
    return <div className={styles.message}>No payment history found.</div>;
  }
  return (
    <div className={styles.historyBox}>
      <div className={styles.header}>
        <span>Service Description</span>
        <span>Amount (ZMW)</span>
      </div>
      {payments.map((payment) => (
        <div key={payment.id} className={styles.paymentRow}>
          <span>{payment.description || payment.notes || "Payment"}</span>
          <span>{payment.amount}</span>
        </div>
      ))}
    </div>
  );
}

export default PaymentHistoryBox;
