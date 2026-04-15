import { marked } from 'marked';
import { slugify } from './utils/slugify';

/**
 * Custom renderer to add IDs to H2 and H3 headings for TOC
 */
const renderer = new marked.Renderer();

// Store original heading renderer to call it if needed, 
// though we usually just override it.
renderer.heading = function({ tokens, depth, raw }) {
  const text = this.parser.parseInline(tokens);
  if (depth === 2 || depth === 3) {
    const id = slugify(raw);
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  }
  return `<h${depth}>${text}</h${depth}>\n`;
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
    if (token.type === 'heading' && (token.depth === 2 || token.depth === 3)) {
      toc.push({
        id: slugify(token.text),
        text: token.text,
        level: token.depth
      });
    }
  });
  
  return toc;
}
