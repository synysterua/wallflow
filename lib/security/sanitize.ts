const LIMITS = {
  author_name: 80,
  author_title: 120,
  content: 600,
} as const;

function stripHtml(raw: string): string {
  // Remove all HTML tags, then collapse whitespace
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeName(raw: string): string {
  return stripHtml(raw).slice(0, LIMITS.author_name);
}

export function sanitizeTitle(raw: string): string {
  return stripHtml(raw).slice(0, LIMITS.author_title);
}

export function sanitizeContent(raw: string): string {
  return stripHtml(raw).slice(0, LIMITS.content);
}

export function sanitizeAvatarUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}
