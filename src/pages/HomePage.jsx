import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Button from "../components/Button";
import Title from "../components/Title";
import styles from "../styles/HomePage.module.css";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { parentName, students } = location.state || {};


  const handleNavigate = (path, state = {}) => {
    navigate(path, { state });
  };

  const isHomePath = location.pathname === "/home";

  return (
    <div className={styles.main}>
      {isHomePath ? (
        <>
          <Title />
          <section className={styles.userInfo}>
            <h2>Good Afternoon</h2>
            <h1>{parentName}</h1>
            <h3>
              Which one of our services would you like us to help you with
              today?
            </h3>
          </section>
          <section className={styles.buttons}>
            <Button
              message="Pay For School Fees"
              givenClassName="active"
              onClick={() => handleNavigate("payment-dashboard", { students })}
            />
            <Button
              message="View/Clear Current Balances"
              givenClassName="notActive"
              onClick={() => handleNavigate("balances", { students })}
            />
            <Button
              message="View My Payment History"
              givenClassName="notActive"
              onClick={() => handleNavigate("receipts", { students })}
            />
            <Button
              message="View School Payment Plans"
              givenClassName="notActive"
            />
          </section>
        </>
      ) : null}

      <Outlet />
    </div>
  );
}

export default HomePage;
