const markdownExample =
  '# Example with line break \n\n #### You need to add \\n\\n in each line break \n\n [Markdown](http://daringfireball.net/projects/markdown/) lets you write content in a really natural way. \n\n * You can have lists, like this one \n\n * Make things **bold** or *italic* \n\n * Embed snippets of `code` \n\n * Create [links](/) \n\n * ... \n\n ```javascript \n\n function App() { \n\n return <div>Hello world!</div>; \n\n }```';

const markdownWithLiteralString = `
# Example with string literal

#### You need to scape each literal tick: \\ \` 

[Markdown](http://daringfireball.net/projects/markdown/) lets you write content in a really natural way.

  * You can have lists, like this one
  * Make things **bold** or *italic*
  * Embed snippets of \`code\`
  * Create [links](/)
  * ...

<small>Sample content borrowed with thanks from [elm-markdown](http://elm-lang.org/examples/markdown) ❤️</small>

Custom handling of code blocks (or any rule!) is possible with the [\`renderRule\` option](https://github.com/quantizor/markdown-to-jsx#optionsrenderrule). For example, LaTeX support via [\`@matejmazur/react-katex\`](https://www.npmjs.com/package/@matejmazur/react-katex):

\`\`\`latex
\mathbb{N} = \{ a \in \mathbb{Z} : a > 0 \}
\`\`\`

Or any other typical language, using [\`highlight.js\`](https://highlightjs.org/):

\`\`\`javascript
function App() {
  return <div>Hello world!</div>;
}
\`\`\`
`;

const markdowmExampleWithHtml = `
# Example with bloqued html

#### You need to add disableParsingRawHTML:

\`\`\`
<Markdown options={{ disableParsingRawHTML: true }}>
    This text has <span>html</span> in it but it won't be rendered
</Markdown>;
\`\`\`

<span> This is span </span>
<script>
  function myFunction() {alert("Danger")}
  myFunction()
</script>


\`\`\`javascript
<span> This is span </span>
<script>
  function myFunction() {alert("Danger")}
  myFunction()
</script>
\`\`\`
`;

export { markdowmExampleWithHtml, markdownExample, markdownWithLiteralString };
