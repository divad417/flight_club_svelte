import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
    enableIndexedDbPersistence, getFirestore, collection,
    query, where, orderBy, limit, getDocs
} from 'firebase/firestore';

// Firebase initialization

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

// Database setup

enableIndexedDbPersistence(db)
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log(err.code)
        } else if (err.code == 'unimplemented') {
            console.log(err.code)
        }
    });

const itemLimit = 1000;
const beersRef = collection(db, 'beers')
const sessionsRef = collection(db, 'sessions')
const usersRef = collection(db, 'users')

// Beer functions

export async function getBeers(sortKey: string, ascending: boolean) {
    const beers = [];
    const beerQuery = query(
        beersRef,
        orderBy(sortKey, ascending ? 'asc' : 'desc'),
        limit(itemLimit));
    const querySnapshot = await getDocs(beerQuery);
    querySnapshot.forEach((doc) => {
        beers.push({ ...doc.data(), id: doc.id })
    });
    return beers;
}

export async function getSessionBeers(sortKey: string, ascending: boolean, session: string) {
    const beers = [];
    const beerQuery = query(
        beersRef,
        where('session', '==', session),
        orderBy(sortKey, ascending ? 'asc' : 'desc'),
        limit(itemLimit)
    );
    const querySnapshot = await getDocs(beerQuery);
    querySnapshot.forEach((doc) => {
        beers.push({ ...doc.data(), id: doc.id })
    });
    return beers;
}

export async function getUserBeers(sortKey: string, ascending: boolean, user: string) {
    const beers = [];
    const beerQuery = query(
        beersRef,
        orderBy(sortKey, ascending ? 'asc' : 'desc'),
        limit(itemLimit),
        where('user', '==', user));
    const querySnapshot = await getDocs(beerQuery);
    querySnapshot.forEach((doc) => {
        beers.push({ ...doc.data(), id: doc.id })
    });
    return beers;
}

// User functions

export async function getUserId(name: string) {
    const userQuery = query(usersRef, where('name', '==', name))
    const queryResults = await getDocs(userQuery)
    if (queryResults.empty) {
        throw new Error(`Member ${name} does not exist!`)
    }
    return queryResults.docs[0].ref.id
}

// Session functions

export async function getSessionId(number: number) {
    const sessionQuery = query(sessionsRef, where('number', '==', number))
    const queryResults = await getDocs(sessionQuery)
    if (queryResults.empty) {
        throw new Error(`Session ${number} does not exist!`)
    }
    return queryResults.docs[0].ref.id
}
