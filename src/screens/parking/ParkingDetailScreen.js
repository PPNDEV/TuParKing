import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import { API_URL } from '../../constants/api';

const ParkingDetailScreen = ({ route, navigation }) => {
  const { parkingId } = route.params;
  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vehiculos, setVehiculos] = useState([]);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [horas, setHoras] = useState('1');
  const [reservando, setReservando] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    console.log('📍 ParkingDetailScreen - parkingId:', parkingId);
    cargarDetalle();
    cargarVehiculos();
  }, []);

  const cargarDetalle = async () => {
    try {
      console.log('📡 Cargando detalle del parqueadero:', parkingId);
      const response = await fetch(`${API_URL}/parqueaderos/${parkingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('📦 Respuesta del servidor:', data);

      if (response.ok) {
        const parkingData = data.parqueadero || data;
        const adaptedParking = {
          ...parkingData,
          tarifa_hora: parkingData.precio_por_hora || parkingData.tarifa_hora,
          hora_apertura: parkingData.horario_apertura || parkingData.hora_apertura,
          hora_cierre: parkingData.horario_cierre || parkingData.hora_cierre,
        };
        console.log('✅ Parqueadero cargado:', adaptedParking);
        setParking(adaptedParking);
      } else {
        console.error('❌ Error del servidor:', data);
        if (Platform.OS === 'web') {
          window.alert(data.error || 'Error al cargar el parqueadero');
        } else {
          Alert.alert('Error', data.error || 'Error al cargar el parqueadero');
        }
      }
    } catch (error) {
      console.error('❌ Error al cargar detalle:', error);
      if (Platform.OS === 'web') {
        window.alert('No se pudo cargar el parqueadero');
      } else {
        Alert.alert('Error', 'No se pudo cargar el parqueadero');
      }
    } finally {
      setLoading(false);
    }
  };

  const cargarVehiculos = async () => {
    try {
      const response = await fetch(`${API_URL}/vehiculos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const vehiculosArray = data.vehiculos || data;
        setVehiculos(vehiculosArray);
        if (vehiculosArray.length > 0) {
          setSelectedVehiculo(vehiculosArray[0].id);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReservar = async () => {
    if (!selectedVehiculo) {
      if (Platform.OS === 'web') {
        window.alert('Debes seleccionar un vehículo');
      } else {
        Alert.alert('Error', 'Debes seleccionar un vehículo');
      }
      return;
    }

    if (!horas || parseInt(horas) < 1) {
      if (Platform.OS === 'web') {
        window.alert('Ingresa un número válido de horas (mínimo 1)');
      } else {
        Alert.alert('Error', 'Ingresa un número válido de horas (mínimo 1)');
      }
      return;
    }

    const horasNum = parseInt(horas);
    const costoTotal = parking.tarifa_hora * horasNum;

    const confirmar = Platform.OS === 'web' 
      ? window.confirm(`¿Deseas reservar por ${horasNum} hora(s)?\n\nCosto total: $${costoTotal}`)
      : await new Promise(resolve => {
          Alert.alert(
            'Confirmar Reserva',
            `¿Deseas reservar por ${horasNum} hora(s)?\n\nCosto total: $${costoTotal}`,
            [
              { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Confirmar', onPress: () => resolve(true) },
            ]
          );
        });

    if (!confirmar) return;

    setReservando(true);
    try {
      const response = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parqueadero_id: parkingId,
          vehiculo_id: selectedVehiculo,
          duracion_horas: horasNum,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (Platform.OS === 'web') {
          window.alert(`¡Reserva Exitosa!\n\nTu reserva ha sido confirmada.\nCosto: $${costoTotal}`);
        } else {
          Alert.alert(
            '¡Reserva Exitosa!',
            `Tu reserva ha sido confirmada.\n\nCosto: $${costoTotal}`,
            [
              {
                text: 'Ver Mis Reservas',
                onPress: () => {
                  setShowReservaModal(false);
                  navigation.navigate('ReservationStack');
                },
              },
              {
                text: 'OK',
                onPress: () => setShowReservaModal(false),
              },
            ]
          );
        }
        setShowReservaModal(false);
      } else {
        if (Platform.OS === 'web') {
          window.alert(data.error || 'No se pudo crear la reserva');
        } else {
          Alert.alert('Error', data.error || 'No se pudo crear la reserva');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (Platform.OS === 'web') {
        window.alert('No se pudo procesar la reserva');
      } else {
        Alert.alert('Error', 'No se pudo procesar la reserva');
      }
    } finally {
      setReservando(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!parking) {
    return (
      <View style={styles.loadingContainer}>
        <Feather name="alert-circle" size={50} color={COLORS.error} />
        <Text style={styles.errorText}>Parqueadero no encontrado</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            cargarDetalle();
          }}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ...existing code...
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.nombre}>{parking.nombre}</Text>
          <View style={styles.disponibleBadge}>
            <Feather 
              name={parking.espacios_disponibles > 0 ? 'check-circle' : 'x-circle'} 
              size={16} 
              color={parking.espacios_disponibles > 0 ? COLORS.success : COLORS.error} 
            />
            <Text style={[
              styles.disponibleText,
              { color: parking.espacios_disponibles > 0 ? COLORS.success : COLORS.error }
            ]}>
              {parking.espacios_disponibles > 0 ? 'Disponible' : 'Lleno'}
            </Text>
          </View>
        </View>

        {/* Información */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{parking.direccion}</Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="grid" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              {parking.espacios_disponibles} de {parking.espacios_totales} espacios disponibles
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="dollar-sign" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              ${parking.tarifa_hora} por hora
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="clock" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Horario: {parking.hora_apertura} - {parking.hora_cierre}
            </Text>
          </View>
        </View>

        {/* Botón de Reservar - SIEMPRE VISIBLE */}
        <TouchableOpacity
          style={styles.reservarButton}
          onPress={() => {
            if (vehiculos.length === 0) {
              if (Platform.OS === 'web') {
                const irAVehiculos = window.confirm('Debes agregar un vehículo antes de reservar\n\n¿Ir a Mis Vehículos?');
                if (irAVehiculos) {
                  navigation.navigate('VehicleStack');
                }
              } else {
                Alert.alert(
                  'Sin vehículos',
                  'Debes agregar un vehículo antes de reservar',
                  [
                    {
                      text: 'Agregar Vehículo',
                      onPress: () => navigation.navigate('VehicleStack'),
                    },
                    { text: 'Cancelar', style: 'cancel' },
                  ]
                );
              }
            } else {
              setShowReservaModal(true);
            }
          }}
        >
          <Feather name="bookmark" size={20} color={COLORS.white} />
          <Text style={styles.reservarButtonText}>Reservar Espacio</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Reserva */}
      <Modal
        visible={showReservaModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReservaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Reserva</Text>
              <TouchableOpacity onPress={() => setShowReservaModal(false)}>
                <Feather name="x" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Selecciona tu vehículo:</Text>
            <View style={styles.vehiculosContainer}>
              {vehiculos.map((vehiculo) => (
                <TouchableOpacity
                  key={vehiculo.id}
                  style={[
                    styles.vehiculoCard,
                    selectedVehiculo === vehiculo.id && styles.vehiculoCardSelected,
                  ]}
                  onPress={() => setSelectedVehiculo(vehiculo.id)}
                >
                  <Feather 
                    name="truck" 
                    size={20} 
                    color={selectedVehiculo === vehiculo.id ? COLORS.primary : COLORS.textSecondary} 
                  />
                  <View style={styles.vehiculoInfo}>
                    <Text style={[
                      styles.vehiculoPlaca,
                      selectedVehiculo === vehiculo.id && styles.vehiculoPlacaSelected,
                    ]}>
                      {vehiculo.placa}
                    </Text>
                    <Text style={styles.vehiculoMarca}>
                      {vehiculo.marca} - {vehiculo.color}
                    </Text>
                  </View>
                  {selectedVehiculo === vehiculo.id && (
                    <Feather name="check-circle" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Duración (horas):</Text>
            <TextInput
              style={styles.input}
              value={horas}
              onChangeText={setHoras}
              keyboardType="number-pad"
              placeholder="Ejemplo: 2"
            />

            <View style={styles.resumenContainer}>
              <Text style={styles.resumenLabel}>Tarifa por hora:</Text>
              <Text style={styles.resumenValor}>${parking.tarifa_hora}</Text>
            </View>

            <View style={styles.resumenContainer}>
              <Text style={styles.resumenLabel}>Total estimado:</Text>
              <Text style={styles.resumenTotal}>
                ${(parking.tarifa_hora * (parseInt(horas) || 0)).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.confirmarButton, reservando && styles.confirmarButtonDisabled]}
              onPress={handleReservar}
              disabled={reservando}
            >
              {reservando ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Feather name="check" size={20} color={COLORS.white} />
                  <Text style={styles.confirmarButtonText}>Confirmar Reserva</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    marginTop: 15,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  // ...existing styles...
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  disponibleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disponibleText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  card: {
    backgroundColor: COLORS.white,
    marginTop: 15,
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 15,
    flex: 1,
  },
  reservarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    margin: 15,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  reservarButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 10,
  },
  vehiculosContainer: {
    marginBottom: 15,
  },
  vehiculoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 10,
  },
  vehiculoCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  vehiculoInfo: {
    flex: 1,
    marginLeft: 15,
  },
  vehiculoPlaca: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  vehiculoPlacaSelected: {
    color: COLORS.primary,
  },
  vehiculoMarca: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  resumenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resumenLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  resumenValor: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  resumenTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  confirmarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  confirmarButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  confirmarButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ParkingDetailScreen;