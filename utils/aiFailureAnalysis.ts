import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config(); // ensure env is loaded

let groq: Groq | null = null;
try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
} catch (error) {
  console.warn('Groq client could not be initialised.');
}

/**
 * Analyzes a test failure by sending the error message and page URL to Groq.
 * (No screenshot is sent – uses a fast text‑only model.)
 */
export async function analyzeFailure(
  errorMessage: string,
  _screenshotPath?: string,    // kept for backward compatibility, ignored
  url?: string
): Promise<string> {
  if (!groq) {
    return 'AI analysis unavailable (no valid API key).';
  }

  const prompt = `Analyze the following Playwright test failure and suggest the most likely root cause and a fix:
Error Message: ${errorMessage}
Page URL: ${url || 'unknown'}`;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',   // ✅ currently supported text model
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.2,
    });

    return response.choices[0]?.message?.content || 'No analysis generated.';
  } catch (error: any) {
    console.error('Groq AI analysis failed:', error);
    return `AI analysis unavailable: ${error.message || 'Unknown error'}`;
  }
}