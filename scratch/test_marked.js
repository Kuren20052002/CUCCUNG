const { marked } = require('marked');

const markdown = `
## **Bold Title**
## 1\\. Escaped Number
## Title with [Link](https://google.com)
`;

const tokens = marked.lexer(markdown);
tokens.forEach(token => {
    if (token.type === 'heading') {
        console.log('--- Heading ---');
        console.log('depth:', token.depth);
        console.log('text:', token.text);
        console.log('raw:', token.raw);
        // console.log('tokens:', JSON.stringify(token.tokens, null, 2));
    }
});
