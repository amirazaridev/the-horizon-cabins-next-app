import "server-only";
const API_URL = process.env.API_URL;

export async function apiFetch(endpoint: string, options?: RequestInit) {
  return fetch(API_URL + endpoint, {
    ...options,
  });
}
