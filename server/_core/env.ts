export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY ?? "",
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY ?? "",
};

// Fail fast at boot in production if the secrets that gate auth + data access
// are missing. A blank JWT_SECRET silently disables session signing integrity;
// a blank DATABASE_URL leaves every query returning empty. Crashing loudly at
// boot is safer than serving an insecure/empty app.
if (ENV.isProduction) {
  const missing: string[] = [];
  if (!ENV.cookieSecret) missing.push("JWT_SECRET");
  if (!ENV.databaseUrl) missing.push("DATABASE_URL");
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s) in production: ${missing.join(", ")}`
    );
  }
}
