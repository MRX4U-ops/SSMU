import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CourseScreen from '../screens/CourseScreen';
import SubjectScreen from '../screens/SubjectScreen';
import ModuleScreen from '../screens/ModuleScreen';
import TopicScreen from '../screens/TopicScreen';
import TaskTypeScreen from '../screens/TaskTypeScreen';
import MCQScreen from '../screens/MCQScreen';
import ResultScreen from '../screens/ResultScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Course" component={CourseScreen} />
      <Stack.Screen name="Subject" component={SubjectScreen} />
      <Stack.Screen name="Module" component={ModuleScreen} />
      <Stack.Screen name="Topic" component={TopicScreen} />
      <Stack.Screen name="TaskType" component={TaskTypeScreen} />
      <Stack.Screen name="MCQ" component={MCQScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Bookmarks" component={BookmarkScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
