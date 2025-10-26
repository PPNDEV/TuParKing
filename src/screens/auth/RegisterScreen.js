import React, { useState, useContext } from 'react';
import { Text, StyleSheet, SafeAreaView, ScrollView, View, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import AuthTextInput from '../../components/common/AuthTextInput';
import AuthButton from '../../components/common/AuthButton';

const RegisterScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { registro } = useContext(AuthContext);

  const handleRegister = async () => {
    // Validar campos obligatorios
    if (!nombre || !correo || !clave || !cedula) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios (Nombre, Correo, Contraseña, Cédula)');
      return;
    }

    // Validar formato de correo básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    // Validar longitud de contraseña
    if (clave.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    const resultado = await registro(cedula, correo, nombre, telefono, clave);
    setLoading(false);

    if (!resultado.success) {
      Alert.alert('Error', resultado.error || 'No se pudo registrar');
    } else {
      Alert.alert('¡Éxito!', 'Cuenta creada exitosamente', [
        { text: 'OK' }
      ]);
      // Si el registro es exitoso, el usuario será logueado automáticamente
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear una cuenta</Text>
        <Text style={styles.subtitle}>Completa tus datos para empezar a usar TuParKing.</Text>
        
        <AuthTextInput 
          icon="user" 
          placeholder="Nombres completos *" 
          value={nombre}
          onChangeText={setNombre}
        />
        
        <AuthTextInput 
          icon="mail" 
          placeholder="Correo electrónico *" 
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />
        
        <AuthTextInput 
          icon="lock" 
          placeholder="Contraseña *" 
          secureTextEntry
          value={clave}
          onChangeText={setClave}
        />
        
        <AuthTextInput 
          icon="hash" 
          placeholder="Cédula *" 
          keyboardType="number-pad"
          value={cedula}
          onChangeText={setCedula}
        />
        
        <AuthTextInput 
          icon="phone" 
          placeholder="Teléfono (opcional)" 
          keyboardType="phone-pad"
          value={telefono}
          onChangeText={setTelefono}
        />

        <View style={{marginTop: 10}} />
        
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <AuthButton title="Registrarme" onPress={handleRegister} />
        )}

        <Text style={styles.loginText}>
          ¿Ya tienes cuenta?{' '}
          <Text 
            style={styles.loginLink} 
            onPress={() => navigation.goBack()}
          >
            Inicia sesión aquí
          </Text>
        </Text>
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
  loader: {
    marginVertical: 20,
  },
  loginText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;