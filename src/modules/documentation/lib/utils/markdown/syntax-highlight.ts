import hljs from 'highlight.js';

export function highlightCodeSnippet(code: string, language?: string): string {
  if (!code) return '';

  const validLang = language && hljs.getLanguage(language) ? language : undefined;

  try {
    if (validLang) {
      return hljs.highlight(code, { language: validLang }).value;
    }
    return hljs.highlightAuto(code).value;
  } catch {
    return code;
  }
}
