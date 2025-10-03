import React, { useState } from 'react';
import { Text, StyleSheet, SafeAreaView, ScrollView, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import AuthTextInput from '../../components/common/AuthTextInput';
import AuthButton from '../../components/common/AuthButton';

const RegisterScreen = ({ navigation }) => {
  // Estados para cada campo del formulario
  // ...

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear una cuenta</Text>
        <Text style={styles.subtitle}>Completa tus datos para empezar a usar TuParKing.</Text>
        
        <AuthTextInput icon="user" placeholder="Nombres completos" />
        <AuthTextInput icon="mail" placeholder="Correo electrónico" keyboardType="email-address" />
        <AuthTextInput icon="lock" placeholder="Contraseña" secureTextEntry />
        <AuthTextInput icon="phone" placeholder="Teléfono" keyboardType="phone-pad" />
        <AuthTextInput icon="hash" placeholder="Cédula" keyboardType="number-pad" />
        <AuthTextInput icon="map-pin" placeholder="Dirección" />

        <View style={{marginTop: 10}} />
        <AuthButton title="Registrarme" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    paddingHorizontal: 25,
    paddingVertical: 20,
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
    marginBottom: 30,
  },
});

export default RegisterScreen;

