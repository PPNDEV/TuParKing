import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import DashboardCard from '../../components/dashboard/DashboardCard';

const PARKING_RECORDS = [ { id: '1', status: 'active' }, { id: '4', status: 'active' } ];

const MainMenuScreen = ({ navigation }) => {
  const userName = "Brandon";
  const currentBalance = 15.75;
  const activeParkingsCount = PARKING_RECORDS.filter(p => p.status === 'active').length;
  const parkingText = activeParkingsCount === 1 ? 'parqueo' : 'parqueos';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {userName}</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Saldo Actual</Text>
            <Text style={styles.balanceAmount}>${currentBalance.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.activeParkingCard} onPress={() => navigation.navigate('MyParkings')}>
          <Feather name="clock" size={24} color={COLORS.secondary} />
          <Text style={styles.activeParkingText}>
            {activeParkingsCount > 0 
              ? `Tienes ${activeParkingsCount} ${parkingText} activo${activeParkingsCount > 1 ? 's' : ''}`
              : 'No tienes parqueos activos'
            }
          </Text>
          <Feather name="chevron-right" size={24} color={COLORS.textSecondary} style={{marginLeft: 'auto'}} />
        </TouchableOpacity>
        <View style={styles.dashboardGrid}>
          <View style={styles.row}>
            <DashboardCard icon="plus-circle" title="Registrar Parqueo" onPress={() => navigation.navigate('RegisterParking')} />
            <DashboardCard icon="list" title="Mis Parqueos" onPress={() => navigation.navigate('MyParkings')} />
          </View>
          <View style={styles.row}>
            <DashboardCard icon="dollar-sign" title="Recargas" onPress={() => navigation.navigate('Recharge')} />
            <DashboardCard icon="bar-chart-2" title="Historial" onPress={() => navigation.navigate('History')} />
          </View>
          <View style={styles.row}>
            <DashboardCard icon="send" title="Transferir Saldo" onPress={() => navigation.navigate('Transfer')} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },
  container: { paddingBottom: 20 },
  header: { padding: 25, paddingTop: 40, backgroundColor: COLORS.primary },
  greeting: { fontSize: 28, fontWeight: 'bold', color: COLORS.white, marginBottom: 10 },
  balanceContainer: { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 12, padding: 15 },
  balanceLabel: { fontSize: 14, color: COLORS.white, opacity: 0.8 },
  balanceAmount: { fontSize: 32, fontWeight: 'bold', color: COLORS.white },
  activeParkingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 25,
    borderRadius: 12,
    padding: 20,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  activeParkingText: { marginLeft: 15, fontSize: 16, color: COLORS.text, fontWeight: '500' },
  dashboardGrid: { paddingHorizontal: 15, marginTop: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default MainMenuScreen;