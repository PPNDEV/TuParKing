import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const ContactRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <Feather name={icon} size={24} color={COLORS.primary} />
    <View style={styles.textContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const ContactScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Contáctanos</Text>
        <View style={styles.card}>
          <ContactRow icon="phone" label="Teléfono de Movilidad" value="(07) 370-1860" />
          <ContactRow icon="briefcase" label="Subgerencia Administrativa" value="Ext. 104" />
          <ContactRow icon="map-pin" label="Dirección" value="San Martín y Juan Montalvo" />
          <ContactRow icon="mail" label="Correo Electrónico" value="contacto@tuparking.com" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  textContainer: { marginLeft: 15 },
  label: { fontSize: 14, color: COLORS.textSecondary },
  value: { fontSize: 16, color: COLORS.text, fontWeight: '600' },
});

export default ContactScreen;
