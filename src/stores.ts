import { writable } from 'svelte/store';
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const beers = writable([], () => { console.log('subsribe to beers!'); return () => { console.log('unsubscribe to beers'); unsubscribe() } });

const unsubscribe = onSnapshot(collection(db, 'beers'), (beerSnapshot) => {
    beers.set(beerSnapshot.docs.map((doc) => { return { ...doc.data(), id: doc.id }; }
    ))
});

export default beers;
