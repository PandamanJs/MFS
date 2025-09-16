import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveQuickBooksTokens } from '../services/quickbooks';

function QuickBooksCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        if (state !== 'school-fees-app') {
          throw new Error('Invalid state parameter');
        }

        setStatus('Exchanging code for tokens...');

        // Exchange code for tokens
        const clientId = import.meta.env.VITE_QB_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_QB_CLIENT_SECRET;
        const redirectUri = `${window.location.origin}/qb-callback`;

        const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri
          })
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error}`);
        }

        const tokenData = await tokenResponse.json();
        
        setStatus('Getting company information...');

        // Get company information
        const companyResponse = await fetch('https://sandbox-quickbooks.api.intuit.com/v3/company/123146096291789/info', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Accept': 'application/json'
          }
        });

        if (!companyResponse.ok) {
          throw new Error('Failed to get company information');
        }

        const companyData = await companyResponse.json();
        const realmId = companyData.QueryResponse?.CompanyInfo?.[0]?.Id || '123146096291789'; // Fallback for sandbox

        // Save tokens
        saveQuickBooksTokens(
          tokenData.access_token,
          tokenData.refresh_token,
          realmId,
          realmId
        );

        setStatus('Success! Redirecting...');
        
        // Close popup and notify parent window
        if (window.opener) {
          window.opener.postMessage({ success: true }, window.location.origin);
          window.close();
        } else {
          // If not in popup, redirect to home
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        }

      } catch (err) {
        console.error('QuickBooks callback error:', err);
        setError(err.message);
        setStatus('Error occurred');

        // Notify parent window of error
        if (window.opener) {
          window.opener.postMessage({ success: false, error: err.message }, window.location.origin);
          setTimeout(() => window.close(), 3000);
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h2>QuickBooks Integration</h2>
      <p>{status}</p>
      {error && (
        <div style={{ 
          color: 'red', 
          marginTop: '1rem',
          padding: '1rem',
          border: '1px solid red',
          borderRadius: '4px',
          backgroundColor: '#ffe6e6'
        }}>
          {error}
        </div>
      )}
      {!error && status === 'Success! Redirecting...' && (
        <div style={{ 
          color: 'green', 
          marginTop: '1rem',
          padding: '1rem',
          border: '1px solid green',
          borderRadius: '4px',
          backgroundColor: '#e6ffe6'
        }}>
          QuickBooks connected successfully! You can now close this window.
        </div>
      )}
    </div>
  );
}

export default QuickBooksCallback;
