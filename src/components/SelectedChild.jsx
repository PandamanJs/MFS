import styles from "../styles/SelectedChild.module.css";

function SelectedChild({ student, givenClassName }) {
  if (!student) return null;
  return (
    <div className={`${styles.main} ${styles[givenClassName]}`}>
      <span>{student.first_name} {student.last_name}</span>
      <span>{student.student_id}</span>
    </div>
  );
}

export default SelectedChild;
