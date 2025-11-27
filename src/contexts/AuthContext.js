import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';

// Wrapper para AsyncStorage compatible con web
const storage = {
  async getItem(key) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  async removeItem(key) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    try {
      const tokenGuardado = await storage.getItem('token');
      const usuarioGuardado = await storage.getItem('usuario');

      if (tokenGuardado && usuarioGuardado) {
        setToken(tokenGuardado);
        setUser(JSON.parse(usuarioGuardado));
        setUserIsLoggedIn(true);
        console.log('✅ Sesión restaurada');
      } else {
        console.log('ℹ️ No hay sesión guardada');
      }
    } catch (error) {
      console.error('❌ Error al verificar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (correo, clave) => {
    try {
      console.log('📡 Intentando login con:', correo);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, clave }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      await storage.setItem('token', data.token);
      await storage.setItem('usuario', JSON.stringify(data.usuario));

      setToken(data.token);
      setUser(data.usuario);
      setUserIsLoggedIn(true);

      console.log('✅ Login exitoso:', data.usuario.nombre);

      return { success: true, usuario: data.usuario };
    } catch (error) {
      console.error('❌ Error en login:', error.message);
      return { success: false, error: error.message };
    }
  };

  const registro = async (cedula, correo, nombre, telefono, clave) => {
    try {
      console.log('📡 Intentando registro con:', correo);
      
      const response = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cedula, correo, nombre, telefono, clave }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      await storage.setItem('token', data.token);
      await storage.setItem('usuario', JSON.stringify(data.usuario));

      setToken(data.token);
      setUser(data.usuario);
      setUserIsLoggedIn(true);

      console.log('✅ Registro exitoso:', data.usuario.nombre);

      return { success: true, usuario: data.usuario };
    } catch (error) {
      console.error('❌ Error en registro:', error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await storage.removeItem('token');
      await storage.removeItem('usuario');
      setToken(null);
      setUser(null);
      setUserIsLoggedIn(false);
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  const actualizarPerfil = async (datosActualizados) => {
    try {
      console.log('📡 Actualizando perfil...');
      
      const response = await fetch(`${API_URL}/auth/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(datosActualizados),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar perfil');
      }

      const usuarioActualizado = { ...user, ...data.usuario };
      await storage.setItem('usuario', JSON.stringify(usuarioActualizado));
      setUser(usuarioActualizado);

      console.log('✅ Perfil actualizado');

      return { success: true, usuario: data.usuario };
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error.message);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userIsLoggedIn,
        user,
        token,
        loading,
        login,
        registro,
        logout,
        actualizarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};