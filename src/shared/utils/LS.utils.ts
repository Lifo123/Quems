import { getPath, setPath } from "@nanostores/deepmap";

function isObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

export function newLS(key: string) {
    const isServer = typeof window === 'undefined';
    function safeJSONParse(value: string | null) {
        if (!value) return null;
        try {
            return JSON.parse(value);
        } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
            return null; // O devuelve un objeto vacío {} si prefieres
        }
    }

    function getKey(path: string) {
        if (isServer) return null;

        let storedValue = localStorage.getItem(key);
        let parsedValue = safeJSONParse(storedValue);

        if (path === '') return parsedValue;
        if (!parsedValue) return null;

        return getPath(path, parsedValue);
    }

    function setKey(path: string, value: any) {
        if (isServer) return;

        if (path === '' && value === undefined) {
            removeKey('');
            return;
        }

        let storedValue = localStorage.getItem(key) || '{}';
        let parsedValue = safeJSONParse(storedValue) || {};

        const res = path === ''
            ? value
            : setPath(path, value, parsedValue);

        localStorage.setItem(key, JSON.stringify(res));
    }

    function updateKey(path: string, value: any) {
        if (isServer) return;
        if (path === '' && value === undefined) {
            removeKey('');
            return;
        };

        let storedValue = localStorage.getItem(key);
        let parsedValue = safeJSONParse(storedValue) || {};

        const currentValue = path === '' ? parsedValue : getPath(path, parsedValue);

        let newValue = value;

        if (isObject(currentValue) && isObject(value)) {
            newValue = { ...currentValue, ...value };
        } else if (Array.isArray(currentValue) && Array.isArray(value)) {
            newValue = [...currentValue, ...value];
        }

        const res = path === ''
            ? newValue
            : setPath(path, newValue, parsedValue);

        localStorage.setItem(key, JSON.stringify(res));
    }

    function removeKey(path: string) {
        if (isServer) return;

        if (path === '') {
            localStorage.removeItem(key);
            return;
        }

        let storedValue = localStorage.getItem(key);
        if (!storedValue) return;

        let parsedValue = safeJSONParse(storedValue);
        if (!parsedValue) return;

        const res = setPath(path, undefined, parsedValue);
        localStorage.setItem(key, JSON.stringify(res));
    }

    return {
        getKey,
        setKey,
        updateKey,
        removeKey,
        get: () => getKey(''),
        set: (value: any) => setKey('', value),
        update: (value: any) => updateKey('', value),
        remove: () => removeKey('')
    }

}