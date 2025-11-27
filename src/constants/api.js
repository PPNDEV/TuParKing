import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};

/**
 * Base URL for the backend API. Defaults to localhost but can be overridden via
 * the Expo `extra.apiUrl` field (set through EXPO_PUBLIC_API_URL when running Expo).
 */
export const API_URL = extra.apiUrl ?? 'http://localhost:3000/api';

/**
 * Helper to build URLs safely ensuring single slash separation.
 * @param {string} path e.g. "/auth/login"
 */
export const buildApiUrl = (path = '') => {
  if (!path) return API_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL.replace(/\/$/, '')}${normalizedPath}`;
};
