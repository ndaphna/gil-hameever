/**
 * Test page for lead-gift API
 * Access: /test-lead-gift
 */

'use client';

import { useState } from 'react';

export default function TestLeadGiftPage() {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await fetch('/api/lead-gift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          listId: 8,
        }),
      });

      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data,
      });

      if (!res.ok) {
        setError(`API Error: ${res.status} - ${JSON.stringify(data)}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Test Lead Gift API</h1>
      
      <button
        onClick={testAPI}
        disabled={loading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          background: loading ? '#ccc' : '#FF0080',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
        }}
      >
        {loading ? 'Testing...' : 'Test API Call'}
      </button>

      {error && (
        <div
          style={{
            background: '#fee',
            color: '#c33',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <strong>Error:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{error}</pre>
        </div>
      )}

      {response && (
        <div
          style={{
            background: response.status === 200 ? '#efe' : '#fee',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          <h3>Response:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>📋 Environment Check</h3>
        <p>The API requires these environment variables:</p>
        <ul>
          <li>BREVO_API_KEY</li>
          <li>BREVO_FROM_EMAIL</li>
          <li>BREVO_FROM_NAME</li>
        </ul>
        <p>
          <strong>Check your browser console and terminal for detailed error messages.</strong>
        </p>
      </div>
    </div>
  );
}


