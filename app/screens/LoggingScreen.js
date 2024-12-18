import { ScrollView, Text, StyleSheet, View, Alert, Button } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';

const LoggingScreen = () => {
  const [registros, setRegistros] = useState([]);

  const fetchRegistros = useCallback(async () => {
    try {
      const response = await fetch('http://192.168.0.160:8000/logging');
      if (response.ok) {
        const data = await response.json();
        setRegistros(data);
      } else {
        Alert.alert('Erro', 'Erro ao obter os registros.');
      }
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  }, []);

  useEffect(() => {
    fetchRegistros();
  }, [fetchRegistros]);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Atualizar" onPress={fetchRegistros} />
      <ScrollView contentContainerStyle={styles.container}>
        {registros.slice().reverse().map((registro, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardText}>Data/Hora: {registro.datahora}</Text>
            <Text style={styles.cardText}>Limiar: {registro.limiar}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default LoggingScreen;
