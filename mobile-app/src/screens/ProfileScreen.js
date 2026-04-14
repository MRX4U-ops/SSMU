import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { api } from '../services/api';

export default function ProfileScreen() {
  const [sub, setSub] = useState(null);
  useEffect(() => { api.get('/user/subscription-status').then((r) => setSub(r.data)); }, []);
  return <View style={{ padding: 16 }}><Text>Subscription: {sub?.status}</Text><Text>Remaining Days: {sub?.remainingDays}</Text><Text>Expiry: {sub?.subscription_end}</Text></View>;
}
