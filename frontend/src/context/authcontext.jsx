import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    tenant: localStorage.getItem("tenant") || null,
    role: localStorage.getItem("role") || null,
  });

  const login = (token, tenant, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("tenant", tenant);
    localStorage.setItem("role", role);
    setAuth({ token, tenant, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tenant");
    localStorage.removeItem("role");
    setAuth({ token: null, tenant: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
