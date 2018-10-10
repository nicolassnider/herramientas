const TOKEN_KEY = 'token_key';
const USER_KEY = 'user_key';
const CONFIG_KEY = 'config_key';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
}

export function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getConfig() {
    return JSON.parse(localStorage.getItem(CONFIG_KEY));
}

export function setConfig(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}
