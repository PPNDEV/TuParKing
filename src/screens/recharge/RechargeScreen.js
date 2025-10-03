import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import AuthButton from '../../components/common/AuthButton';

const RechargeScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const currentBalance = 15.75;

  const handleAmountChange = (text) => {
    let formattedText = text.replace(/[^0-9.,]/g, '');
    formattedText = formattedText.replace(',', '.');
    const parts = formattedText.split('.');
    if (parts.length > 2) formattedText = parts[0] + '.' + parts.slice(1).join('');
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      formattedText = parts.join('.');
    }
    setAmount(formattedText);
  };

  const handleProceedToPayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Monto Inválido', 'Por favor, ingrese un monto mayor a cero.');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Términos y Condiciones', 'Debe aceptar los términos y condiciones para continuar.');
      return;
    }

    const warningMessage = "Por favor, mantenga abierta la aplicación hasta que esta finalice. El cerrar la aplicación antes de que termine el proceso podría ocasionar problemas.";

    if (Platform.OS === 'web') {
      const userConfirmed = window.confirm(`ATENCIÓN\n\n${warningMessage}`);
      if (userConfirmed) {
        navigation.navigate('Payment', { amount: parseFloat(amount) });
      }
    } else {
      Alert.alert( "ATENCIÓN", warningMessage, [ { text: "Cancelar", style: "cancel" }, { text: "Continuar", onPress: () => navigation.navigate('Payment', { amount: parseFloat(amount) }) } ] );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <Text style={styles.balanceLabel}>Saldo Disponible:</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceAmount}>${currentBalance.toFixed(2)}</Text>
        </View>
        <Text style={styles.amountLabel}>Monto a recargar:</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput style={styles.amountInput} value={amount} onChangeText={handleAmountChange} keyboardType="numeric" placeholder="0.00" placeholderTextColor={COLORS.lightGray} />
        </View>
        <TouchableOpacity style={styles.termsContainer} onPress={() => setTermsAccepted(!termsAccepted)}>
          <View style={[styles.checkbox, termsAccepted && styles.checkboxAccepted]}>
            {termsAccepted && <Feather name="check" size={18} color={COLORS.white} />}
          </View>
          <Text style={styles.termsText}>Acepto los Términos & Condiciones</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <AuthButton title="Proceder a pagar" onPress={handleProceedToPayment} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 25 },
  balanceLabel: { fontSize: 18, color: COLORS.textSecondary, textAlign: 'center' },
  balanceContainer: { paddingVertical: 15, paddingHorizontal: 30, backgroundColor: COLORS.white, borderRadius: 12, alignSelf: 'center', marginVertical: 10, borderWidth: 1, borderColor: COLORS.lightGray },
  balanceAmount: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary },
  amountLabel: { fontSize: 16, color: COLORS.text, marginTop: 30, marginBottom: 10 },
  amountInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.lightGray, paddingHorizontal: 15 },
  dollarSign: { fontSize: 24, color: COLORS.textSecondary, marginRight: 5 },
  amountInput: { flex: 1, height: 60, fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  termsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkboxAccepted: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  termsText: { fontSize: 14, color: COLORS.textSecondary },
  footer: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 },
});

export default RechargeScreen;