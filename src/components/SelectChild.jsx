import styles from "../styles/SelectChild.module.css";

function SelectChild() {
  return (
    <label className={styles.childCard}>
      <div className={styles.leftSection}>
        <input type="checkbox" className={styles.checkbox} />
        <div className={styles.childInfo}>
          <h2>Talitha Kapambwe</h2>
          <div className={styles.meta}>
            <span>Grade 3A</span>
            <span className={styles.separator}>|</span>
            <span>C20012</span>
          </div>
        </div>
      </div>
      <button className={styles.clearBalance}>View/Clear (0) Balances</button>
    </label>
  );
}

export default SelectChild;
