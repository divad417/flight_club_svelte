import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAOzCtQq2cKSTi7RXgy1tuSJgPxY2jKs8Q",
    authDomain: "dgang-flight-club.firebaseapp.com",
    projectId: "dgang-flight-club",
    storageBucket: "dgang-flight-club.appspot.com",
    messagingSenderId: "34180351223",
    appId: "1:34180351223:web:df3852031092f57f333ff2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

