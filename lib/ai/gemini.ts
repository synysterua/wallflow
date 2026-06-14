const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "";

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 512,
          // Disable "thinking" so the token budget yields the JSON answer
          // directly (gemini-2.5-flash thinks by default and would otherwise
          // burn the budget before emitting output).
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return "";

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch {
    return "";
  }
}

function stripCodeFences(text: string): string {
  return text.replace(/```(?:json)?\n?/g, "").trim();
}

export async function scoreTestimonial(
  content: string,
  authorName: string
): Promise<{ score: number; flags: string[] }> {
  const prompt = `You are a testimonial quality scorer. Analyze this testimonial and return ONLY valid JSON, no prose, no markdown:
{ "score": <int 0-100>, "flags": [<string>] }
score: 0=spam/fake, 100=genuine detailed testimonial.
flags: array of issues found, empty if none.
Possible flags: "too_short", "generic", "spam", "offensive", "promotional", "irrelevant".
Author: ${authorName}
Content: ${content}`;

  const raw = await callGemini(prompt);
  if (!raw) return { score: 50, flags: [] };

  try {
    const parsed = JSON.parse(stripCodeFences(raw)) as {
      score?: unknown;
      flags?: unknown;
    };
    const score =
      typeof parsed.score === "number"
        ? Math.max(0, Math.min(100, Math.round(parsed.score)))
        : 50;
    const flags = Array.isArray(parsed.flags)
      ? (parsed.flags as unknown[]).filter((f): f is string => typeof f === "string")
      : [];
    return { score, flags };
  } catch {
    return { score: 50, flags: [] };
  }
}

export async function analyzeTestimonials(
  testimonials: Array<{ content: string; rating: number | null }>
): Promise<{ themes: string[]; sentiment: number; oneliner: string }> {
  const FALLBACK = { themes: [], sentiment: 0, oneliner: "" };
  if (testimonials.length === 0) return FALLBACK;

  const sample = testimonials.slice(0, 30);
  const prompt = `Analyze these customer testimonials and return ONLY valid JSON:
{ "themes": [<top 3 short phrases>], "sentiment": <int 0-100>, "oneliner": "<one compelling sentence summarizing what customers love>" }
Testimonials: ${JSON.stringify(sample)}`;

  const raw = await callGemini(prompt);
  if (!raw) return FALLBACK;

  try {
    const parsed = JSON.parse(stripCodeFences(raw)) as {
      themes?: unknown;
      sentiment?: unknown;
      oneliner?: unknown;
    };
    const themes = Array.isArray(parsed.themes)
      ? (parsed.themes as unknown[])
          .filter((t): t is string => typeof t === "string")
          .slice(0, 3)
      : [];
    const sentiment =
      typeof parsed.sentiment === "number"
        ? Math.max(0, Math.min(100, Math.round(parsed.sentiment)))
        : 0;
    const oneliner = typeof parsed.oneliner === "string" ? parsed.oneliner : "";
    return { themes, sentiment, oneliner };
  } catch {
    return FALLBACK;
  }
}
