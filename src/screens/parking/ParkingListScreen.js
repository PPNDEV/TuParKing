import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';

const API_URL = 'http://localhost:3000/api';

// Componente de tarjeta de parqueadero
const ParkingCard = ({ parqueadero, onPress }) => {
  const espaciosDisponibles = parqueadero.espacios_disponibles;
  const porcentajeDisponible = (espaciosDisponibles / parqueadero.espacios_totales) * 100;
  
  let disponibilidadColor = COLORS.success;
  if (porcentajeDisponible < 20) disponibilidadColor = COLORS.error;
  else if (porcentajeDisponible < 50) disponibilidadColor = COLORS.warning;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Feather name="map-pin" size={20} color={COLORS.primary} />
          <Text style={styles.cardTitle}>{parqueadero.nombre}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: disponibilidadColor + '20' }]}>
          <Text style={[styles.badgeText, { color: disponibilidadColor }]}>
            {espaciosDisponibles} disponibles
          </Text>
        </View>
      </View>

      <Text style={styles.cardAddress}>{parqueadero.direccion}</Text>

      <View style={styles.cardInfo}>
        <View style={styles.infoItem}>
          <Feather name="clock" size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            {parqueadero.horario_apertura?.substring(0, 5)} - {parqueadero.horario_cierre?.substring(0, 5)}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Feather name="dollar-sign" size={16} color={COLORS.success} />
          <Text style={styles.infoPrice}>${parqueadero.precio_por_hora}/hora</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          {parqueadero.espacios_totales} espacios totales
        </Text>
        {parqueadero.telefono && (
          <View style={styles.infoItem}>
            <Feather name="phone" size={14} color={COLORS.textSecondary} />
            <Text style={styles.footerText}>{parqueadero.telefono}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ParkingListScreen = ({ navigation }) => {
  const [parqueaderos, setParqueaderos] = useState([]);
  const [parqueaderosFiltrados, setParqueaderosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [saldo, setSaldo] = useState(0);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    cargarParqueaderos();
    cargarSaldo();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Recargar saldo cuando vuelve a esta pantalla
      cargarSaldo();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    filtrarParqueaderos();
  }, [searchText, parqueaderos]);

     const cargarSaldo = async () => {
    try {
      console.log('🔍 Cargando saldo...');
      console.log('🔑 Token:', token ? 'OK' : 'NO HAY TOKEN');

      // Cambiar a usar el mismo endpoint que MainMenuScreen
      const response = await fetch(`${API_URL}/auth/perfil`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('📥 Respuesta saldo:', data);

      if (response.ok && data.usuario) {
        const nuevoSaldo = parseFloat(data.usuario.saldo) || 0;
        console.log('💰 Saldo cargado:', nuevoSaldo);
        setSaldo(nuevoSaldo);
      } else {
        console.log('❌ Error en respuesta:', data);
      }
    } catch (error) {
      console.error('❌ Error al cargar saldo:', error);
    }
  };

  const cargarParqueaderos = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/parqueaderos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar parqueaderos');
      }

      setParqueaderos(data.parqueaderos);
      setParqueaderosFiltrados(data.parqueaderos);
    } catch (error) {
      console.error('Error al cargar parqueaderos:', error);
      Alert.alert('Error', 'No se pudieron cargar los parqueaderos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filtrarParqueaderos = () => {
    if (searchText.trim() === '') {
      setParqueaderosFiltrados(parqueaderos);
    } else {
      const filtrados = parqueaderos.filter(p =>
        p.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        p.direccion.toLowerCase().includes(searchText.toLowerCase())
      );
      setParqueaderosFiltrados(filtrados);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarParqueaderos();
    cargarSaldo();
  };

  const handleParkingPress = (parqueadero) => {
    navigation.navigate('ParkingDetail', { parkingId: parqueadero.id });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando parqueaderos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header con saldo */}
        <View style={styles.header}>
          <View style={styles.saldoContainer}>
            <Feather name="credit-card" size={20} color={COLORS.primary} />
            <Text style={styles.saldoText}>Saldo: ${saldo.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.recargarButton}
            onPress={() => navigation.navigate('RechargeStack')}
          >
            <Feather name="plus" size={18} color={COLORS.white} />
            <Text style={styles.recargarButtonText}>Recargar</Text>
          </TouchableOpacity>
        </View>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o dirección..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={COLORS.textSecondary}
          />
          {searchText !== '' && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Feather name="x" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Lista de parqueaderos */}
        <FlatList
          data={parqueaderosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ParkingCard parqueadero={item} onPress={() => handleParkingPress(item)} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={50} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No se encontraron parqueaderos</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  saldoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saldoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  recargarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  recargarButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  listContent: {
    padding: 15,
    paddingTop: 0,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardAddress: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  infoPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 15,
  },
});

export default ParkingListScreen;