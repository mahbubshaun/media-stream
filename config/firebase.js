import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// add firebase config
// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID
// };
const firebaseConfig = {
  apiKey: "AIzaSyCw-G6uAFQREjTlk2-e0K_eHotmOMFxLfg",
  authDomain: "mediastream-8008f.firebaseapp.com",
  projectId: "mediastream-8008f",
  storageBucket: "mediastream-8008f.appspot.com",
  messagingSenderId: "87070643840",
  appId: "1:87070643840:web:2ef0aab96fca19a750b865",
  measurementId: "G-2HG38FSNJ7"
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
