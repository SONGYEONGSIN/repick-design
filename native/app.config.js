// Extends app.json. baseUrl is only applied when EXPO_PUBLIC_BASE_URL is set (the gallery build),
// so the native evolve-gate export (no env) stays at the root and is unaffected.
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...(config.experiments || {}),
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL || undefined,
  },
});
