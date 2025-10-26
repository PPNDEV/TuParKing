import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import AuthTextInput from '../../components/common/AuthTextInput';
import AuthButton from '../../components/common/AuthButton';

const LoginScreen = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);

    const handleLogin = async () => {
    // Validar que los campos no estén vacíos
    if (!correo || !clave) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    console.log('🔐 Iniciando proceso de login...');
    setLoading(true);
    const resultado = await login(correo, clave);
    setLoading(false);

    console.log('📊 Resultado del login:', resultado);

    if (!resultado.success) {
      Alert.alert('Error', resultado.error || 'No se pudo iniciar sesión');
    } else {
      console.log('✅ Login exitoso en LoginScreen');
    }
    // Si el login es exitoso, el AuthContext cambiará userIsLoggedIn a true
    // y App.js mostrará automáticamente el AppNavigator
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Image 
          source={require('../../assets/icon.png')}
          style={styles.logo} 
        />
        <Text style={styles.title}>Bienvenido a TuParKing</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        
        <AuthTextInput
          icon="mail"
          value={correo}
          onChangeText={setCorreo}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AuthTextInput
          icon="lock"
          value={clave}
          onChangeText={setClave}
          placeholder="Contraseña"
          secureTextEntry
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <AuthButton title="Ingresar" onPress={handleLogin} />
        )}

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 40,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'right',
    width: '100%',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  registerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;