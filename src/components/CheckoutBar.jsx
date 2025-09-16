import styles from "../styles/CheckoutBar.module.css";

function CheckoutBar() {
  return (
    <div className={styles.checkoutBar}>
      <div className={styles.total}>
        <div className={styles.amount}>ZMW 0</div>
        <div className={styles.label}>Grand total</div>
      </div>
      <button className={styles.checkoutButton} disabled>
        Checkout
      </button>
    </div>
  );
}

export default CheckoutBar;
