import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// Datos de ejemplo
const FAQ_DATA = [
  { id: '1', question: '¿Cómo recargo saldo?', answer: 'Puedes recargar saldo desde la pantalla principal, en la opción "Recargas", utilizando una tarjeta de crédito o débito.' },
  { id: '2', question: '¿Cómo registro un parqueo?', answer: 'En el menú principal, selecciona "Nuevo Registro", ingresa la placa de tu vehículo y el tiempo deseado.' },
  { id: '3', question: '¿Es seguro ingresar mis datos?', answer: 'Sí, toda tu información está protegida con los más altos estándares de seguridad.' },
];

// Componente reutilizable para cada pregunta
const AccordionItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.questionContainer} onPress={() => setExpanded(!expanded)}>
        <Text style={styles.questionText}>{question}</Text>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.primary} />
      </TouchableOpacity>
      {expanded && <Text style={styles.answerText}>{answer}</Text>}
    </View>
  );
};

const FAQScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={FAQ_DATA}
        renderItem={({ item }) => <AccordionItem {...item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<Text style={styles.title}>Preguntas Frecuentes</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  listContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  itemContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
  },
  answerText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default FAQScreen;
