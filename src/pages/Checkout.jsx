import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { makePayment } from "../services/api";

function Checkout() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    setItems(storedItems);
  }, []);

  const handleConfirm = async () => {
    const total = items.reduce((sum, i) => sum + i.amount, 0);

    try {
      // Get parent and student data from location state or context
      const parentData = location.state?.parentData;
      const studentData = location.state?.studentData;

      const result = await makePayment({ 
        items, 
        total, 
        parentData, 
        studentData 
      });

      if (result.success) {
        let successMessage = `✅ Payment successful! Transaction ID: ${result.transaction_id}`;
        
        // Add QuickBooks sync status to message
        if (result.quickbooks) {
          if (result.quickbooks.success) {
            successMessage += `\n📊 Synced to QuickBooks: Invoice ${result.quickbooks.invoiceId}`;
          } else {
            successMessage += `\n⚠️ QuickBooks sync failed: ${result.quickbooks.error}`;
          }
        }
        
        setMessage(successMessage);
        localStorage.removeItem("checkoutItems");
        setItems([]);
      } else {
        setMessage(`❌ Payment failed: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      setMessage(`❌ Network error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Checkout</h1>

      {items.length === 0 ? (
        <p>No items in your checkout.</p>
      ) : (
        <div>
          <ul style={{ padding: 0, listStyle: "none" }}>
            {items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: "1rem" }}>
                <strong>{item.name}</strong>: ${item.amount}
              </li>
            ))}
          </ul>

          <p>
            <strong>Total:</strong> $
            {items.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
          </p>

          <button onClick={handleConfirm} style={{ padding: "0.5rem 1rem", fontWeight: "bold" }}>
            Confirm Payment
          </button>
        </div>
      )}

      {message && (
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f1f1f1" }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Checkout;

