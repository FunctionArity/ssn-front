// The API token and, for super admins, the sede they switched to. Kept in localStorage so a reload stays signed in.
const TOKEN_KEY = "ssn.token";
const HEADQUARTER_KEY = "ssn.headquarterId";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked (private mode): the session lasts until the page reloads.
  }
}

export const storage = {
  token: () => read(TOKEN_KEY),
  setToken: (token: string | null) => write(TOKEN_KEY, token),
  headquarterId: () => read(HEADQUARTER_KEY),
  setHeadquarterId: (id: number | null) => write(HEADQUARTER_KEY, id === null ? null : String(id)),
};
