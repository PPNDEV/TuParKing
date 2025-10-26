import 'react-native-gesture-handler';
import './App.css';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';

import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';

// Componente interno que decide qué navegador mostrar
const AppContent = () => {
  const { userIsLoggedIn, loading } = useContext(AuthContext);

  console.log('🔍 AppContent - userIsLoggedIn:', userIsLoggedIn);
  console.log('🔍 AppContent - loading:', loading);

  // Mostrar loading mientras verifica si hay sesión guardada
  if (loading) {
    console.log('⏳ Mostrando pantalla de carga...');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Decidir qué navegador mostrar
  return userIsLoggedIn ? <AppNavigator /> : <AuthNavigator />;
};

// Componente principal de la app
export default function App() {
  console.log('🚀 App iniciada');
  
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});