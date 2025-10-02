import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { COLORS } from '../../constants/colors';
import AuthTextInput from '../../components/common/AuthTextInput';
import AuthButton from '../../components/common/AuthButton';

const ForgotPasswordScreen = ({ navigation }) => {
  const [correo, setCorreo] = useState('');

  const handleRecover = () => {
    Alert.alert(
      'Solicitud Enviada',
      `Si la cuenta ${correo} existe, recibirás un correo con instrucciones.`,
      [{ text: 'Entendido', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</Text>
        
        <AuthTextInput
          icon="mail"
          value={correo}
          onChangeText={setCorreo}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={{marginTop: 10}} />
        <AuthButton title="Enviar Instrucciones" onPress={handleRecover} />
      </View>
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
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
});

export default ForgotPasswordScreen;

