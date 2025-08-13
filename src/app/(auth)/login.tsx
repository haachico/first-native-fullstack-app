import { useTask } from '@/context/TaskContext';
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';



const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {token, setToken} = useTask(); // Assuming you have a context to manage auth state

  const { setuser } = useTask(); // Function to fetch tasks after login
  const handleSubmit = async () => {

   try {

    const response = await fetch('http://192.168.0.104/todo-api/users/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }
    const data = await response.json();
    
    console.log('Login response:', data);

   if(data.status === 'success') {
    console.log('Login successful:', data);
    setuser(data.user.username); // Assuming the response contains user data
     AsyncStorage.setItem('token', data.token);
    setToken(data.token); // Assuming the response contains a token
    // Handle successful login, e.g., save token, redirect, etc.
    // fetchTasks(); // Fetch tasks for this user


   }

    console.log('Login successful:', data);
   } catch (error) {
     console.error('Login error:', error);
   }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {/* <Text>Email:</Text>
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" /> */}
      <Text>Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleSubmit } />
      <View>
        <Text style={styles.footerText}>Don't have an account? Sign up!</Text>
        <Button title="Sign Up" onPress={() => router.push('/signup')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { display: 'flex', height: '100%', padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Login;