// Detect platform to decide base URL for local dev
import { Platform } from 'react-native';

const LOCAL_IP = '192.168.1.192'; // <-- replace with your machine’s LAN IP

// If on iOS simulator or web: localhost
// If on Android emulator: 10.0.2.2
// If on physical devices: use LOCAL_IP
function getDevApiBase() {
  if (Platform.OS === 'ios') return 'http://localhost:8000/api/v1';
  if (Platform.OS === 'android') return 'http://10.0.2.2:8000/api/v1';
  return `http://${LOCAL_IP}:8000/api/v1`;
}

export const ENV = {
  apiBase: __DEV__ ? getDevApiBase() : 'https://api.your-prod.com/api/v1',
  cmsBase: __DEV__ ? getDevApiBase().replace('/api/v1', '/cms') : 'https://cms.your-prod.com',
};
