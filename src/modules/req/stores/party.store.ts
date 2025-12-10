import { deepMap } from "@nanostores/deepmap";

type PartyStore = {
    id: string;
    name: string;
    requests: any | null;
}

const initialState: PartyStore = {
    id: '',
    name: '',
    requests: null
};

export const $partyStore = deepMap<PartyStore>(initialState);