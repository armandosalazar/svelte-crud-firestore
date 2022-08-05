import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBIGz5F8WoR-edTwwMkHc3BddnrY9fdaXA',
  authDomain: 'svelt-crud-a886e.firebaseapp.com',
  projectId: 'svelt-crud-a886e',
  storageBucket: 'svelt-crud-a886e.appspot.com',
  messagingSenderId: '146328342090',
  appId: '1:146328342090:web:375a205c5bbbcbdab8e0b3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);