import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import AuthTextInput from '../../components/common/AuthTextInput';
import AuthButton from '../../components/common/AuthButton';

const LoginScreen = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { login } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Image 
          source={require('../../assets/icon.png')} // Usando el ícono local
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
          value={contrasena}
          onChangeText={setContrasena}
          placeholder="Contraseña"
          secureTextEntry
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <AuthButton title="Ingresar" onPress={login} />

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

