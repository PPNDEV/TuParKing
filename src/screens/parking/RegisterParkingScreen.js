import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // <-- ACTUALIZADO
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// IMPORTACIONES CORRECTAS (sin llaves, porque son export default)
import AuthButton from '../../components/common/AuthButton';
import TimePickerModal from '../../components/parking/TimePickerModal';

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const RegisterParkingScreen = ({ navigation }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [parkingTime, setParkingTime] = useState(30);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRegisterParking = () => {
    console.log(`Registrando parqueo por ${parkingTime} minutos.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.balanceText}>Saldo: $15.75</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Seleccione un vehículo:</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>{selectedVehicle ? selectedVehicle.placa : 'Mis Vehículos'}</Text>
            <Feather name="chevron-down" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('VehicleList')}>
            <Text style={styles.linkText}>Agregar o ver mis vehículos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <InfoRow 
            label="Hora de Registro" 
            value={currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
          />
          <InfoRow 
            label="Fecha de Registro" 
            value={currentDateTime.toLocaleDateString()} 
          />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tiempo:</Text>
            <TouchableOpacity style={styles.timeInput} onPress={() => setModalVisible(true)}>
              <Text style={styles.timeText}>{parkingTime}</Text>
            </TouchableOpacity>
            <Text style={styles.infoValue}>minutos</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <AuthButton title="Registrar Parqueo" onPress={handleRegisterParking} />
        </View>
      </View>
      <TimePickerModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSelectTime={setParkingTime}
        initialValue={parkingTime}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 20 },
  balanceText: { textAlign: 'right', fontSize: 16, fontWeight: 'bold', color: COLORS.secondary, marginBottom: 15 },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardTitle: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 10 },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50, borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 10, paddingHorizontal: 15 },
  dropdownText: { fontSize: 16, color: COLORS.text },
  linkText: { textAlign: 'center', color: COLORS.primary, marginTop: 15, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  infoLabel: { fontSize: 16, color: COLORS.text },
  infoValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  timeInput: { borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 20 },
  timeText: { fontSize: 16, fontWeight: 'bold' },
  footer: { marginTop: 'auto' },
});

export default RegisterParkingScreen;

