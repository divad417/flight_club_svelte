import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  enableIndexedDbPersistence,
  getFirestore,
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, list, deleteObject } from 'firebase/storage';

import type { beer, session, user } from '$lib/models';

// Firebase initialization

const firebaseConfig = {
  apiKey: 'AIzaSyAOzCtQq2cKSTi7RXgy1tuSJgPxY2jKs8Q',
  authDomain: 'dgang-flight-club.firebaseapp.com',
  projectId: 'dgang-flight-club',
  storageBucket: 'dgang-flight-club.appspot.com',
  messagingSenderId: '34180351223',
  appId: '1:34180351223:web:df3852031092f57f333ff2'
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
export const provider = new GoogleAuthProvider();

// Database setup

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.log(err.code);
  } else if (err.code == 'unimplemented') {
    console.log(err.code);
  }
});

// Session functions

export function newSessionId() {
  const sessionRef = doc(collection(db, 'sessions'));
  return sessionRef.id;
}

export async function getSessionId(number: number) {
  const sessionQuery = query(collection(db, 'sessions'), where('number', '==', number));
  const queryResults = await getDocs(sessionQuery);
  if (queryResults.empty) {
    throw new Error(`Session ${number} does not exist!`);
  }
  return queryResults.docs[0].ref.id;
}

export async function updateSession(session: session) {
  const sessionRef = doc(db, 'sessions', session.id);
  await setDoc(sessionRef, session, { merge: true });
}

export function deleteSession(id: string) {
  const sessionRef = doc(db, 'sessions', id);
  deleteDoc(sessionRef);
  deletePhotos(id);
}

// Beer functions

export function newBeerId() {
  const newBeerRef = doc(collection(db, 'beers'));
  return newBeerRef.id;
}

export async function updateBeer(beer: beer) {
  const beerRef = doc(db, 'beers', beer.id);
  await setDoc(beerRef, beer, { merge: true });
}

export function deleteBeer(id: string) {
  const beerRef = doc(db, 'beers', id);
  deleteDoc(beerRef);
}

// User functions

export async function getUserId(name: string) {
  const userQuery = query(collection(db, 'users'), where('name', '==', name));
  const queryResults = await getDocs(userQuery);
  if (queryResults.empty) {
    throw new Error(`Member ${name} does not exist!`);
  }
  return queryResults.docs[0].ref.id;
}

export async function updateUser(user: user) {
  const userRef = doc(db, 'users', user.id);
  await setDoc(userRef, user, { merge: true });
}

// Photo functions

export async function uploadPhotos(sessionId: string, files: FileList) {
  const sessionRef = doc(db, 'sessions', sessionId);
  for (const file of files) {
    const storageRef = ref(storage, sessionId + '/' + file.name);
    await uploadBytes(storageRef, file);
    const storageURL = await getDownloadURL(storageRef);
    updateDoc(sessionRef, { photos: arrayUnion(storageURL) });
  }
}

export async function deletePhotos(sessionId: string) {
  const storageRef = ref(storage, sessionId);
  const allPhotos = await list(storageRef);
  for (const photoRef of allPhotos.items) {
    await deleteObject(photoRef);
  }
  const sessionRef = doc(db, 'sessions', sessionId);
  setDoc(sessionRef, { photos: [] }, { merge: true });
}
