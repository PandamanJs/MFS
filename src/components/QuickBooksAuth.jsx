import { useState, useEffect } from 'react';
import { initializeQuickBooks, saveQuickBooksTokens } from '../services/quickbooks';
import styles from '../styles/QuickBooksAuth.module.css';

function QuickBooksAuth({ onAuthSuccess, onAuthError }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    // Check if already connected
    const connected = initializeQuickBooks();
    setIsConnected(connected);
    
    if (connected) {
      // Load company info
      loadCompanyInfo();
    }
  }, []);

  const loadCompanyInfo = async () => {
    try {
      // This would typically fetch company info from QuickBooks
      // For now, we'll just show a placeholder
      setCompanyInfo({
        name: 'Connected Company',
        id: localStorage.getItem('qb_company_id')
      });
    } catch (err) {
      console.error('Error loading company info:', err);
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);
    setError(null);

    // QuickBooks OAuth URL (you'll need to replace with your actual OAuth URL)
    const clientId = import.meta.env.VITE_QB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/qb-callback`;
    const scope = 'com.intuit.quickbooks.accounting';
    const state = 'school-fees-app'; // CSRF protection

    const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
    
    // Open OAuth in popup window
    const popup = window.open(
      authUrl,
      'quickbooks-auth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    // Listen for OAuth completion
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setIsConnecting(false);
        // Check if auth was successful by looking for tokens
        const accessToken = localStorage.getItem('qb_access_token');
        if (accessToken) {
          setIsConnected(true);
          onAuthSuccess?.();
          loadCompanyInfo();
        }
      }
    }, 1000);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('qb_access_token');
    localStorage.removeItem('qb_refresh_token');
    localStorage.removeItem('qb_realm_id');
    localStorage.removeItem('qb_company_id');
    setIsConnected(false);
    setCompanyInfo(null);
  };

  const handleManualAuth = () => {
    const accessToken = prompt('Enter QuickBooks Access Token:');
    const refreshToken = prompt('Enter QuickBooks Refresh Token:');
    const realmId = prompt('Enter QuickBooks Realm ID:');
    const companyId = prompt('Enter QuickBooks Company ID:');

    if (accessToken && realmId) {
      saveQuickBooksTokens(accessToken, refreshToken, realmId, companyId);
      setIsConnected(true);
      onAuthSuccess?.();
      loadCompanyInfo();
    } else {
      setError('Please provide all required QuickBooks credentials');
    }
  };

  if (isConnected) {
    return (
      <div className={styles.connected}>
        <div className={styles.status}>
          <div className={styles.indicator}></div>
          <span>Connected to QuickBooks</span>
        </div>
        {companyInfo && (
          <div className={styles.companyInfo}>
            <strong>{companyInfo.name}</strong>
            <small>ID: {companyInfo.id}</small>
          </div>
        )}
        <button 
          className={styles.disconnectBtn}
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.header}>
        <h3>QuickBooks Integration</h3>
        <p>Connect to QuickBooks to automatically sync transactions</p>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.buttons}>
        <button 
          className={styles.connectBtn}
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect to QuickBooks'}
        </button>

        <button 
          className={styles.manualBtn}
          onClick={handleManualAuth}
        >
          Manual Setup
        </button>
      </div>

      <div className={styles.help}>
        <h4>Setup Instructions:</h4>
        <ol>
          <li>Create a QuickBooks app at <a href="https://developer.intuit.com" target="_blank" rel="noopener noreferrer">developer.intuit.com</a></li>
          <li>Get your Client ID and Client Secret</li>
          <li>Set up OAuth redirect URI: <code>{window.location.origin}/qb-callback</code></li>
          <li>Use "Connect to QuickBooks" or "Manual Setup" to authenticate</li>
        </ol>
      </div>
    </div>
  );
}

export default QuickBooksAuth;
