import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../services/api';

export default function TopicScreen({ route, navigation }) {
  const { module } = route.params;
  const [items, setItems] = useState([]);
  useEffect(() => { api.get(`/topics/${module._id}`).then((r) => setItems(r.data)); }, [module._id]);
  return <View style={{ padding: 16 }}><Text>{module.title}</Text><FlatList data={items} keyExtractor={(i) => i._id} renderItem={({ item }) => <TouchableOpacity onPress={() => navigation.navigate('TaskType', { topic: item })}><Text>{item.title}</Text></TouchableOpacity>} /></View>;
}
