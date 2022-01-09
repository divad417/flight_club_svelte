import type { Member } from "$lib/models";
import type { Unsubscribe } from "@firebase/util";
import { watchMember } from "$lib/firebase";
import { userDefaults } from "$lib/models";

const userStore = (initialValue = null) => {
    let value: Member = initialValue;
    let subs = [];
    let subscribedToUser = false;
    let unsubscribe: Unsubscribe;

    const subscribe = (handler) => {
        subs = [...subs, handler];
        handler(value);
        return () => {
            subs = subs.filter(sub => sub != handler);
            if (!subs) { unsubscribe(); };
        };
    }

    const set = (newValue: Member) => {
        if (value == newValue) return;
        value = newValue;
        if (!subscribedToUser && value.id) {
            unsubscribe = watchMember(value.id, (user) => {
                if (!user) {
                    set(null);
                } else {
                    set({ ...userDefaults, ...user });
                }
            });
            subscribedToUser = true;
        } else if (subscribedToUser && !value) {
            unsubscribe();
            subscribedToUser = false;
        }
        subs.forEach(sub => sub(value))
    }

    const update = (updateFunction) => set(updateFunction(value));

    return {
        subscribe,
        set,
        update,
    }
}

export const user = userStore(null);