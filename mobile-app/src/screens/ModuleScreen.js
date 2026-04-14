import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../services/api';

export default function ModuleScreen({ route, navigation }) {
  const { subject } = route.params;
  const [items, setItems] = useState([]);
  useEffect(() => { api.get(`/modules/${subject._id}`).then((r) => setItems(r.data)); }, [subject._id]);
  return <View style={{ padding: 16 }}><Text>{subject.title}</Text><FlatList data={items} keyExtractor={(i) => i._id} renderItem={({ item }) => <TouchableOpacity onPress={() => navigation.navigate('Topic', { module: item })}><Text>{item.title}</Text></TouchableOpacity>} /></View>;
}
