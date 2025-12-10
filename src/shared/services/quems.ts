import { setParty, connect, getParty, requestSong } from "@Shared/actions/quems";
import { newLS } from "@Shared/utils";
import { $uiStore as UI } from "@Modules/req/stores";

export const LSquems = newLS('quems');
export const quemsAPI = {
    connect,
    setParty,
    getParty,
    requestSong,
    blockRequest
}

function blockRequest(ms: number) {
    let remainingSeconds = Math.ceil(ms / 1000);

    UI.updateKey('', {
        isAvailableToRequest: false,
        availableSeconds: remainingSeconds
    });

    const interval = setInterval(() => {
        remainingSeconds -= 1;
        UI.updateKey('availableSeconds', remainingSeconds);
    }, 1000);

    setTimeout(() => {
        clearInterval(interval);

        UI.updateKey('', {
            isAvailableToRequest: true,
            availableSeconds: 0
        });
    }, ms);
}