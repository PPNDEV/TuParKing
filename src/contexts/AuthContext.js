import React, { createContext, useState } from 'react';

// 1. Creamos el contexto
export const AuthContext = createContext();

// 2. Creamos el proveedor del contexto, que es un componente que "envuelve" nuestra app
export const AuthProvider = ({ children }) => {
  // Aquí guardamos el estado: ¿el usuario ha iniciado sesión?
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  // Creamos funciones para cambiar ese estado, que usaremos en nuestras pantallas
  const login = () => {
    // En el futuro, aquí recibirás un token de tu API y lo guardarás
    console.log("Simulando inicio de sesión...");
    setUserIsLoggedIn(true);
  };

  const logout = () => {
    console.log("Simulando cierre de sesión...");
    setUserIsLoggedIn(false);
  };

  // 3. Hacemos que el estado y las funciones estén disponibles para toda la app
  return (
    <AuthContext.Provider value={{ userIsLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

