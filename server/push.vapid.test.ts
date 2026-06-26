import { describe, it, expect } from "vitest";

const hasVapidEnv = Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

describe("VAPID keys configuration", () => {
  // These two assert deployment config and only make sense when the keys are
  // actually provisioned. They self-skip in dev/CI without creds so the suite
  // stays green keyless (no env-coupled assertions in the unit suite).
  it.skipIf(!hasVapidEnv)("should have a well-formed VAPID_PUBLIC_KEY when configured", () => {
    const key = process.env.VAPID_PUBLIC_KEY!;
    expect(key.length).toBeGreaterThan(20);
    // VAPID public keys are base64url encoded
    expect(key).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it.skipIf(!hasVapidEnv)("should have a well-formed VAPID_PRIVATE_KEY when configured", () => {
    const key = process.env.VAPID_PRIVATE_KEY!;
    expect(key.length).toBeGreaterThan(20);
    expect(key).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  // Env-independent: generates a fresh keypair so the web-push integration is
  // exercised on every run, with or without provisioned creds.
  it("should accept a generated VAPID key pair in web-push", async () => {
    const webpush = await import("web-push");
    const { publicKey, privateKey } = webpush.generateVAPIDKeys();

    expect(publicKey).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(privateKey).toMatch(/^[A-Za-z0-9_-]+$/);

    // This will throw if the keys are invalid
    expect(() => {
      webpush.setVapidDetails(
        "mailto:admin@stpatricksarmonk.org",
        publicKey,
        privateKey
      );
    }).not.toThrow();
  });
});
