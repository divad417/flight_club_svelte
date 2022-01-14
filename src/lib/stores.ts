import type { Member, Club } from "$lib/models";
import type { Unsubscribe } from "@firebase/util";
import type { Unsubscriber, Writable, Readable } from "svelte/store";
import { writable } from "svelte/store";
import { watchMember, watchClubs } from "$lib/firebase";
import { userDefaults } from "$lib/models";

function userStore(): Writable<Member> {
    let value: Member = null;
    let subs = [];
    let subscribedToUser = false;
    let unsubscribe: Unsubscribe;

    const subscribe = (handler: (value: Member) => void) => {
        subs = [...subs, handler];
        handler(value);
        return () => {
            subs = subs.filter(sub => sub != handler);
            if (!subs) { unsubscribe(); };
        };
    }

    const set = (userUpdate: Member) => {
        if (value == userUpdate) return;
        if (!userUpdate) {
            // Logout
            value = null;
        } else {
            // Always populate the defaults in the user object when logged in
            value = { ...userDefaults, ...userUpdate };
            activeClub.set(value.clubs[0])
        }

        if (!subscribedToUser && value.id) {
            // On first login, subscribe to changes on the firebase user document
            unsubscribe = watchMember(value.id, (update) => {
                set(update)
            });
            subscribedToUser = true;
        } else if (!value && subscribedToUser) {
            // Unsubscribe on logout
            unsubscribe();
            subscribedToUser = false;
        }

        subs.forEach(sub => sub(value))
    }

    const update = (updateFunction: (value: Member) => Member) => set(updateFunction(value));

    return {
        subscribe,
        set,
        update,
    }
}

function clubsStore(userStore: Writable<Member>): Readable<Club[]> {
    let value: Club[] = [];
    let subs = [];
    let user: Member = null;

    let subscribedToUser = false;
    let unsubscribeUser: Unsubscriber;
    let unsubscribeClubs = () => undefined;

    const subscribe = (handler: (value: Club[]) => void) => {
        subs = [...subs, handler];
        if (!subscribedToUser && subs) {
            // Setup the watchers when first subscribed
            unsubscribeUser = userStore.subscribe((userUpdate) => {
                user = userUpdate;
                unsubscribeClubs();
                if (user && user.clubs.length) {
                    unsubscribeClubs = watchClubs(user.clubs, (clubsUpdate) => {
                        value = clubsUpdate;
                        subs.forEach(sub => sub(value));
                    });
                }
            });
        }
        handler(value);
        return () => {
            subs = subs.filter(sub => sub != handler);
            if (!subs) {
                // Teardown when no one watching anymore
                unsubscribeClubs();
                unsubscribeUser();
                subscribedToUser = false;
            };
        };
    }

    return {
        subscribe,
    }
}

function activeClubStore(clubs: Readable<Club[]>) {
    let value: Club;
    let subs = [];
    let clubList: Club[] = [];
    let activeId: string = null;

    const subscribe = (handler: (value: Club) => void) => {
        subs = [...subs, handler];
        handler(value);
        return () => {
            subs = subs.filter(sub => sub != handler);
        }
    }

    const set = (id: string) => {
        activeId = id;
        value = clubList.find(club => club.id == activeId);
        subs.forEach(sub => sub(value))
    }

    const update = (updateFunction: (value: Club) => string) => set(updateFunction(value));


    clubs.subscribe((updatedClubs) => {
        clubList = updatedClubs;
        set(activeId);
    })

    return {
        subscribe,
        set,
        update
    }
}

export const user = userStore();
export const clubs = clubsStore(user);
export const activeClub = activeClubStore(clubs);
