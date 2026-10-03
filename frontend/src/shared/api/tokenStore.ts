export let currentAccessToken: string | null = null;
export const setAccessToken = (token: string | null) => { currentAccessToken = token; };
