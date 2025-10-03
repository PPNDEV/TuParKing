import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../../constants/colors';
import { Feather } from '@expo/vector-icons';

const PaymentScreen = ({ route, navigation }) => {
  const { amount } = route.params;

  const WebPaymentPlaceholder = () => (
    <View style={styles.webContainer}>
      <Feather name="credit-card" size={60} color={COLORS.primary} />
      <Text style={styles.webTitle}>Simulación de Pasarela de Pago</Text>
      <Text style={styles.webSubtitle}>Monto a Pagar: ${amount.toFixed(2)}</Text>
      <Text style={styles.webText}>En una aplicación real, serías redirigido a la pasarela de pago externa.</Text>
      <TouchableOpacity style={styles.webButton} onPress={() => navigation.goBack()}>
        <Text style={styles.webButtonText}>Simular Pago Exitoso y Volver</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Conectando con la pasarela de pago...</Text>
    </View>
  );

  if (Platform.OS === 'web') {
    return <WebPaymentPlaceholder />;
  }

  const paymentUrl = 'https://www.google.com';
  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView source={{ uri: paymentUrl }} startInLoadingState={true} renderLoading={renderLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  loadingContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loadingText: { marginTop: 10, fontSize: 16, color: COLORS.textSecondary },
  webContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, padding: 20 },
  webTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginTop: 20, marginBottom: 10 },
  webSubtitle: { fontSize: 18, color: COLORS.secondary, fontWeight: '600', marginBottom: 20 },
  webText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 40 },
  webButton: { backgroundColor: COLORS.primary, paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12 },
  webButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});

export default PaymentScreen;