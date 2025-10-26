import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';

const API_URL = 'http://localhost:3000/api';

const ReservationScreen = ({ navigation }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    cargarReservas();
  }, []);

  
  const normalizarReserva = (r) => ({
    id: r.id,
    parqueaderoNombre: r.parqueadero_nombre ?? r.parqueaderoNombre ?? r.nombre,
    parqueaderoDireccion: r.parqueadero_direccion ?? r.parqueaderoDireccion ?? r.direccion,
    vehiculoPlaca: r.vehiculo_placa ?? r.placa_vehiculo ?? r.placa,
    fechaInicio: r.fecha_inicio ?? r.fechaInicio,
    fechaFin: r.fecha_fin ?? r.fechaFin,
    costoTotal: Number(r.costo_total ?? r.costoTotal ?? 0),
    estado: r.estado,
  });

  const cargarReservas = async () => {
    try {
      const response = await fetch(`${API_URL}/reservas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        const list = Array.isArray(data) ? data : data?.reservas;
        setReservas((list || []).map(normalizarReserva));
      } else {
        Alert.alert('Error', data.error || 'Error al cargar reservas');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudieron cargar las reservas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarReservas();
  };

  const handleCancelar = (id) => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de cancelar esta reserva?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/reservas/${id}/cancelar`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              const data = await response.json();

              if (response.ok) {
                Alert.alert('Éxito', 'Reserva cancelada correctamente');
                cargarReservas();
              } else {
                Alert.alert('Error', data.error || 'Error al cancelar');
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo cancelar la reserva');
            }
          }
        }
      ]
    );
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activa': return COLORS.success;
      case 'completada': return COLORS.info;
      case 'cancelada': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'activa': return 'clock';
      case 'completada': return 'check-circle';
      case 'cancelada': return 'x-circle';
      default: return 'circle';
    }
  };

   const renderReserva = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.parqueaderoNombre}>{item.parqueaderoNombre}</Text>
          <Text style={styles.parqueaderoDireccion}>{item.parqueaderoDireccion}</Text>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) + '20' }]}>
          <Feather name={getEstadoIcon(item.estado)} size={16} color={getEstadoColor(item.estado)} />
          <Text style={[styles.estadoText, { color: getEstadoColor(item.estado) }]}>
            {item.estado?.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Feather name="truck" size={16} color={COLORS.primary} />
        <Text style={styles.infoText}>Vehículo: {item.vehiculoPlaca}</Text>
      </View>

      <View style={styles.infoRow}>
        <Feather name="calendar" size={16} color={COLORS.primary} />
        <Text style={styles.infoText}>
          Inicio: {item.fechaInicio ? new Date(item.fechaInicio).toLocaleString('es-ES') : '-'}
        </Text>
      </View>

      {item.fechaFin && (
        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Fin: {new Date(item.fechaFin).toLocaleString('es-ES')}
          </Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <Feather name="dollar-sign" size={16} color={COLORS.primary} />
        <Text style={styles.infoText}>Total: ${item.costoTotal}</Text>
      </View>

      {item.estado === 'activa' && (
        <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelar(item.id)}>
          <Feather name="x-circle" size={18} color={COLORS.error} />
          <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Feather name="bookmark" size={30} color={COLORS.primary} />
          <Text style={styles.title}>Mis Reservas</Text>
        </View>

        {reservas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={80} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No tienes reservas</Text>
            <Text style={styles.emptySubtext}>
              Ve a Parqueaderos para hacer una reserva
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('ParkingStack')}
            >
              <Text style={styles.emptyButtonText}>Ver Parqueaderos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={reservas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderReserva}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
              />
            }
          />
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 15,
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  parqueaderoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  parqueaderoDireccion: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error + '10',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  cancelButtonText: {
    color: COLORS.error,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default ReservationScreen;