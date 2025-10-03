import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../../constants/colors';
import AuthTextInput from '../../components/common/AuthTextInput';
import AuthButton from '../../components/common/AuthButton';
import { transferBalance } from '../../services/transferService';

const TransferScreen = ({ navigation }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleTransfer = async () => {
    const transferAmount = parseFloat(amount);
    if (!recipientEmail) {
      Alert.alert('Correo Requerido', 'Por favor, ingrese el correo del destinatario.');
      return;
    }
    if (!transferAmount || transferAmount <= 0) {
      Alert.alert('Monto Inválido', 'Por favor, ingrese un monto mayor a cero.');
      return;
    }
    if (transferAmount > currentBalance) {
      Alert.alert('Saldo Insuficiente', `No puedes transferir más de tu saldo actual de $${currentBalance.toFixed(2)}.`);
      return;
    }

    Alert.alert( "Confirmar Transferencia", `¿Estás seguro de que deseas transferir $${transferAmount.toFixed(2)} a ${recipientEmail}?`, [ { text: "Cancelar", style: "cancel" }, { text: "Confirmar", onPress: async () => { setIsLoading(true); try { const response = await transferBalance(recipientEmail, transferAmount); Alert.alert('Éxito', response.message, [ { text: 'OK', onPress: () => navigation.goBack() } ]); } catch (error) { Alert.alert('Error en la Transferencia', error.message || 'Ocurrió un problema inesperado.'); } finally { setIsLoading(false); } } } ] );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <Text style={styles.balanceText}>Saldo Disponible: ${currentBalance.toFixed(2)}</Text>
        <View style={styles.formContainer}>
          <AuthTextInput icon="mail" placeholder="Ingrese el correo del usuario" keyboardType="email-address" autoCapitalize="none" value={recipientEmail} onChangeText={setRecipientEmail} />
          <Text style={styles.amountLabel}>Monto a transferir:</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput style={styles.amountInput} value={amount} onChangeText={handleAmountChange} keyboardType="numeric" placeholder="0.00" placeholderTextColor={COLORS.lightGray} />
          </View>
        </View>
        <View style={styles.footer}>
          <AuthButton title="Transferir" onPress={handleTransfer} loading={isLoading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 25 },
  balanceText: { textAlign: 'right', fontSize: 16, fontWeight: 'bold', color: COLORS.secondary, marginBottom: 20 },
  formContainer: { backgroundColor: COLORS.white, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: COLORS.lightGray },
  amountLabel: { fontSize: 16, color: COLORS.text, marginTop: 20, marginBottom: 10, paddingHorizontal: 5 },
  amountInputContainer: { flexDirection: 'row', alignItems: 'center', height: 60, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray, paddingHorizontal: 5 },
  dollarSign: { fontSize: 24, color: COLORS.textSecondary, marginRight: 5 },
  amountInput: { flex: 1, height: '100%', fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  footer: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 },
});

export default TransferScreen;