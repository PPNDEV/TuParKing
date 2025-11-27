import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import AuthTextInput from '../../components/common/AuthTextInput';
import AuthButton from '../../components/common/AuthButton';
import { API_URL } from '../../constants/api';

const AddVehicleScreen = ({ navigation }) => {
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [color, setColor] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleAddVehicle = async () => {
    if (!placa) {
      Alert.alert('Error', 'La placa es obligatoria');
      return;
    }

    console.log('🚀 Token:', token);
    console.log('🚀 Datos:', { placa, marca, color });

    setLoading(true);

    try {
      console.log('🚀 Enviando petición a:', `${API_URL}/vehiculos`);
      
      const response = await fetch(`${API_URL}/vehiculos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ placa, marca, color }),
      });

      console.log('🚀 Response status:', response.status);
      
      const data = await response.json();
      console.log('🚀 Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar vehículo');
      }

      Alert.alert('Éxito', 'Vehículo agregado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      console.error('❌ Error al agregar vehículo:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Agregar Vehículo</Text>
        <Text style={styles.subtitle}>Ingresa los datos de tu vehículo</Text>

        <AuthTextInput
          icon="hash"
          placeholder="Placa *"
          value={placa}
          onChangeText={(text) => setPlaca(text.toUpperCase())}
          autoCapitalize="characters"
          maxLength={10}
        />

        <AuthTextInput
          icon="truck"
          placeholder="Marca (opcional)"
          value={marca}
          onChangeText={setMarca}
        />

        <AuthTextInput
          icon="droplet"
          placeholder="Color (opcional)"
          value={color}
          onChangeText={setColor}
        />

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <AuthButton title="Agregar Vehículo" onPress={handleAddVehicle} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 30,
  },
  loader: {
    marginVertical: 20,
  },
});

export default AddVehicleScreen;