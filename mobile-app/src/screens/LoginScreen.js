import React from 'react';
import { View, Text, Button } from 'react-native';
import { api, setToken } from '../services/api';
import { useAppStore } from '../store/useAppStore';

export default function LoginScreen({ navigation }) {
  const setSession = useAppStore((s) => s.setSession);

  const login = async () => {
    // Replace with @react-native-google-signin/google-signin in production.
    const { data } = await api.post('/auth/google-login', {
      email: 'student@ssmu.edu',
      name: 'SSMU Student',
      google_id: 'google-oauth-sub-id'
    });
    setSession(data.token, data.user);
    setToken(data.token);
    navigation.replace('Home');
  };

  return <View style={{ padding: 16 }}><Text>SSMU MCQs</Text><Button title="Continue with Google" onPress={login} /></View>;
}
