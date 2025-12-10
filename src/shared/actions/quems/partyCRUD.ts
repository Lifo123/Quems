'use server';

import { Partie } from '@Shared/types';
import { rtdb } from './firebase'

export async function setParty(data: Partie) {
    try {
        const {
            id, name, requests
        } = data;

        if (!id || !name) {
            throw new Error('Missing required fields (id, name)');
        }

        const partyRef = rtdb.ref(`parties/${data.id}`);
        const partySnap = await partyRef.once("value");

        if (partySnap.exists()) {
            partyRef.update({
                id, name, requests
            });
            return { status: 'success', state: true, message: 'Party updated' };
        }

        await partyRef.set({
            id, name, requests
        });

        return { status: 'success', state: true, message: 'Party created' };
    } catch (error) {
        return {
            status: 'error',
            state: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function getParty(partyId: string) {
    if (!partyId) return { status: 'error', state: false, message: 'Missing partyId' };

    try {
        const partyRef = rtdb.ref(`parties/${partyId}`);
        const partySnap = await partyRef.once("value");

        if (partySnap.exists()) {
            return {
                status: 'success',
                state: true,
                message: 'Successfully fetched party',
                data: partySnap.val()
            };
        }

        return { status: 'error', state: false, message: 'Party does not exist' };
    } catch (error) {
        return {
            status: 'error',
            state: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

