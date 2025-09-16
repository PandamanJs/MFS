import styles from "../styles/Button.module.css";
function Button({ message, givenClassName, onClick }) {
  return (
    <button className={styles[givenClassName]} onClick={onClick}>
      {message}
    </button>
  );
}

export default Button;
