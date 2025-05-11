import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBFzQm03U2IA2RLy5z9x9NcA671kabJ7X8",
  authDomain: "ivm-ea63c.firebaseapp.com",
  projectId: "ivm-ea63c",
  storageBucket: "ivm-ea63c.firebasestorage.app",
  messagingSenderId: "367540527491",
  appId: "1:367540527491:web:b797f63a5513285ea316b6",
  measurementId: "G-JKZXM0JHV1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 