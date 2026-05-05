import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitize HTML content (for blog posts, comments with rich text)
 * Removes dangerous tags but keeps safe formatting
 */
export function sanitizeHTML(dirty) {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            'p',
            'br',
            'strong',
            'em',
            'u',
            's',
            'a',
            'ul',
            'ol',
            'li',
            'blockquote',
            'code',
            'pre',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'img',
            'table',
            'thead',
            'tbody',
            'tr',
            'th',
            'td',
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class'],
        ALLOWED_URI_REGEXP:
            /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
}

/**
 * Sanitize plain text (for usernames, titles, etc)
 * Removes ALL HTML
 */
export function sanitizePlainText(dirty) {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [], // No HTML allowed
        ALLOWED_ATTR: [],
    });
}

/**
 * Sanitize array of strings
 */
export function sanitizeArray(array) {
    if (!Array.isArray(array)) {
        return [];
    }

    return array
        .filter((item) => typeof item === 'string')
        .map((item) => sanitizePlainText(item));
}
