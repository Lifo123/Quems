import {
    getSearchList as search,
    fetchSpotifyToken
} from '@Shared/actions/spotify';
import { newLS } from '@Shared/utils';

export const LStoken = newLS('spotify-token');
export const LSsearch = newLS('spotify-search');

export async function getToken(): Promise<string> {
    const cache = LStoken.get();
    const currentTime = new Date().getTime();

    if (cache && cache.expires_at > (currentTime + 60000)) {
        return cache.access_token;
    }

    const data = await fetchSpotifyToken();

    if (data && data.access_token) {
        const newToken = {
            ...data,
            expires_at: currentTime + (data.expires_in * 1000)
        };

        LStoken.set(newToken);
        return data.access_token;
    }

    return '';
}

export const spotify = {
    search, getToken
}