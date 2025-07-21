import DOMPurify from 'dompurify';

export function sanitizeHTML(htmlString) {
  return DOMPurify.sanitize(htmlString);
}

