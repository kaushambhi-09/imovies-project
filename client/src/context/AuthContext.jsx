import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const read = () => {
  try { return JSON.parse(localStorage.getItem('imovies_auth')) || null; } catch { return null; }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(read);
  const login = (data) => {
    localStorage.setItem('imovies_token', data.token);
    localStorage.setItem('imovies_auth', JSON.stringify({ role: data.role, user: data.user }));
    setAuth({ role: data.role, user: data.user });
  };
  const logout = () => {
    localStorage.removeItem('imovies_token');
    localStorage.removeItem('imovies_auth');
    setAuth(null);
  };
  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
}
