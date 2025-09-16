import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import WelcomePage from "./pages/WelcomePage";
import PaymentDashboard from "./pages/PaymentDashboard";
import Services from "./pages/Services";
import BalanceSummary from "./pages/BalanceSummary";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./components/PaymentSuccess";
import PageNotFound from "./pages/PageNotFound";
import ReceiptsPage from "./pages/ReceiptsPage";

function AppWrapper() {
  const location = useLocation();

  // Define all paths where Footer should be hidden
  const hideFooter =
    location.pathname.includes("payment-dashboard") ||
    location.pathname.includes("balances") ||
    location.pathname.includes("checkout") ||
    location.pathname.includes("receipts");

  return (
    <div className="container">
      <div className="main">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="home" element={<HomePage />}>
            <Route path="payment-dashboard" element={<PaymentDashboard />}>
              <Route path="services" element={<Services />} />
            </Route>{" "}
            <Route path="balances" element={<BalanceSummary />}></Route>
            <Route path="checkout" element={<Checkout />}></Route>
            <Route path="success" element={<PaymentSuccess />} />
            <Route path="receipts" element={<ReceiptsPage />} />
          </Route>
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </div>

      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
