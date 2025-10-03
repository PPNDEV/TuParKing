import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const PARKING_RECORDS = [
  { id: '1', placa: 'GSM4780', startTime: new Date('2025-10-02T21:30:00'), endTime: new Date('2025-10-02T22:30:00'), duration: 60, status: 'active' },
  { id: '2', placa: 'PBA-1234', startTime: new Date('2025-10-02T20:15:00'), endTime: new Date('2025-10-02T20:45:00'), duration: 30, status: 'expired' },
  { id: '3', placa: 'GSN3780', startTime: new Date('2025-10-01T10:27:00'), endTime: new Date('2025-10-01T11:57:00'), duration: 90, status: 'expired' },
  { id: '4', placa: 'ABC-0987', startTime: new Date('2025-10-02T22:00:00'), endTime: new Date('2025-10-03T00:00:00'), duration: 120, status: 'active' },
].sort((a, b) => (a.status === 'active' ? -1 : 1));

const StatusBadge = ({ status }) => {
  const isActive = status === 'active';
  const color = isActive ? '#2E7D32' : COLORS.textSecondary;
  const text = isActive ? 'Activo' : 'Finalizado';

  return (
    <View style={styles.statusBadge}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={[styles.statusText, { color }]}>{text}</Text>
    </View>
  );
};

const ParkingRecordItem = ({ item }) => {
  const date = item.startTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeRange = `${item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${item.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <View style={styles.itemContainer}>
      <StatusBadge status={item.status} />
      <View style={styles.infoWrapper}>
        <Text style={styles.placaText}>{item.placa}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.timeText}>{timeRange}</Text>
        </View>
        <Text style={styles.durationText}>{item.duration} min</Text>
      </View>
    </View>
  );
};

const MyParkingsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={PARKING_RECORDS}
          renderItem={({ item }) => <ParkingRecordItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 10 }}
          ListHeaderComponent={ <View style={styles.header}> <Feather name="list" size={24} color={COLORS.textSecondary} /> <Text style={styles.headerText}>Historial de parqueos</Text> </View> }
          ListEmptyComponent={ <Text style={styles.emptyText}>No tienes parqueos registrados.</Text> }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 15 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 5 },
  headerText: { fontSize: 16, color: COLORS.textSecondary, marginLeft: 10 },
  itemContainer: { backgroundColor: COLORS.white, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: COLORS.lightGray, overflow: 'hidden' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 15, backgroundColor: '#F7F7F7', borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  infoWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  placaText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, flex: 0.3 },
  detailsContainer: { flex: 0.5, alignItems: 'center' },
  dateText: { fontSize: 14, color: COLORS.text },
  timeText: { fontSize: 12, color: COLORS.textSecondary },
  durationText: { fontSize: 15, fontWeight: '600', color: COLORS.secondary, flex: 0.2, textAlign: 'right' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: COLORS.textSecondary },
});

export default MyParkingsScreen;