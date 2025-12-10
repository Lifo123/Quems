'use server';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;


export async function fetchSpotifyToken() {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error("Faltan credenciales en el servidor");
        return null;
    }

    try {
        const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basic}`
            },
            body: 'grant_type=client_credentials',
            cache: 'no-store'
        });

        if (!res.ok) throw new Error('Error en la API de Spotify');

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Server Action Error:", error);
        return null;
    }
}

export async function getSearchList(query: string, token: string) {
    if (!token || token === '' || !query) return null;

    try {
        const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist,track,album&limit=6`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error('Error en la API de Spotify');

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Server Action Error:", error);
        return null;
    }

}