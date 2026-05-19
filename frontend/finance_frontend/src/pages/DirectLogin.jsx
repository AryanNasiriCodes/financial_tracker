import { useState } from 'react';

export default function DirectLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('aryan123');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    setMessage('Logging in...');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.access) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        setMessage(`✅ Success! Token saved. Redirecting...`);
        console.log('nice');
      } else {
        setMessage(`❌ Failed: ${JSON.stringify(data)}`);
        console.log('ridi');
      }
    } catch (err) {
      setMessage(`❌ Network error: ${err.message}`);
      console.log('network');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Direct Login Test</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px' }}
      />
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Login
      </button>
      <pre style={{ marginTop: '20px', background: '#f0f0f0', padding: '10px' }}>{message}</pre>
    </div>
  );
}