import React, { useState, useMemo, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';

const API_URL = 'http://localhost:3000/api';

// Componente para renderizar cada fila de vehículo
const VehicleItem = ({ placa, marca, color, onDelete }) => (
  <View style={styles.itemContainer}>
    <Text style={[styles.itemText, styles.placaColumn]}>{placa}</Text>
    <Text style={[styles.itemText, styles.marcaColumn]}>{marca || '-'}</Text>
    <Text style={[styles.itemText, styles.colorColumn]}>{color || '-'}</Text>
    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <Feather name="trash-2" size={18} color={COLORS.error} />
    </TouchableOpacity>
  </View>
);

const VehicleListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  // Cargar vehículos al montar el componente
  useEffect(() => {
    cargarVehiculos();
  }, []);

  // Recargar cuando la pantalla recibe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarVehiculos();
    });
    return unsubscribe;
  }, [navigation]);

  const cargarVehiculos = async () => {
  try {
    setLoading(true);
    console.log('🚀 Cargando vehículos...');
    console.log('🚀 Token:', token);
    console.log('🚀 URL:', `${API_URL}/vehiculos`);
    
    const response = await fetch(`${API_URL}/vehiculos`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('🚀 Response status:', response.status);
    
    const data = await response.json();
    console.log('🚀 Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Error al cargar vehículos');
    }

    console.log('✅ Vehículos cargados:', data.vehiculos);
    setVehiculos(data.vehiculos);
  } catch (error) {
    console.error('❌ Error al cargar vehículos:', error);
    Alert.alert('Error', 'No se pudieron cargar los vehículos');
  } finally {
    setLoading(false);
  }
  };

  const eliminarVehiculo = async (id, placa) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar el vehículo ${placa}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/vehiculos/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar vehículo');
              }

              Alert.alert('Éxito', 'Vehículo eliminado correctamente');
              cargarVehiculos(); // Recargar lista
            } catch (error) {
              console.error('Error al eliminar vehículo:', error);
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  // Lógica de filtrado
  const filteredVehicles = useMemo(() => {
    if (!searchQuery) {
      return vehiculos;
    }
    return vehiculos.filter(vehicle =>
      vehicle.placa.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, vehiculos]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando vehículos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* --- Componente de Búsqueda --- */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ingrese una placa (ej. ABC1234)"
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Botón para agregar vehículo */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddVehicle')}
        >
          <Feather name="plus" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Agregar Vehículo</Text>
        </TouchableOpacity>

        {/* --- Tabla de Vehículos --- */}
        <View style={styles.tableContainer}>
          {/* Encabezado de la tabla */}
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, styles.placaColumn]}>PLACA</Text>
            <Text style={[styles.headerText, styles.marcaColumn]}>MARCA</Text>
            <Text style={[styles.headerText, styles.colorColumn]}>COLOR</Text>
            <Text style={[styles.headerText, styles.actionColumn]}>ACCIÓN</Text>
          </View>

          {/* Lista de vehículos */}
          <FlatList
            data={filteredVehicles}
            renderItem={({ item }) => (
              <VehicleItem 
                {...item} 
                onDelete={() => eliminarVehiculo(item.id, item.placa)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="inbox" size={50} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>No tienes vehículos registrados</Text>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={() => navigation.navigate('AddVehicle')}
                >
                  <Text style={styles.emptyButtonText}>Agregar mi primer vehículo</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 20,
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginRight: 10,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: '#F7F7F7'
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 15,
    color: COLORS.text,
  },
  placaColumn: {
    flex: 0.3,
    fontWeight: 'bold',
  },
  marcaColumn: {
    flex: 0.3,
  },
  colorColumn: {
    flex: 0.2,
  },
  actionColumn: {
    flex: 0.2,
    textAlign: 'center',
  },
  deleteButton: {
    flex: 0.2,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 15,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default VehicleListScreen;