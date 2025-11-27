const appJson = require('./app.json');

/**
 * Expo configuration that allows overriding the backend API URL via
 * EXPO_PUBLIC_API_URL when running `expo start` or building the app.
 */
module.exports = () => ({
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo?.extra ?? {}),
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api',
    },
  },
});
