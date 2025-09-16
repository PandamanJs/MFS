import { useMemo } from "react";
import QuickBooksAuth from "../components/QuickBooksAuth";

function AdminQuickBooks() {
  const isAuthorized = useMemo(() => {
    const url = new URL(window.location.href);
    const key = url.searchParams.get("key") || "";
    const adminKey = import.meta.env.VITE_ADMIN_KEY || "";
    return adminKey && key && key === adminKey;
  }, []);

  if (!isAuthorized) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Not Found</h2>
        <p>The page you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>QuickBooks Admin</h1>
      <p style={{ marginTop: 0, color: "#666" }}>
        Connect or refresh QuickBooks tokens for background syncing. This page is
        hidden from end users.
      </p>
      <QuickBooksAuth />
    </div>
  );
}

export default AdminQuickBooks;


