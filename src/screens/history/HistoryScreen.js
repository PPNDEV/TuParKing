import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const TRANSACTION_HISTORY = [
  { id: '1', type: 'parking', description: 'Parqueo - PBA-1234', amount: -2.50, date: new Date('2025-10-02T21:30:00') },
  { id: '2', type: 'recharge', description: 'Recarga con tarjeta', amount: 20.00, date: new Date('2025-10-02T19:45:00') },
  { id: '3', type: 'parking', description: 'Parqueo - GSD-5678', amount: -1.00, date: new Date('2025-10-01T14:10:00') },
].sort((a, b) => b.date - a.date);

const TransactionItem = ({ item }) => {
  const isIncome = item.type === 'recharge';
  const amountColor = isIncome ? '#2E7D32' : COLORS.text;
  const iconName = isIncome ? 'arrow-up-circle' : 'arrow-down-circle';
  const sign = isIncome ? '+' : '-';
  const formattedAmount = Math.abs(item.amount).toFixed(2);
  const date = item.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  const time = item.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <Feather name={iconName} size={30} color={amountColor} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.descriptionText}>{item.description}</Text>
        <Text style={styles.dateText}>{`${date} a las ${time}`}</Text>
      </View>
      <Text style={[styles.amountText, { color: amountColor }]}>{`${sign}$${formattedAmount}`}</Text>
    </View>
  );
};

const HistoryScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={TRANSACTION_HISTORY}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<Text style={styles.title}>Historial de Movimientos</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes transacciones registradas.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  listContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: COLORS.lightGray },
  iconContainer: { marginRight: 15 },
  detailsContainer: { flex: 1 },
  descriptionText: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  dateText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  amountText: { fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: COLORS.textSecondary },
});

export default HistoryScreen;