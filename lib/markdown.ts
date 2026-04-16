import { marked } from 'marked';
import { slugify } from './utils/slugify';

/**
 * Strips markdown syntax from a string to get plain text
 */
function stripMarkdown(text: string): string {
  return text
    // Remove bold and italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove inline code
    .replace(/(`+)(.*?)\1/g, '$2')
    // Remove links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images ![alt](url) -> alt
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove escapes like 1\. -> 1.
    .replace(/\\(.)/g, '$1');
}

/**
 * Custom renderer to add IDs to H2 and H3 headings for TOC
 * and to strip Base64 images that bloat payload
 */
const renderer = new marked.Renderer();

/**
 * Image renderer: blocks Base64 data URIs to prevent
 * 1.7MB+ HTML payloads. Normal URLs pass through.
 */
renderer.image = function({ href, title, text }) {
  // Block Base64 data URIs — they bloat HTML payload massively
  if (href && href.startsWith('data:')) {
    return `<figure class="base64-image-blocked" role="note" aria-label="Ảnh không khả dụng">
      <div style="padding:1rem;background:#fef9c3;border:1px solid #fde047;border-radius:0.5rem;color:#854d0e;font-size:0.875rem;">
        ⚠️ <strong>Ảnh Base64 không được hỗ trợ.</strong> Vui lòng upload lại ảnh qua trình quản lý ảnh để hiển thị đúng cách.
      </div>
    </figure>\n`;
  }

  // Normal image — render with alt and title
  const altAttr = text ? ` alt="${text}"` : '';
  const titleAttr = title ? ` title="${title}"` : '';
  return `<img src="${href}"${altAttr}${titleAttr} loading="lazy" decoding="async" />\n`;
};

renderer.heading = function({ tokens, depth, text }) {
  const htmlText = this.parser.parseInline(tokens);
  
  // Rule: H1 inside content is not allowed, downgrade to H2 for SEO
  let finalDepth = depth;
  if (depth === 1) {
    finalDepth = 2;
  }

  if (finalDepth === 2 || finalDepth === 3) {
    const id = slugify(text);
    return `<h${finalDepth} id="${id}">${htmlText}</h${finalDepth}>\n`;
  }
  return `<h${finalDepth}>${htmlText}</h${finalDepth}>\n`;
};

/**
 * Parses markdown to HTML with heading IDs
 */
export async function parseMarkdown(markdown: string) {
  return marked.parse(markdown, { renderer });
}

/**
 * Extracts H2 and H3 headings for Table of Contents
 */
export function extractToc(markdown: string) {
  const tokens = marked.lexer(markdown);
  const toc: { id: string; text: string; level: number }[] = [];
  
  tokens.forEach((token) => {
    if (token.type === 'heading') {
      // H1 is treated as H2 for TOC extraction as well
      const depth = token.depth === 1 ? 2 : token.depth;
      
      if (depth === 2 || depth === 3) {
        toc.push({
          id: slugify(token.text),
          text: stripMarkdown(token.text),
          level: depth
        });
      }
    }
  });
  
  return toc;
}

/**
 * Validates markdown content according to SEO rules
 * Returns { valid: boolean, error?: string }
 */
export function validateMarkdown(markdown: string) {
  const tokens = marked.lexer(markdown);
  const h1Found = tokens.some(token => token.type === 'heading' && token.depth === 1);

  if (h1Found) {
    return {
      valid: false,
      error: 'Phát hiện thẻ H1 (#) trong nội dung. Vui lòng sử dụng H2 (##) hoặc H3 (###) thay thế.'
    };
  }

  return { valid: true };
}
