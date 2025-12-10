import { deepMap } from "@nanostores/deepmap";
import { newLS } from "@Shared/utils";


type SearchStore = {
    isSearching: boolean;
    status: 'idle' | 'loading' | 'success' | 'error';

    //Results
    selectedSong?: any;
    hasSelected?: boolean;
    result?: {
        artists: any
        tracks: any
        albums: any
    };
}

const initialState: SearchStore = {
    isSearching: false,
    status: 'idle'
};

export const LSsearch = newLS('spotify-search');
export const $searchStore = deepMap<SearchStore>(initialState);

export const resetStore = () => {
    $searchStore.updateKey('', initialState);
}