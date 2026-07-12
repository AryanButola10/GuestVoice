/**
 * AuthContext — Global authentication state for GuestVoice.
 *
 * Stores JWT in localStorage under key 'guestvoice_token'.
 * Decodes the token payload to extract user info (no extra API call needed).
 *
 * Usage:
 *   const { user, token, login, logout, isAuthenticated } = useAuth();
 */

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

/** Decode JWT payload without a library (base64 decode middle segment). */
function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      provider: payload.provider || 'local',
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('guestvoice_token'));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('guestvoice_token');
    return t ? decodeToken(t) : null;
  });

  /** Called after successful login or register — saves token + decodes user. */
  function login(newToken) {
    localStorage.setItem('guestvoice_token', newToken);
    setToken(newToken);
    setUser(decodeToken(newToken));
  }

  /** Clears session — token and user removed from memory and storage. */
  function logout() {
    localStorage.removeItem('guestvoice_token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      token,
      user,
      login,
      logout,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to access auth context from any component. */
export function useAuth() {
  return useContext(AuthContext);
}
