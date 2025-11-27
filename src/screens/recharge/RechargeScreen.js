import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import AuthButton from '../../components/common/AuthButton';
import { API_URL } from '../../constants/api';

// Opciones de monto predefinidas
const MONTOS_PREDEFINIDOS = [5, 10, 20, 50, 100];

// Métodos de pago disponibles
const METODOS_PAGO = [
  { id: 'tarjeta', nombre: 'Tarjeta de Crédito/Débito', icon: 'credit-card' },
  { id: 'transferencia', nombre: 'Transferencia Bancaria', icon: 'trending-up' },
  { id: 'efectivo', nombre: 'Efectivo', icon: 'dollar-sign' }
];

const RechargeScreen = ({ navigation }) => {
  const [monto, setMonto] = useState('');
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('tarjeta');
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleMontoPredef = (valor) => {
    setMonto(valor.toString());
  };

  const handleRecargar = async () => {
    const montoNumerico = parseFloat(monto);

    console.log('🔍 DEBUG - handleRecargar ejecutado');
    console.log('💰 Monto:', montoNumerico);
    console.log('💳 Método:', metodoSeleccionado);
    console.log('🔑 Token:', token ? 'OK' : 'NO HAY TOKEN');

    if (!monto || isNaN(montoNumerico) || montoNumerico <= 0) {
      if (Platform.OS === 'web') {
        window.alert('Error: Ingresa un monto válido');
      }
      return;
    }

    if (!metodoSeleccionado) {
      if (Platform.OS === 'web') {
        window.alert('Error: Selecciona un método de pago');
      }
      return;
    }

    const metodoNombre = METODOS_PAGO.find(m => m.id === metodoSeleccionado)?.nombre;
    const confirmar = Platform.OS === 'web' 
      ? window.confirm(`¿Deseas recargar $${montoNumerico.toFixed(2)} mediante ${metodoNombre}?`)
      : true;

    if (!confirmar) {
      console.log('❌ Usuario canceló la recarga');
      return;
    }

    console.log('✅ Usuario confirmó la recarga');
    try {
      setLoading(true);

      const body = {
        monto: montoNumerico,
        metodo_pago: metodoSeleccionado
      };

      console.log('📤 Enviando:', body);

      const response = await fetch(`${API_URL}/transacciones/recarga`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log('📥 Respuesta:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al recargar saldo');
      }

      if (Platform.OS === 'web') {
        window.alert(`¡Éxito!\n\nTu recarga de $${montoNumerico.toFixed(2)} ha sido procesada.\n\nNuevo saldo: $${data.nuevo_saldo}`);
        setMonto('');
        setMetodoSeleccionado('tarjeta');
        navigation.goBack();
      }

    } catch (error) {
      console.error('❌ Error al recargar:', error);
      if (Platform.OS === 'web') {
        window.alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Header - MÁS COMPACTO */}
        <View style={styles.header}>
          <Feather name="credit-card" size={40} color={COLORS.primary} />
          <Text style={styles.title}>Recargar Saldo</Text>
        </View>

        {/* Montos predefinidos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monto</Text>
          <View style={styles.montosContainer}>
            {MONTOS_PREDEFINIDOS.map((valor) => (
              <TouchableOpacity
                key={valor}
                style={[
                  styles.montoButton,
                  monto === valor.toString() && styles.montoButtonActive
                ]}
                onPress={() => handleMontoPredef(valor)}
              >
                <Text style={[
                  styles.montoButtonText,
                  monto === valor.toString() && styles.montoButtonTextActive
                ]}>
                  ${valor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Monto personalizado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monto personalizado</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="decimal-pad"
              value={monto}
              onChangeText={setMonto}
            />
          </View>
        </View>

        {/* Métodos de pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de pago</Text>
          {METODOS_PAGO.map((metodo) => (
            <TouchableOpacity
              key={metodo.id}
              style={[
                styles.metodoItem,
                metodoSeleccionado === metodo.id && styles.metodoItemActive
              ]}
              onPress={() => setMetodoSeleccionado(metodo.id)}
            >
              <View style={styles.metodoLeft}>
                <View style={[
                  styles.iconContainer,
                  metodoSeleccionado === metodo.id && styles.iconContainerActive
                ]}>
                  <Feather 
                    name={metodo.icon} 
                    size={18} 
                    color={metodoSeleccionado === metodo.id ? COLORS.white : COLORS.primary} 
                  />
                </View>
                <Text style={[
                  styles.metodoNombre,
                  metodoSeleccionado === metodo.id && styles.metodoNombreActive
                ]}>
                  {metodo.nombre}
                </Text>
              </View>
              {metodoSeleccionado === metodo.id && (
                <Feather name="check-circle" size={18} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Resumen */}
        {monto && parseFloat(monto) > 0 && (
          <View style={styles.resumenContainer}>
            <Text style={styles.resumenLabel}>Total:</Text>
            <Text style={styles.resumenMonto}>${parseFloat(monto).toFixed(2)}</Text>
          </View>
        )}

        {/* Botón de recarga */}
        <View style={styles.buttonContainer}>
          <AuthButton 
            title={loading ? 'Procesando...' : 'Recargar Ahora'} 
            onPress={handleRecargar}
            disabled={loading || !monto || parseFloat(monto) <= 0}
          />
        </View>

        {/* Nota informativa */}
        <View style={styles.noteContainer}>
          <Feather name="info" size={14} color={COLORS.info} />
          <Text style={styles.noteText}>
            Tu saldo estará disponible de inmediato.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  container: { 
    flex: 1 
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 10,
  },
  section: {
    padding: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  montosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  montoButton: {
    width: '30%',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  montoButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  montoButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  montoButtonTextActive: {
    color: COLORS.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  metodoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  metodoItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  metodoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconContainerActive: {
    backgroundColor: COLORS.primary,
  },
  metodoNombre: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  metodoNombreActive: {
    fontWeight: '600',
  },
  resumenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.success + '20',
    padding: 15,
    marginHorizontal: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  resumenLabel: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '600',
  },
  resumenMonto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info + '10',
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 15,
    borderRadius: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.info,
    marginLeft: 8,
  },
});

export default RechargeScreen;