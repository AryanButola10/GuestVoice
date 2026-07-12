/**
 * AuthCallback — Handles the redirect from Google OAuth.
 *
 * Google redirects to: /auth/callback?token=<jwt>
 * This page reads the token, saves it, and redirects to /dashboard.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      login(token);
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f172a',
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      fontSize: '18px',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔐</div>
        <p>Logging you in...</p>
      </div>
    </div>
  );
}
