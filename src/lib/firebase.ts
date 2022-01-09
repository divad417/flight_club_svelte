import type { Beer, Session, Member } from '$lib/models';
import type { Unsubscribe } from '@firebase/util';

export let currentUser: () => Member | null;
export let login: () => void;
export let logout: () => void;
export let watchAuthState: (onChange: (member: Member) => void) => Unsubscribe;

export let newSessionId: () => string;
export let getSessionId: (id: number) => Promise<string>;
export let updateSession: (session: Session) => Promise<void>;
export let deleteSession: (id: string) => Promise<void>;
export let watchSession: (id: string, onChange: (session: any) => void) => Unsubscribe;
export let watchSessions: (onChange: (sessions: any[]) => void) => Unsubscribe;

export let newBeerId: () => string;
export let updateBeer: (beer: Beer) => Promise<void>;
export let deleteBeer: (id: string) => Promise<void>;
export let watchBeers: (onChange: (beers: any[]) => void) => Unsubscribe;

export let getMemberId: (member: string) => Promise<string>;
export let updateMember: (member: Member) => Promise<void>;
export let watchMember: (id: string, onChange: (member: any) => void) => Unsubscribe;
export let watchMembers: (onChange: (members: any[]) => void) => Unsubscribe;

export let uploadPhotos: (sessionId: string, files: FileList) => Promise<void>;
export let deletePhotos: (sessionId: string) => Promise<void>;

const firebaseConfig = {
  apiKey: 'AIzaSyAOzCtQq2cKSTi7RXgy1tuSJgPxY2jKs8Q',
  authDomain: 'dgang-flight-club.firebaseapp.com',
  projectId: 'dgang-flight-club',
  storageBucket: 'dgang-flight-club.appspot.com',
  messagingSenderId: '34180351223',
  appId: '1:34180351223:web:df3852031092f57f333ff2'
};

// Convert the Google user format to our database format
const userFromGoogleUser = (googleUser: any): Member => {
  return {
    id: googleUser.uid,
    full_name: googleUser.displayName,
    email: googleUser.email,
    photoURL: googleUser.photoURL,
    notes: []
  };
}

// Hack to prevent svelte from running firebase code on the server, see https://github.com/sveltejs/kit/issues/1650

import { initializeApp } from '@firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from '@firebase/auth';
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
  arrayUnion,
  onSnapshot
} from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, list, deleteObject } from '@firebase/storage';


// Firebase initialization
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// Database setup - enable local caching

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.log(err.code);
    } else if (err.code == 'unimplemented') {
      console.log(err.code);
    }
  });

// Auth functions

currentUser = () =>  auth.currentUser ? userFromGoogleUser(auth.currentUser) : null;
login = () => { signInWithPopup(auth, provider); }
logout = () => { signOut(auth); }

watchAuthState = (onChange) => {
  return auth.onAuthStateChanged((googleUser) => {
    if (googleUser) {
      // Add or update the user to our database on login
      const user = userFromGoogleUser(googleUser);
      onChange(user);
      updateMember(user);
    } else {
      onChange(null);
    }
  });
}

// Session functions

newSessionId = () => {
  const sessionRef = doc(collection(db, 'sessions'));
  return sessionRef.id;
}

getSessionId = async (number) => {
  const sessionQuery = query(collection(db, 'sessions'), where('number', '==', number));
  const queryResults = await getDocs(sessionQuery);
  if (queryResults.empty) {
    throw new Error(`Session ${number} does not exist!`);
  }
  return queryResults.docs[0].ref.id;
}

updateSession = async (session) => {
  const sessionRef = doc(db, 'sessions', session.id);
  await setDoc(sessionRef, session, { merge: true });
}

deleteSession = async (id) => {
  const sessionRef = doc(db, 'sessions', id);
  await deletePhotos(id);
  await deleteDoc(sessionRef);
}

watchSession = (id, onChange) => {
  return onSnapshot(doc(db, 'sessions', id), (snapshot) => {
    const session = snapshot.data();
    session.id = snapshot.id;
    onChange(session);
  });
}

watchSessions = (onChange) => {
  return onSnapshot(collection(db, 'sessions'), (snapshot) => {
    const sessions = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    onChange(sessions);
  });
}

// Beer functions

newBeerId = () => {
  const newBeerRef = doc(collection(db, 'beers'));
  return newBeerRef.id;
}

updateBeer = async (beer) => {
  const beerRef = doc(db, 'beers', beer.id);
  await setDoc(beerRef, beer, { merge: true });
}

deleteBeer = async (id) => {
  const beerRef = doc(db, 'beers', id);
  deleteDoc(beerRef);
}

watchBeers = (onChange) => {
  return onSnapshot(collection(db, 'beers'), (snapshot) => {
    const beers = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    onChange(beers);
  });
}

// Member functions

getMemberId = async (name) => {
  const memberQuery = query(collection(db, 'users'), where('name', '==', name));
  const queryResults = await getDocs(memberQuery);
  if (queryResults.empty) {
    throw new Error(`Member ${name} does not exist!`);
  }
  return queryResults.docs[0].ref.id;
}

updateMember = async (member) => {
  const memberRef = doc(db, 'users', member.id);
  await setDoc(memberRef, member, { merge: true });
}

watchMember = (id, onChange) => {
  return onSnapshot(doc(db, 'users', id), (snapshot) => {
    const member = snapshot.data();
    member.id = snapshot.id;
    onChange(member);
  });
}

watchMembers = (onChange) => {
  return onSnapshot(collection(db, 'users'), (snapshot) => {
    const members = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    onChange(members);
  });
}

// Photo functions

uploadPhotos = async (sessionId, files) => {
  const sessionRef = doc(db, 'sessions', sessionId);
  for (const file of files) {
    const storageRef = ref(storage, sessionId + '/' + file.name);
    await uploadBytes(storageRef, file);
    const storageURL = await getDownloadURL(storageRef);
    updateDoc(sessionRef, { photos: arrayUnion(storageURL) });
  }
}

deletePhotos = async (sessionId) => {
  const storageRef = ref(storage, sessionId);
  const allPhotos = await list(storageRef);
  for (const photoRef of allPhotos.items) {
    await deleteObject(photoRef);
  }
  const sessionRef = doc(db, 'sessions', sessionId);
  await setDoc(sessionRef, { photos: [] }, { merge: true });
}

