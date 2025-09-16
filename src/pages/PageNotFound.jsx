import styles from "../styles/PageNotFound.module.css";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <button className={styles.homeButton} onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
}

export default PageNotFound;
