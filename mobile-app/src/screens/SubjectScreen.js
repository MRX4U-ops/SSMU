import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../services/api';

export default function SubjectScreen({ route, navigation }) {
  const { course } = route.params;
  const [items, setItems] = useState([]);
  useEffect(() => { api.get(`/subjects/${course._id}`).then((r) => setItems(r.data)); }, [course._id]);
  return <View style={{ padding: 16 }}><Text>{course.title}</Text><FlatList data={items} keyExtractor={(i) => i._id} renderItem={({ item }) => <TouchableOpacity onPress={() => navigation.navigate('Module', { subject: item })}><Text>{item.title}</Text></TouchableOpacity>} /></View>;
}
