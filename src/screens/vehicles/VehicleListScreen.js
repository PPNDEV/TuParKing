import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// Datos de ejemplo. Esto vendrá de tu API en el futuro.
const USER_VEHICLES = [
  { id: '1', placa: 'PBA-1234', marca: 'Chevrolet', color: 'Rojo' },
  { id: '2', placa: 'GSD-5678', marca: 'Kia', color: 'Blanco' },
  { id: '3', placa: 'ABC-0987', marca: 'Hyundai', color: 'Gris' },
  { id: '4', placa: 'PCH-5555', marca: 'Nissan', color: 'Negro' },
  { id: '5', placa: 'LBA-1122', marca: 'Toyota', color: 'Azul' },
];

// Componente para renderizar cada fila de vehículo
const VehicleItem = ({ placa, marca, color }) => (
  <View style={styles.itemContainer}>
    <Text style={[styles.itemText, styles.placaColumn]}>{placa}</Text>
    <Text style={[styles.itemText, styles.marcaColumn]}>{marca}</Text>
    <Text style={[styles.itemText, styles.colorColumn]}>{color}</Text>
  </View>
);

const VehicleListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Lógica de filtrado (se ejecuta solo cuando cambia la búsqueda o la lista de vehículos)
  const filteredVehicles = useMemo(() => {
    if (!searchQuery) {
      return USER_VEHICLES;
    }
    return USER_VEHICLES.filter(vehicle =>
      vehicle.placa.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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

        {/* --- Tabla de Vehículos --- */}
        <View style={styles.tableContainer}>
          {/* Encabezado de la tabla */}
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, styles.placaColumn]}>PLACA</Text>
            <Text style={[styles.headerText, styles.marcaColumn]}>MARCA</Text>
            <Text style={[styles.headerText, styles.colorColumn]}>COLOR</Text>
          </View>

          {/* Lista de vehículos */}
          <FlatList
            data={filteredVehicles}
            renderItem={({ item }) => <VehicleItem {...item} />}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No se encontraron vehículos.</Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// ... Estilos abajo
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 25,
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
  tableContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden', // Importante para que los bordes redondeados se apliquen a la lista
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
  },
  itemText: {
    fontSize: 15,
    color: COLORS.text,
  },
  placaColumn: {
    flex: 0.4,
    fontWeight: 'bold',
  },
  marcaColumn: {
    flex: 0.4,
  },
  colorColumn: {
    flex: 0.2,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});


export default VehicleListScreen;
