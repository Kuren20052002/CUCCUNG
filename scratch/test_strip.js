function stripMarkdown(text) {
  return text
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/(`+)(.*?)\1/g, '$2')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/\\(.)/g, '$1');
}

console.log(stripMarkdown('**Bold** and **Bold2**'));
console.log(stripMarkdown('1\\. Escaped'));
console.log(stripMarkdown('[Link](url)'));
console.log(stripMarkdown('**[Link](url)**'));
