import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

const Register = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [nomesFilhos, setNomesFilhos] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !nomeMae) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const auth = getAuth();
    
    try {
      // 1. Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Salva os dados na coleção 'usuarios'
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nome: nomeMae,
        email: email,
        filhos: nomesFilhos.split(',').map(n => n.trim()).filter(n => n !== ""), 
        dataCadastro: new Date().toISOString(),
      });

      Alert.alert("Bem-vinda!", "Cadastro realizado com sucesso.");
      // Se tiver navegação: navigation.navigate('Home');
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro no cadastro", "Verifique os dados ou se o e-mail já existe.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mães de Joelhos</Text>
      <Text style={styles.subtitle}>Crie sua conta para iniciar a jornada de 101 dias</Text>
      
      <TextInput 
        placeholder="Seu Nome" 
        style={styles.input} 
        onChangeText={setNomeMae} 
      />
      
      <TextInput 
        placeholder="E-mail" 
        style={styles.input} 
        onChangeText={setEmail} 
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput 
        placeholder="Senha" 
        style={styles.input} 
        onChangeText={setPassword} 
        secureTextEntry 
      />

      <TextInput 
        placeholder="Nomes dos filhos (ex: João, Maria)" 
        style={styles.input} 
        onChangeText={setNomesFilhos} 
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 30, flexGrow: 1, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#6200ee', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  button: { backgroundColor: '#6200ee', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default Register;