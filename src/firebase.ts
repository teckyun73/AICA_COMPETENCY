import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCo_qqcYL6osQ5TClLdDHhxR1H5xwerLOs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aica-competency.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aica-competency",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aica-competency.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "591835054146",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:591835054146:web:962fb9369f92dc9d772ddb",
};

// Check if Firebase configuration keys are provided
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let dbInstance: any = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    dbInstance = getFirestore(app);
    console.log('Firebase Cloud DB connection initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
} else {
  console.warn('Firebase VITE env keys missing. Running in Local Mock Database mode.');
}

export const db = dbInstance;
export { firebaseConfig };
