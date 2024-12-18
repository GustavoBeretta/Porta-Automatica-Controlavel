import { ScrollView, Text, TextInput, Button, StyleSheet, View, Alert } from 'react-native';
import React, { useState } from 'react';

const ControleScreen = () => {
  const [limiar, setLimiar] = useState('');

  const handleEnviar = async () => {
    const limiarValor = parseFloat(limiar);
    if (isNaN(limiarValor) || limiarValor < 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    try {
      const response = await fetch('http://192.168.194.137:8000/controle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limiar: limiarValor }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Registro feito com sucesso!');
      } else {
        Alert.alert('Erro', 'Erro ao fazer o registro.');
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Configure o limiar de acionamento do sensor:
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o limiar"
        keyboardType="numeric"
        value={limiar}
        onChangeText={setLimiar}
      />
      <Button title="Enviar" onPress={handleEnviar} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    width: '80%',
    fontSize: 18,
  },
});

export default ControleScreen;
