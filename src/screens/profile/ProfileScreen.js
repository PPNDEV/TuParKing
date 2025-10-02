import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import AuthButton from '../../components/common/AuthButton';

// Componente para mostrar cada campo de información
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Feather name={icon} size={20} color={COLORS.primary} style={styles.icon} />
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const ProfileScreen = ({ navigation }) => {
  // Estos datos vendrían de tu AuthContext o de una llamada a la API
  const userData = {
    correo: 'brandoncastill761@gmail.com',
    nombres: 'Brandon Castillo',
    telefono: '0980087552',
    cedula: '0706175189',
    direccion: 'Cdla. El Paraiso',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={50} color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>{userData.nombres}</Text>
          <Text style={styles.userEmail}>{userData.correo}</Text>
        </View>

        <View style={styles.infoContainer}>
          <InfoRow icon="phone" label="Teléfono" value={userData.telefono} />
          <InfoRow icon="hash" label="Cédula" value={userData.cedula} />
          <InfoRow icon="map-pin" label="Dirección" value={userData.direccion} />
        </View>

        <AuthButton 
          title="Cambiar Contraseña" 
          onPress={() => navigation.navigate('ChangePassword')} 
        />
      </View>
    </SafeAreaView>
  );
};

// ... (Estilos abajo)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 20 },
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
