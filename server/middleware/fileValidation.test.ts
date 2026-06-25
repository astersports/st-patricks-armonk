import { describe, expect, it } from "vitest";
import { validateFileBuffer } from "./fileValidation";

// Locks the audit fix: the larger audio size ceiling must be keyed on the
// DETECTED signature, not the claimed content type — otherwise a client claims
// audio/mpeg to slip a 50MB non-audio file past the 10MB doc/image cap.

function withMagic(magic: number[], totalBytes: number): Buffer {
  const buf = Buffer.alloc(Math.max(totalBytes, magic.length));
  for (let i = 0; i < magic.length; i++) buf[i] = magic[i];
  return buf;
}

const ID3 = [0x49, 0x44, 0x33]; // MP3 with tags
const PDF = [0x25, 0x50, 0x44, 0x46]; // %PDF

describe("validateFileBuffer — size ceiling by detected type", () => {
  it("accepts an audio file under the 50MB audio ceiling", () => {
    const r = validateFileBuffer(withMagic(ID3, 20 * 1024 * 1024), "audio/mpeg");
    expect(r.valid).toBe(true);
    expect(r.detectedMimeType).toBe("audio/mpeg");
  });

  it("LOCK: rejects an >10MB non-audio file even when audio is claimed", () => {
    // Detected as PDF → 10MB cap applies despite the audio/mpeg claim.
    const r = validateFileBuffer(withMagic(PDF, 11 * 1024 * 1024), "audio/mpeg");
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/too large/i);
  });

  it("accepts a small PDF under the 10MB doc ceiling", () => {
    const r = validateFileBuffer(withMagic(PDF, 1024), "application/pdf");
    expect(r.valid).toBe(true);
    expect(r.detectedMimeType).toBe("application/pdf");
  });

  it("rejects audio over the 50MB ceiling", () => {
    const r = validateFileBuffer(withMagic(ID3, 51 * 1024 * 1024), "audio/mpeg");
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/too large/i);
  });
});
