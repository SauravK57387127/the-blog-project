import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const TiptapEditor1 = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "<p>Hello World!</p>",
    onCreate: ({ editor }) => {
    console.log("Editor has been created & mounted", editor);
  },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log(`content is updated!! with ${html}`);
      onChange && onChange(html);
    },
  });

  return (
    <div className="tiptap-editor">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor1;