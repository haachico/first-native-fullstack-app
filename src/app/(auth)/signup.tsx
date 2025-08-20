import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Signup = () => {
  const [user, setUser] = useState({
    email: '',
    username: '',
    password: '',
  })


  const handleChange = (name: string, value: string) => {
    console.log(name, value);
    setUser(prev => ({ ...prev, [name]: value }));
  }

  const handleSignup = async () => {
    try {
      const response = await fetch('http://th105/todo-api/users/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();

      if(data.status === 'success') {
        // Handle successful signup, e.g., save token, redirect, etc.
        router.push('/login'); // Redirect to login page after successful signup
      }
      

    }
    catch (error) {
      console.error('Signup error:', error);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={user.email}
        onChangeText={(value) => handleChange('email', value)}
      />
      <Text>Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={user.username}
        onChangeText={(value) => handleChange('username', value)}
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={user.password}
        onChangeText={(value) => handleChange('password', value)}
      />
       
     
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { display: 'flex', height: '100%', padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
});

export default Signup;