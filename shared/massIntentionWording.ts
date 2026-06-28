/**
 * Mass Intention wording suggestions — pure + testable.
 *
 * Parishioners often aren't sure how to phrase a Mass intention reverently.
 * This helper turns the structured form fields (intention type + name) into a
 * few suggested one-line phrasings the requester can tap to use. It is fully
 * deterministic so it works with NO AI key (the sandbox default) and gives the
 * server an AI-polish endpoint a reliable fallback to degrade to.
 *
 * Pure: no IO, no client, no env. Safe to run on both the client (instant
 * suggestions) and the server (as the fallback under the AI endpoint).
 */

export type IntentionType = "living" | "deceased" | "thanksgiving" | "special";

export interface IntentionWordingInput {
  intentionType: IntentionType;
  /** Who/what the Mass is offered for (the form's "Mass Offered For" field). */
  intentionFor: string;
  /** The requester's name — currently unused in templates, accepted for parity with the form. */
  requesterName?: string;
}

/** Cap on suggestions returned, matching the UI chip row. */
export const MAX_INTENTION_SUGGESTIONS = 3;

/** Collapse whitespace, strip control chars, trim, and bound length. */
export function sanitizeIntentionName(raw: string): string {
  return (raw || "")
    // \s collapses newlines/tabs/control whitespace to single spaces, neutralizing
    // multi-line content before the name is embedded in a sentence or an LLM prompt.
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

/**
 * Templates per intention type. `{name}` is substituted with the sanitized
 * "Mass Offered For" value. The first entry of each list is the generic
 * (name-free) wording used when no name is provided.
 */
const TEMPLATES: Record<IntentionType, { generic: string; named: string[] }> = {
  deceased: {
    generic: "For the repose of the souls of the faithful departed.",
    named: [
      "In loving memory of {name}.",
      "For the repose of the soul of {name}.",
      "For {name}, with prayers for eternal rest.",
    ],
  },
  living: {
    generic: "For the health and intentions of all in need of prayer.",
    named: [
      "For the health and intentions of {name}.",
      "For God's continued blessings upon {name}.",
      "For the special intentions of {name}.",
    ],
  },
  thanksgiving: {
    generic: "In thanksgiving to God for blessings received.",
    named: [
      "In thanksgiving to God for {name}.",
      "In gratitude for the blessings received by {name}.",
      "A Mass of thanksgiving on behalf of {name}.",
    ],
  },
  special: {
    generic: "For a special intention known to God.",
    named: [
      "For the special intentions of {name}.",
      "For a special intention on behalf of {name}.",
      "For {name}, for a private intention known to God.",
    ],
  },
};

/**
 * Build up to {@link MAX_INTENTION_SUGGESTIONS} reverent one-line phrasings for
 * a Mass intention. Deterministic; never throws on empty/odd input.
 */
export function buildIntentionSuggestions(input: IntentionWordingInput): string[] {
  const set = TEMPLATES[input.intentionType] ?? TEMPLATES.special;
  const name = sanitizeIntentionName(input.intentionFor);

  if (!name) {
    return [set.generic];
  }

  return set.named.map((t) => t.replace("{name}", name)).slice(0, MAX_INTENTION_SUGGESTIONS);
}
