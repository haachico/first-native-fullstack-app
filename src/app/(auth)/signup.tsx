import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Signup = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <Text>Email:</Text>
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      <Text>Username:</Text>
      <TextInput style={styles.input} placeholder="Username" />
      <Text>Password:</Text>
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <Button title="Signup" onPress={() => { /* handle signup */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { display: 'flex', height: '100%', padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
});

export default Signup;