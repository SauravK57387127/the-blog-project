import { MenubarMenu } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { withEditorCommand } from "@/utils/editorUtils";






export default function BlockquoteMenu({ editor }) {
    if (!editor) return null;

    return (
        <MenubarMenu>
            <Button
                onMouseDown={withEditorCommand(
                    editor,
                    (editor) => editor.chain().focus().toggleBlockquote(),
                    (editor) =>
                        !editor.isActive("codeBlock") &&
                        editor.can().chain().focus().toggleBlockquote().run(),
                )}
            >
                BlockQuote
            </Button>
        </MenubarMenu>
    );
}
