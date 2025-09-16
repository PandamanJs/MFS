import styles from "../styles/StudentHeader.module.css";

function StudentHeader() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.leftSection}>
        <div className={styles.name}>
          Isaiah Kapambwe - <span className={styles.code}>C20012</span>
        </div>
        <div className={styles.schoolInfo}>
          Grade 3A - Twalumbu Education Centre
        </div>
      </div>
      <div className={styles.amount}>ZMW 0</div>
    </div>
  );
}

export default StudentHeader;
