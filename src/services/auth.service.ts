/**
 * Zero-Trust In-Memory Authentication Service
 * Strictly holds short-lived Viewer JWTs in memory.
 * NEVER persists tokens in localStorage, sessionStorage, or IndexedDB.
 */

let inMemoryViewerJwt: string | null = null;

export const authService = {
  getViewerToken: (): string | null => inMemoryViewerJwt,
  setViewerToken: (token: string | null): void => {
    inMemoryViewerJwt = token;
  },
  clearViewerToken: (): void => {
    inMemoryViewerJwt = null;
  }
};
