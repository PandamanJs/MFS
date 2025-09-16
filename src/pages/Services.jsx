import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../components/Button";
import CheckoutBar from "../components/CheckoutBar";
import PaymentHistoryBox from "../components/PaymentHistoryBox";
import AddSchoolFeesForm from "../components/AddSchoolFeesForm";
import SelectedChild from "../components/SelectedChild";
import Title from "../components/Title";
import styles from "../styles/Services.module.css";

function Services() {
  const location = useLocation();
  const [showAddFeesForm, setShowAddFeesForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use students from location state if available, otherwise show error
    const studentsFromState = location.state?.students;
    if (studentsFromState && studentsFromState.length > 0) {
      setStudents(studentsFromState);
    } else {
      setError("No students found. Please go back and try again.");
    }
  }, [location.state]);

  function handleAddSchoolFees() {
    setShowAddFeesForm((prev) => !prev);
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const selectedStudent = students[selectedIdx] || null;

  return (
    <main>
      <Title />
      <div className={styles.instructions}>
        <h1>Choose the account(s) you want to pay for.</h1>
      </div>
      <div className={styles.subInstructions}>
        <h2>
          Tap the boxes to select the children you want to make a payment for.
        </h2>
      </div>

      <div className={styles.container}>
        <div className={styles.selectedChildren}>
          {students.map((student, idx) => (
            <div
              className={styles.childCard}
              key={student.id}
              onClick={() => setSelectedIdx(idx)}
              style={{ cursor: "pointer" }}
            >
              <SelectedChild student={student} givenClassName={idx === selectedIdx ? "active" : "notActive"} />
            </div>
          ))}
        </div>

        <div className={styles.paymentHistory}>
          {showAddFeesForm ? <AddSchoolFeesForm student={selectedStudent} /> : <PaymentHistoryBox student={selectedStudent} />}
        </div>

        <div className={styles.buttons}>
          <Button
            message={
              showAddFeesForm
                ? "← Back to Payment History"
                : "+ Add School Fees"
            }
            givenClassName="active"
            onClick={handleAddSchoolFees}
          />
          <Button
            message="Add Other Services"
            givenClassName="notActive"
            onClick={() => {}}
          />
        </div>
      </div>

      <CheckoutBar />
    </main>
  );
}

export default Services;
