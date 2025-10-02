import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { COLORS } from '../../constants/colors';
import AuthTextInput from '../../components/common/AuthTextInput';
import AuthButton from '../../components/common/AuthButton';

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    // Aquí iría la lógica para llamar a la API y cambiar la contraseña
    Alert.alert('Éxito', 'Tu contraseña ha sido actualizada.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Cambiar Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa tu contraseña anterior y la nueva para actualizar tus credenciales.
        </Text>

        <AuthTextInput
          icon="lock"
          placeholder="Contraseña anterior"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <AuthTextInput
          icon="lock"
          placeholder="Nueva contraseña"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <AuthButton title="Confirmar Cambio" onPress={handleChangePassword} />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 25, justifyContent: 'center' },
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

export default ChangePasswordScreen;
