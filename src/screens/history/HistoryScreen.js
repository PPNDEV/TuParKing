import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';

const API_URL = 'http://localhost:3000/api';

// Componente de tarjeta de reserva
const ReservaCard = ({ reserva }) => {
  const estadoColor = {
    activa: COLORS.success,
    completada: COLORS.info,
    cancelada: COLORS.error
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Feather name="map-pin" size={18} color={COLORS.primary} />
          <Text style={styles.cardTitle}>{reserva.parqueadero_nombre}</Text>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: estadoColor[reserva.estado] + '20' }]}>
          <Text style={[styles.estadoText, { color: estadoColor[reserva.estado] }]}>
            {reserva.estado}
          </Text>
        </View>
      </View>

      <Text style={styles.direccion}>{reserva.parqueadero_direccion}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Feather name="calendar" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{formatearFecha(reserva.fecha_inicio)}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.infoItem}>
          <Feather name="clock" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{reserva.horas_reservadas}h</Text>
        </View>
        <View style={styles.infoItem}>
          <Feather name="car" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{reserva.vehiculo_placa}</Text>
        </View>
        <Text style={styles.costo}>${reserva.costo_total}</Text>
      </View>
    </View>
  );
};

// Componente de tarjeta de transacción
const TransaccionCard = ({ transaccion }) => {
  const tipoInfo = {
    recarga: { icon: 'arrow-down-circle', color: COLORS.success, label: 'Recarga' },
    pago_reserva: { icon: 'arrow-up-circle', color: COLORS.error, label: 'Pago Reserva' },
    reembolso: { icon: 'refresh-cw', color: COLORS.info, label: 'Reembolso' }
  };

  const info = tipoInfo[transaccion.tipo] || { icon: 'circle', color: COLORS.textSecondary, label: transaccion.tipo };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.transaccionCard}>
      <View style={[styles.iconContainer, { backgroundColor: info.color + '20' }]}>
        <Feather name={info.icon} size={20} color={info.color} />
      </View>
      <View style={styles.transaccionContent}>
        <Text style={styles.transaccionTipo}>{info.label}</Text>
        <Text style={styles.transaccionDescripcion}>{transaccion.descripcion}</Text>
        <Text style={styles.transaccionFecha}>{formatearFecha(transaccion.created_at)}</Text>
      </View>
      <Text style={[styles.transaccionMonto, { color: transaccion.tipo === 'recarga' ? COLORS.success : COLORS.error }]}>
        {transaccion.tipo === 'recarga' ? '+' : '-'}${transaccion.monto}
      </Text>
    </View>
  );
};

const HistoryScreen = () => {
  const [activeTab, setActiveTab] = useState('reservas'); // 'reservas' o 'transacciones'
  const [reservas, setReservas] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    cargarDatos();
  }, [activeTab]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      if (activeTab === 'reservas') {
        const response = await fetch(`${API_URL}/reservas`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          setReservas(data.reservas || []);
        }
      } else {
        const response = await fetch(`${API_URL}/transacciones`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          setTransacciones(data.transacciones || []);
        }
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reservas' && styles.activeTab]}
            onPress={() => setActiveTab('reservas')}
          >
            <Feather 
              name="calendar" 
              size={20} 
              color={activeTab === 'reservas' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'reservas' && styles.activeTabText]}>
              Reservas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'transacciones' && styles.activeTab]}
            onPress={() => setActiveTab('transacciones')}
          >
            <Feather 
              name="credit-card" 
              size={20} 
              color={activeTab === 'transacciones' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'transacciones' && styles.activeTabText]}>
              Transacciones
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {activeTab === 'reservas' ? (
              reservas.length > 0 ? (
                reservas.map((reserva) => (
                  <ReservaCard key={reserva.id} reserva={reserva} />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Feather name="inbox" size={50} color={COLORS.textSecondary} />
                  <Text style={styles.emptyText}>No tienes reservas</Text>
                </View>
              )
            ) : (
              transacciones.length > 0 ? (
                transacciones.map((transaccion) => (
                  <TransaccionCard key={transaccion.id} transaccion={transaccion} />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Feather name="inbox" size={50} color={COLORS.textSecondary} />
                  <Text style={styles.emptyText}>No tienes transacciones</Text>
                </View>
              )
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary + '20',
  },
  tabText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
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
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  direccion: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  costo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  transaccionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transaccionContent: {
    flex: 1,
  },
  transaccionTipo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  transaccionDescripcion: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  transaccionFecha: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  transaccionMonto: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 15,
  },
});

export default HistoryScreen;