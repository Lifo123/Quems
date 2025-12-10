'use server';

import { admin } from './firebase';

export async function connect() {
    try {
        //If admin ref exists, then the connection is established
        if (admin) return { message: 'Connection established', status: 'success', state: true };
    } catch (error) {
        return { status: 'error', state: false, message: `Error: ${error}` };
    }
}