import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  StatusBar, 
  ActivityIndicator, 
  RefreshControl,
  Alert 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import DashboardCard from '../../components/dashboard/DashboardCard';

const API_URL = 'http://localhost:3000/api';

const MainMenuScreen = ({ navigation }) => {
  const { user, token } = useContext(AuthContext);
  const [saldo, setSaldo] = useState(0);
  const [reservasActivas, setReservasActivas] = useState(0);
  const [vehiculos, setVehiculos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Recargar datos cuando la pantalla recibe el foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarDatos();
    });
    return unsubscribe;
  }, [navigation]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar perfil actualizado (incluye saldo)
      const perfilResponse = await fetch(`${API_URL}/auth/perfil`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (perfilResponse.ok) {
        const perfilData = await perfilResponse.json();
        setSaldo(perfilData.usuario.saldo || 0);
      }

      // Cargar reservas activas
      const reservasResponse = await fetch(`${API_URL}/reservas?estado=activa`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (reservasResponse.ok) {
        const reservasData = await reservasResponse.json();
        setReservasActivas(reservasData.reservas?.length || 0);
      }

      // Cargar vehículos
      const vehiculosResponse = await fetch(`${API_URL}/vehiculos`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (vehiculosResponse.ok) {
        const vehiculosData = await vehiculosResponse.json();
        setVehiculos(vehiculosData.vehiculos?.length || 0);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.white} />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.white}
          />
        }
      >
        
        {/* --- Saludo y Saldo --- */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Saldo Actual</Text>
            <Text style={styles.balanceAmount}>${parseFloat(saldo).toFixed(2)}</Text>
          </View>
        </View>

        {/* --- Reservas Activas --- */}
        <View style={styles.activeParkingCard}>
          <Feather name="clock" size={24} color={COLORS.secondary} />
          <Text style={styles.activeParkingText}>
            Tienes <Text style={{fontWeight: 'bold'}}>{reservasActivas} {reservasActivas === 1 ? 'reserva' : 'reservas'}</Text> {reservasActivas === 1 ? 'activa' : 'activas'}
          </Text>
        </View>

        {/* --- Cuadrícula de Acciones (Dashboard) --- */}
        <View style={styles.dashboardGrid}>
          <View style={styles.row}>
            <DashboardCard 
              icon="map" 
              title="Buscar Parqueadero" 
              onPress={() => navigation.navigate('ParkingStack')} 
            />
            <DashboardCard 
              icon="clock" 
              title="Mis Reservas" 
              onPress={() => navigation.navigate('HistoryStack')} 
            />
          </View>
          <View style={styles.row}>
            <DashboardCard 
              icon="dollar-sign" 
              title="Recargar Saldo" 
              onPress={() => navigation.navigate('RechargeStack')} 
            />
            <DashboardCard 
              icon="truck" 
              title={`Mis Vehículos (${vehiculos})`}
              onPress={() => navigation.navigate('VehicleStack')} 
            />
          </View>
          <View style={styles.row}>
            <DashboardCard 
              icon="list" 
              title="Historial" 
              onPress={() => navigation.navigate('HistoryStack')} 
            />
            <DashboardCard 
              icon="user" 
              title="Mi Perfil" 
              onPress={() => navigation.navigate('ProfileStack')} 
            />
          </View>
        </View>

        {/* --- Información adicional --- */}
        {reservasActivas > 0 && (
          <View style={styles.infoCard}>
            <Feather name="info" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>
              Tienes reservas activas. Visita el historial para ver los detalles.
            </Text>
          </View>
        )}

        {vehiculos === 0 && (
          <View style={styles.warningCard}>
            <Feather name="alert-circle" size={20} color={COLORS.warning} />
            <Text style={styles.warningText}>
              No tienes vehículos registrados. Agrega uno para poder hacer reservas.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.white,
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
    marginTop: -20,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info + '20',
    marginHorizontal: 25,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.info,
    lineHeight: 20,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    marginHorizontal: 25,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.warning,
    lineHeight: 20,
  },
});

export default MainMenuScreen;