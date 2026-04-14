import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_KEY = 'ssmu_device_id';

export async function getOrCreateDeviceId() {
  const existing = await AsyncStorage.getItem(DEVICE_KEY);
  if (existing) return existing;
  const id = `android_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(DEVICE_KEY, id);
  return id;
}
