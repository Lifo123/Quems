import { deepMap } from "@nanostores/deepmap";

type UIStore = {
    partyId: string;
    isAvailableToRequest: boolean;
    availableSeconds: number;

    tabs: {
        hasTabOpen: boolean;
        isSearchOpen: boolean;
        isShareOpen: boolean;
    };

    requestedSong: any | null;
}

const initialState: UIStore = {
    partyId: '',
    isAvailableToRequest: true,
    availableSeconds: 0,

    tabs: {
        hasTabOpen: false,
        isSearchOpen: false,
        isShareOpen: false
    },

    requestedSong: null
};

export const $uiStore = deepMap<UIStore>(initialState);
