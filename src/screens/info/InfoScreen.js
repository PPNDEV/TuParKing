import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { COLORS } from '../../constants/colors';

const InfoScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={styles.logo} 
        />
        <Text style={styles.title}>TuParKing App</Text>
        <Text style={styles.text}>Versión 1.0.0</Text>
        <Text style={styles.text}>© 2025 TuParKing. Todos los derechos reservados.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  text: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center' },
});

export default InfoScreen;
