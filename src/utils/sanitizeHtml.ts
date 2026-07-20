import DOMPurify from 'dompurify';

/** Notes content is stored as HTML from the rich-text editor; sanitize before render. */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}
