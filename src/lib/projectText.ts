import sanitizeHtml from 'sanitize-html';

const richTextMarker = '<!--project-rich-text-->';
const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const inlineTags = ['strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'code', 'span', 'br'];
const blockTags = ['p', 'div', ...headingTags, 'blockquote', 'ul', 'ol', 'li', 'pre', 'hr'];
const sanitizeOptions: sanitizeHtml.IOptions = {
    allowedTags: [...inlineTags, ...blockTags, 'a'],
    allowedAttributes: { a: ['href', 'title'], ol: ['start'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
};

export function isRichProjectText(value: string) {
    return value?.startsWith(richTextMarker) ?? false;
}

export function storeRichProjectText(html: string) {
    return richTextMarker + sanitizeHtml(html, sanitizeOptions);
}

export function projectTextHtml(value: string, allowLegacyHtml = false) {
    if (!value) return '';

    if (isRichProjectText(value)) {
        return sanitizeHtml(value.slice(richTextMarker.length), sanitizeOptions);
    }

    // Long descriptions previously supported HTML, while titles and summaries were plain text.
    if (allowLegacyHtml && /<\/?[a-z][^>]*>/i.test(value)) {
        return sanitizeHtml(value, sanitizeOptions);
    }

    return value.split(/\r\n?|\n/).map((line) => {
        const escaped = line.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        return `<p>${escaped}</p>`;
    }).join('');
}

function titleWithSpaces(value: string) {
    return projectTextHtml(value).replace(/<\/(?:p|div|h[1-6]|li|blockquote|pre)>|<br\s*\/?>/gi, '$& ');
}

export function projectTitleHtml(value: string) {
    return sanitizeHtml(titleWithSpaces(value), {
        allowedTags: inlineTags.filter((tag) => tag !== 'br'),
        allowedAttributes: { span: ['class'] },
        transformTags: Object.fromEntries(headingTags.map((tag, index) => [
            tag,
            sanitizeHtml.simpleTransform('span', { class: index < 3 ? 'project-text-title' : 'project-text-subtitle' }),
        ])),
    });
}

export function plainProjectTitle(value: string) {
    if (!isRichProjectText(value)) return value;

    return sanitizeHtml(titleWithSpaces(value), { allowedTags: [], allowedAttributes: {} })
        .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&')
        .replace(/\s+/g, ' ').trim();
}
