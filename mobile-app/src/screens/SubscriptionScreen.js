import React from 'react';
import { Button, Text, View } from 'react-native';
import { api } from '../services/api';

export default function SubscriptionScreen() {
  const pay = async () => {
    const { data } = await api.post('/payment/create-order', { currency: 'INR' });
    await api.post('/payment/verify', { order_id: data.order_id, payment_id: `simulated_${Date.now()}`, signature: 'SIMULATED_OK' });
  };
  return <View style={{ padding: 16 }}><Text>INR 49 for 90 days</Text><Button title="Pay with UPI" onPress={pay} /></View>;
}
