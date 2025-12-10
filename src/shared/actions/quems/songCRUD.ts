'use server';

import { rtdb } from './firebase'

export async function requestSong(partyId: string, data: any) {
    if (!partyId) return { status: 'error', state: false, message: 'Missing partyId' };
    if (!data || !data.id) return { status: 'error', state: false, message: 'Missing required fields (id) in data' };

    try {
        const songRef = rtdb.ref(`parties/${partyId}/requests/${data.id}`);
        const songSnap = await songRef.once("value");

        const song = songSnap.val();

        if (songSnap.exists()) {
            songRef.update({
                ...data,
                popularity: (song?.popularity || 0) + 1,
            });

            return { status: 'success', state: true, message: 'Song updated' };
        }

        await songRef.set({
            ...data,
            popularity: 1
        });

        return { status: 'success', state: true, message: 'Successfully requested song' };
    } catch (error) {
        return {
            status: 'error',
            state: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function rateSong(partyId: string, id: string, state: boolean) {
    if (!partyId) return { status: 'error', state: false, message: 'Missing partyId' };
}