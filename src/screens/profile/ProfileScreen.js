import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import AuthButton from '../../components/common/AuthButton';
import { API_URL } from '../../constants/api';

// Componente para mostrar cada campo de información
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Feather name={icon} size={20} color={COLORS.primary} style={styles.icon} />
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'No especificado'}</Text>
    </View>
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/auth/perfil`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar perfil');
      }

      setUserData(data.usuario);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      Alert.alert('Error', 'No se pudo cargar la información del perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Feather name="alert-circle" size={50} color={COLORS.error} />
          <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
          <AuthButton title="Reintentar" onPress={cargarPerfil} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={50} color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>{userData.nombre}</Text>
          <Text style={styles.userEmail}>{userData.correo}</Text>
        </View>

        <View style={styles.infoContainer}>
          <InfoRow icon="phone" label="Teléfono" value={userData.telefono} />
          <InfoRow icon="hash" label="Cédula" value={userData.cedula} />
          <InfoRow icon="map-pin" label="Dirección" value={userData.direccion} />
          <InfoRow icon="calendar" label="Fecha de Nacimiento" value={userData.fecha_nacimiento} />
          <InfoRow icon="dollar-sign" label="Saldo" value={`$${userData.saldo?.toFixed(2) || '0.00'}`} />
        </View>

        <AuthButton 
          title="Cambiar Contraseña" 
          onPress={() => navigation.navigate('ChangePassword')} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
  },
  header: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userName: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  userEmail: { fontSize: 16, color: COLORS.textSecondary },
  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  icon: { marginRight: 15, marginLeft: 5 },
  label: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 2 },
  value: { fontSize: 16, color: COLORS.text, fontWeight: '600' },
});

export default ProfileScreen;