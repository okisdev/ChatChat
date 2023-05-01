export function setLocalStorage<T>(key: string, initialValue: T) {
    return localStorage.setItem(key, JSON.stringify(initialValue));
}
