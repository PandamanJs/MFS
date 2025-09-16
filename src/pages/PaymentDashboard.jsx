import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Button from "../components/Button";
import styles from "../styles/PaymentDashboard.module.css";
import StudentHeader from "../components/StudentHeader";
import SelectChild from "../components/SelectChild"; // assuming this exists

function PaymentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const students = location.state?.students || [];
  const [selected, setSelected] = useState([]);

  const handleSelected = (studentID) => {
    setSelected((prev) =>
      prev.includes(studentID)
        ? prev.filter((id) => id !== studentID)
        : [...prev, studentID]
    );
  };

  const handleSelectServices = () => {
    if (selected.length === 0) return;

    const selectedStudents = students.filter((s) =>
      selected.includes(s.student_id)
    );

    navigate("services", { state: { students: selectedStudents } });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const isBasePath = location.pathname === "/home/payment-dashboard";

  return (
    <main className={styles.main}>
      {isBasePath ? (
        <>
          <div
            className={styles.nav}
            onClick={handleGoBack}
            style={{ cursor: "pointer" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711Z"
                fill="#2D3648"
              />
            </svg>
          </div>

          <div className={styles.instructions}>
            <h1>Choose the account(s) you want to pay for.</h1>
          </div>
          <div className={styles.subInstructions}>
            <h2>
              Tap the boxes to select the children you want to make a payment
              for.
            </h2>
          </div>

          <StudentHeader />

          <div className={styles.container}>
            {students.map((student) => (
              <SelectChild
                key={student.student_id}
                studentName={[
                  student.first_name,
                  student.middle_name,
                  student.last_name,
                ]
                  .filter(Boolean)
                  .join(" ")}
                balance={student.balance}
                isSelected={selected.includes(student.student_id)}
                onClick={() => handleSelected(student.student_id)}
              />
            ))}
          </div>

          <Button
            message="Select Services"
            givenClassName={selected.length > 0 ? "active" : "notActive"}
            onClick={handleSelectServices}
            disabled={selected.length === 0}
          />
        </>
      ) : (
        <Outlet context={{ students }} />
      )}
    </main>
  );
}

export default PaymentDashboard;
