import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../services/api';

export default function TaskTypeScreen({ route, navigation }) {
  const { topic } = route.params;
  const [items, setItems] = useState([]);
  useEffect(() => { api.get(`/task-types/${topic._id}`).then((r) => setItems(r.data)); }, [topic._id]);
  return <View style={{ padding: 16 }}><Text>{topic.title}</Text><FlatList data={items} keyExtractor={(i) => i._id} renderItem={({ item }) => <TouchableOpacity onPress={() => navigation.navigate('MCQ', { taskType: item })}><Text>{item.type}</Text></TouchableOpacity>} /></View>;
}
