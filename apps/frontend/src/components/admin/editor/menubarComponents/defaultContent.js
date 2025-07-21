export const defaultContent = `
<h1>Building a Clean Editor in Tiptap</h1>

<p>Let’s walk through how to structure and style a rich text editor using Tiptap with full control.</p>

<img src="https://cdn.bhdw.net/im/naruto-shippuden-itachi-uchiha-wallpaper-42402_w635.webp" alt="A placeholder of Itachi" />

<h2>1. Setup & Structure</h2>

<p>Start by creating an editor wrapper, layout containers, and using <code>EditorContent</code> to mount it.</p>

<h3>UseEditor Example</h3>

<pre><code class="language-js">
import { useEditor, EditorContent } from '@tiptap/react'

const editor = useEditor({
  extensions: [StarterKit],
  content: '&lt;p&gt;Hello World&lt;/p&gt;',
})
</code></pre>

<h2>2. Styling Fundamentals</h2>

<p>Use <strong>REM</strong> units for scalable typography and apply scoped styles via a wrapper like <code>.editor-styled</code>.</p>

<h3>Blockquote with Attribution</h3>

<blockquote>
  <p>"A well-structured editor is half the user experience."</p>
  <p>— Someone Smart</p>
</blockquote>

<h2>3. Lists</h2>

<p>Lists are useful for organizing thoughts:</p>

<ul>
  <li><p>Setup layout</p></li>
  <li><p>Add styling</p></li>
  <li><p>Test with content</p></li>
</ul>

<h2>4. Useful Links</h2>

<p>For more on Tiptap, visit <a href="https://tiptap.dev">Tiptap Docs</a>.</p>
`;
