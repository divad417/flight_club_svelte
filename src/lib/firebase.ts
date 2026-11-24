import type { Beer, Session, Member, Club, MemberFromGoogle } from '#lib/models.js';
import type { Unsubscribe } from '@firebase/util';
import type { User } from '@firebase/auth';
import { userDefaults } from '#lib/models.js';
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
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  documentId,
  type DocumentData,
  type FirestoreDataConverter
} from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, list, deleteObject } from '@firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSy...Ks8Q',
  authDomain: 'dgang-flight-club.firebaseapp.com',
  projectId: 'dgang-flight-club',
  storageBucket: 'dgang-flight-club.appspot.com',
  messagingSenderId: '34180351223',
  appId: '1:34180351223:web:df3852031092f57f333ff2'
};



// Firebase initialization
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firebase v12: typed reads flow from the reference's app-model type
// (withConverter). The converter adds the document id, mirroring the
// previous inline `{ ...doc.data(), id: doc.id }` mapping.
const sessionConverter: FirestoreDataConverter<Session, DocumentData> = {
  toFirestore: (session) => ({ ...session }),
  fromFirestore: (snapshot) => ({ ...snapshot.data(), id: snapshot.id }) as Session,
};
const beerConverter: FirestoreDataConverter<Beer, DocumentData> = {
  toFirestore: (beer) => ({ ...beer }),
  fromFirestore: (snapshot) => ({ ...snapshot.data(), id: snapshot.id }) as Beer,
};
const memberConverter: FirestoreDataConverter<Member, DocumentData> = {
  toFirestore: (member) => ({ ...member }),
  fromFirestore: (snapshot) => ({ ...snapshot.data(), id: snapshot.id }) as Member,
};
const clubConverter: FirestoreDataConverter<Club, DocumentData> = {
  toFirestore: (club) => ({ ...club }),
  fromFirestore: (snapshot) => ({ ...snapshot.data(), id: snapshot.id }) as Club,
};
const sessionsRef = collection(db, 'sessions').withConverter<Session, DocumentData>(sessionConverter);
const beersRef = collection(db, 'beers').withConverter<Beer, DocumentData>(beerConverter);
const usersRef = collection(db, 'users').withConverter<Member, DocumentData>(memberConverter);
const clubsRef = collection(db, 'clubs').withConverter<Club, DocumentData>(clubConverter);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// Database setup - enable local caching (browser only: no IndexedDB during
// SSR/prerender)
if (typeof indexedDB !== 'undefined') {
  enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.log(err.code);
    } else if (err.code == 'unimplemented') {
      console.log(err.code);
    }
  });
}

// Auth functions

export const login: () => void = () => { signInWithPopup(auth, provider); }
export const logout: () => void = () => { signOut(auth); }

// Convert the Google user format to our database format
const userFromGoogleUser = (googleUser: User): MemberFromGoogle => {
  return {
    id: googleUser.uid,
    full_name: googleUser.displayName,
    email: googleUser.email,
    photoURL: googleUser.photoURL
  }
}

export const watchAuthState: (setUser: (member: Member) => void) => Unsubscribe = (setUser) => {
  return auth.onAuthStateChanged(async (googleUser) => {
    if (googleUser) {
      // Add or update the user to our database on login
      const user = userFromGoogleUser(googleUser) as Member;
      setUser(user); // Populates the ID in the user store, allowing it to subscribe to the firestore user
      await updateMember(user); // Updates the firestore user with any changes from the google user, creating a new user if necessary
      updateMemberDefaults(user.id); // Populate any defaults for new users or model updates to firebase
    } else {
      setUser(null);
    }
  });
}

// Session functions

export const newSessionId: () => string = () => {
  const sessionRef = doc(collection(db, 'sessions'));
  return sessionRef.id;
}

export const getSessionId: (club: string, id: number) => Promise<string> = async (club, number) => {
  const sessionQuery = query(collection(db, 'sessions'), where('number', '==', number), where('club', '==', club));
  const queryResults = await getDocs(sessionQuery);
  if (queryResults.empty) {
    throw new Error(`Session ${number} does not exist!`);
  }
  return queryResults.docs[0].ref.id;
}

export const updateSession: (session: Session) => Promise<void> = async (session) => {
  const sessionRef = doc(db, 'sessions', session.id);
  await setDoc(sessionRef, session, { merge: true });
}

export const deleteSession: (id: string) => Promise<void> = async (id) => {
  const sessionRef = doc(db, 'sessions', id);
  await deletePhotos(id);
  await deleteDoc(sessionRef);
}

export const watchSession: (id: string, onChange: (session: Session) => void) => Unsubscribe = (id, onChange) => {
  return onSnapshot(doc(sessionsRef, id), (snapshot) => {
    const session = snapshot.data();
    if (session) {
      onChange(session);
    }
  });
}

export const watchSessions: (club: string, onChange: (sessions: Session[]) => void) => Unsubscribe = (club, onChange) => {
  const sessionsQuery = query(sessionsRef, where('club', '==', club));
  return onSnapshot(sessionsQuery, (snapshot) => {
    onChange(snapshot.docs.map((d) => d.data()));
  });
}

export const findSession: (club: string, number: number) => Promise<string | false> = async (club, number) => {
  const sessionQuery = query(collection(db, 'sessions'),
    where('club', '==', club),
    where('number', '==', number));
  const result = await getDocs(sessionQuery);
  if (!result.empty) {
    return result.docs[0].id;
  } else {
    return false;
  }
}

// Beer functions

export const newBeerId: () => string = () => {
  const newBeerRef = doc(collection(db, 'beers'));
  return newBeerRef.id;
}

export const updateBeer: (beer: Beer) => Promise<void> = async (beer) => {
  const beerRef = doc(db, 'beers', beer.id);
  await setDoc(beerRef, beer, { merge: true });
}

export const deleteBeer: (id: string) => Promise<void> = async (id) => {
  const beerRef = doc(db, 'beers', id);
  deleteDoc(beerRef);
}

export const watchBeers: (club: string, onChange: (beers: Beer[]) => void) => Unsubscribe = (club, onChange) => {
  const beersQuery = query(beersRef, where('club', '==', club));
  return onSnapshot(beersQuery, (snapshot) => {
    onChange(snapshot.docs.map((d) => d.data()));
  });
}

// Member functions

export const getMemberId: (member: string) => Promise<string> = async (name) => {
  const memberQuery = query(collection(db, 'users'), where('name', '==', name));
  const queryResults = await getDocs(memberQuery);
  if (queryResults.empty) {
    throw new Error(`Member ${name} does not exist!`);
  }
  return queryResults.docs[0].ref.id;
}

export const updateMember: (member: Member) => Promise<void> = async (member) => {
  const memberRef = doc(db, 'users', member.id);
  await setDoc(memberRef, member, { merge: true });
}

const updateMemberDefaults: (memberId: string) => Promise<void> = async (memberId) => {
  // Update the firestore document with all defaults without overwiting existing data
  // Would be nice if there was a firebase function to do this directly 
  const memberRef = doc(db, 'users', memberId);
  const memberDoc = await getDoc(memberRef);
  const memberData = memberDoc.data();
  const update = { ...userDefaults, ...memberData };
  if (!update.name) {
    // If empty, set the name to the Google user's first name
    update.name = memberData.full_name.split(' ')[0];
  }
  await setDoc(memberRef, update, { merge: true });
}

export const watchMember: (id: string, onChange: (member: Member) => void) => Unsubscribe = (id, onChange) => {
  return onSnapshot(doc(usersRef, id), (snapshot) => {
    const member = snapshot.data();
    if (member) {
      onChange(member);
    }
  });
}

export const watchMembers: (club: Club, onChange: (members: Member[]) => void) => Unsubscribe = (club, onChange) => {
  const membersQuery = query(usersRef, where('clubs', 'array-contains', club.id));
  return onSnapshot(membersQuery, (snapshot) => {
    onChange(snapshot.docs.map((d) => d.data()));
  });
}

// Club functions

export const joinClub: (user: string, club: Club) => Promise<void> = async (user, club) => {
  const userRef = doc(db, 'users', user);
  await updateDoc(userRef, { clubs: arrayUnion(club.id) });
}

export const leaveClub: (user: string, club: Club) => Promise<void> = async (user, club) => {
  const userRef = doc(db, 'users', user);
  await updateDoc(userRef, { clubs: arrayRemove(club.id) });
}

export const updateClub: (club: Club) => Promise<void> = async (club) => {
  const clubRef = doc(db, 'clubs', club.id);
  await setDoc(clubRef, club, { merge: true });
}

export const watchClub: (id: string, onChange: (club: Club) => void) => Unsubscribe = (id, onChange) => {
  return onSnapshot(doc(clubsRef, id), (snapshot) => {
    const club = snapshot.data();
    if (club) {
      onChange(club);
    }
  });
}

export const watchClubs: (ids: string[], onChange: (clubs: Club[]) => void) => Unsubscribe = (ids, onChange) => {
  const clubsQuery = query(clubsRef, where(documentId(), 'in', ids));
  return onSnapshot(clubsQuery, (snapshot) => {
    onChange(snapshot.docs.map((d) => d.data()));
  });
}

export const watchAllClubs: (onChange: (clubs: Club[]) => void) => Unsubscribe = (onChange) => {
  return onSnapshot(clubsRef, (snapshot) => {
    onChange(snapshot.docs.map((d) => d.data()));
  });
}

// Photo functions

export const uploadPhotos: (sessionId: string, files: FileList) => Promise<void> = async (sessionId, files) => {
  const sessionRef = doc(db, 'sessions', sessionId);
  for (const file of files) {
    const storageRef = ref(storage, sessionId + '/' + file.name);
    await uploadBytes(storageRef, file);
    const storageURL = await getDownloadURL(storageRef);
    updateDoc(sessionRef, { photos: arrayUnion(storageURL) });
  }
}

export const deletePhotos: (sessionId: string) => Promise<void> = async (sessionId) => {
  const storageRef = ref(storage, sessionId);
  const allPhotos = await list(storageRef);
  for (const photoRef of allPhotos.items) {
    await deleteObject(photoRef);
  }
  const sessionRef = doc(db, 'sessions', sessionId);
  await setDoc(sessionRef, { photos: [] }, { merge: true });
}
