import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { api } from '../services/api';
import { cacheGet, cacheSet } from '../utils/offlineCache';

export default function HomeScreen({ navigation }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data);
        await cacheSet('courses', data);
      } catch {
        const cached = await cacheGet('courses');
        setCourses(cached || []);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Courses</Text>
      <FlatList data={courses} keyExtractor={(i) => i._id} renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Subject', { course: item })}><Text>{item.title}</Text></TouchableOpacity>
      )} />
    </View>
  );
}
