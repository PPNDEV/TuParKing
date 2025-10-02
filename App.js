import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// CORRECCIÓN: La ruta ahora apunta a la carpeta 'contexts' (plural)
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';

import AppNavigator from './src/navigation/AppNavigator'; // El menú principal (Drawer)
import AuthNavigator from './src/navigation/AuthNavigator'; // El flujo de Login/Registro

// Un componente para decidir qué navegador mostrar
const AppContent = () => {
  const { userIsLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {userIsLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    // Envolvemos toda la app con el proveedor de autenticación
    // para que todos los componentes hijos puedan saber si el usuario está logueado.
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}