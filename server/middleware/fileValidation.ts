/**
 * File upload validation using magic numbers (file signatures).
 * Validates file type by inspecting actual bytes, not trusting client-provided MIME type.
 *
 * Allowed types: PDF, JPEG, PNG, GIF, WebP, MP3/M4A audio
 * Max file size: 10MB (50MB for audio)
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_AUDIO_FILE_SIZE = 50 * 1024 * 1024; // 50MB — homily recordings run long

interface FileSignature {
  mimeType: string;
  extensions: string[];
  magic: number[];
  offset?: number;
}

const FILE_SIGNATURES: FileSignature[] = [
  { mimeType: "application/pdf", extensions: [".pdf"], magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { mimeType: "image/jpeg", extensions: [".jpg", ".jpeg"], magic: [0xFF, 0xD8, 0xFF] },
  { mimeType: "image/png", extensions: [".png"], magic: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  { mimeType: "image/gif", extensions: [".gif"], magic: [0x47, 0x49, 0x46, 0x38] }, // GIF8
  { mimeType: "image/webp", extensions: [".webp"], magic: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF...WEBP (partial check)
  { mimeType: "audio/mpeg", extensions: [".mp3"], magic: [0x49, 0x44, 0x33] }, // ID3 (MP3 with tags)
  { mimeType: "audio/mpeg", extensions: [".mp3"], magic: [0xFF, 0xFB] }, // MP3 frame sync (MPEG-1 Layer 3)
  { mimeType: "audio/mpeg", extensions: [".mp3"], magic: [0xFF, 0xF3] }, // MP3 frame sync (MPEG-2 Layer 3)
  { mimeType: "audio/mpeg", extensions: [".mp3"], magic: [0xFF, 0xF2] }, // MP3 frame sync (MPEG-2.5 Layer 3)
  { mimeType: "audio/mp4", extensions: [".m4a"], magic: [0x66, 0x74, 0x79, 0x70], offset: 4 }, // ...ftyp (M4A/MP4 audio)
];

const ALLOWED_MIME_TYPES = new Set(FILE_SIGNATURES.map((s) => s.mimeType));
const AUDIO_MIME_TYPES = new Set(["audio/mpeg", "audio/mp4"]);

export interface FileValidationResult {
  valid: boolean;
  detectedMimeType?: string;
  error?: string;
}

/**
 * Validate a file buffer by checking magic bytes and size.
 * Returns the detected MIME type if valid, or an error message.
 */
export function validateFileBuffer(buffer: Buffer, claimedContentType?: string): FileValidationResult {
  // Size check — audio recordings get a larger ceiling than docs/images.
  const isAudioClaim = claimedContentType ? AUDIO_MIME_TYPES.has(claimedContentType) : false;
  const sizeLimit = isAudioClaim ? MAX_AUDIO_FILE_SIZE : MAX_FILE_SIZE;
  if (buffer.length > sizeLimit) {
    return {
      valid: false,
      error: `File too large (${(buffer.length / 1024 / 1024).toFixed(1)}MB). Maximum allowed: ${sizeLimit / 1024 / 1024}MB.`,
    };
  }

  if (buffer.length < 8) {
    return { valid: false, error: "File is too small to be valid." };
  }

  // Magic number detection
  for (const sig of FILE_SIGNATURES) {
    const offset = sig.offset ?? 0;
    let matches = true;
    for (let i = 0; i < sig.magic.length; i++) {
      if (buffer[offset + i] !== sig.magic[i]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      // Special check for WebP: bytes 8-11 should be "WEBP"
      if (sig.mimeType === "image/webp") {
        if (
          buffer.length > 11 &&
          buffer[8] === 0x57 && // W
          buffer[9] === 0x45 && // E
          buffer[10] === 0x42 && // B
          buffer[11] === 0x50 // P
        ) {
          return { valid: true, detectedMimeType: sig.mimeType };
        }
        continue; // RIFF but not WEBP
      }
      return { valid: true, detectedMimeType: sig.mimeType };
    }
  }

  return {
    valid: false,
    error: `Unsupported file type. Allowed: PDF, JPEG, PNG, GIF, WebP, MP3, M4A. ${
      claimedContentType ? `(Claimed: ${claimedContentType})` : ""
    }`,
  };
}

/**
 * Validate and get the correct content type for a base64-encoded file.
 * Use this in upload routes to replace trusting the client-provided contentType.
 */
export function validateBase64File(
  base64Data: string,
  claimedContentType?: string
): FileValidationResult & { buffer?: Buffer } {
  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64Data, "base64");
  } catch {
    return { valid: false, error: "Invalid base64 data." };
  }

  const result = validateFileBuffer(buffer, claimedContentType);
  if (result.valid) {
    return { ...result, buffer };
  }
  return result;
}

/**
 * Check if a claimed MIME type is in our allowed list.
 * Use as a quick pre-check before more expensive magic byte validation.
 */
export function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has(mimeType);
}
