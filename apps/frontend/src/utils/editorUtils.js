import { Editor } from "@tiptap/react";
export const withEditorCommand = (editor, commandFn, canRunFn) => {
  return e => {
    e.preventDefault();
    if (!editor) return;

    // Check if command can run
    if (canRunFn && !canRunFn(editor)) return;

    // Execute the command
    const chain = commandFn(editor);
    if (chain && typeof chain.run === 'function') {
      chain.run();
    }
  };
};
