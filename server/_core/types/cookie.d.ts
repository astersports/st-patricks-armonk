declare module "cookie" {
  // cookie v2 renamed `parse` -> `parseCookie`. The package ships its own
  // .d.ts but its `exports` field ("./dist/index.js") omits a `types`
  // condition, so TS (moduleResolution: bundler) can't resolve the bundled
  // declarations — this ambient shim provides the types we consume.
  export function parseCookie(
    str: string,
    options?: Record<string, unknown>
  ): Record<string, string | undefined>;
}
