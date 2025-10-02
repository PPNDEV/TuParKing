import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import DashboardCard from '../../components/dashboard/DashboardCard';

const MainMenuScreen = ({ navigation }) => {
  // Datos de ejemplo que vendrían de la API
  const userName = "Brandon";
  const currentBalance = 15.75;
  const activeParkings = 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* --- Saludo y Saldo --- */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {userName}</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Saldo Actual</Text>
            <Text style={styles.balanceAmount}>${currentBalance.toFixed(2)}</Text>
          </View>
        </View>

        {/* --- Parqueos Activos --- */}
        <View style={styles.activeParkingCard}>
          <Feather name="clock" size={24} color={COLORS.secondary} />
          <Text style={styles.activeParkingText}>
            Tienes <Text style={{fontWeight: 'bold'}}>{activeParkings} parqueo</Text> activo
          </Text>
        </View>

        {/* --- Cuadrícula de Acciones (Dashboard) --- */}
        <View style={styles.dashboardGrid}>
          <View style={styles.row}>
            <DashboardCard icon="plus-circle" title="Registrar Parqueo" onPress={() => { /* Navegar a Registrar */ }} />
            <DashboardCard icon="list" title="Mis Registros" onPress={() => { /* Navegar a Registros */ }} />
          </View>
          <View style={styles.row}>
            <DashboardCard icon="dollar-sign" title="Recargas" onPress={() => { /* Navegar a Recargas */ }} />
            <DashboardCard icon="bar-chart-2" title="Historial" onPress={() => { /* Navegar a Historial */ }} />
          </View>
          <View style={styles.row}>
            <DashboardCard icon="send" title="Transferir Saldo" onPress={() => { /* Navegar a Transferir */ }} />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// ... Estilos abajo
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    paddingBottom: 20,
  },
  header: {
    padding: 25,
    paddingTop: 40,
    backgroundColor: COLORS.primary,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 15,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  activeParkingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 25,
    borderRadius: 12,
    padding: 15,
    marginTop: -20, // Efecto de superposición
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  activeParkingText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  dashboardGrid: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});


export default MainMenuScreen;
