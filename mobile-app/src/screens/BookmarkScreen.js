import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { api } from '../services/api';

export default function BookmarkScreen() {
  const [rows, setRows] = useState([]);
  useEffect(() => { api.get('/mcq/bookmarks').then((r) => setRows(r.data)); }, []);
  return <View style={{ padding: 16 }}><FlatList data={rows} keyExtractor={(i) => i._id} renderItem={({ item }) => <Text>{item.mcq_id?.question}</Text>} /></View>;
}
