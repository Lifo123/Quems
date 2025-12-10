import 'server-only';
import admin from 'firebase-admin';

const PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const DATABASE_URL = process.env.FIREBASE_DATABASE_URL;

function formatPrivateKey(key: string | undefined) {
    if (!key) return undefined;
    return key.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
    if (!PRIVATE_KEY || !PROJECT_ID || !CLIENT_EMAIL) {
        throw new Error('❌ Error crítico: Faltan credenciales de Firebase en el .env');
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: PROJECT_ID,
                clientEmail: CLIENT_EMAIL,
                privateKey: formatPrivateKey(PRIVATE_KEY),
            }),

            databaseURL: DATABASE_URL
        });
        
    } catch (error) {
        console.error("Error:", error);
    }
}

const db = admin.firestore();
const rtdb = admin.database();

export { admin, db, rtdb };