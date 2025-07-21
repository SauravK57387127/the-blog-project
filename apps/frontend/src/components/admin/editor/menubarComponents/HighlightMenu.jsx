import { MenubarMenu } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { withEditorCommand } from "@/utils/editorUtils";






export default function HighlightMenu({ editor }) {
    if (!editor) return null;

    const isHighlighted = editor.isActive("highlight");

    return (
        <MenubarMenu>
            <Button
                variant={editor.isActive("highlight") ? "default" : "outline"}
                onMouseDown={withEditorCommand(
                    editor,
                    (editor) => {
                        return editor.isActive("highlight")
                            ? editor.chain().focus().unsetHighlight()
                            : editor
                                  .chain()
                                  .focus()
                                  .toggleHighlight({ color: "#ffc078" });
                    },
                    (editor) =>
                        !editor.isActive("codeBlock") &&
                        editor
                            .can()
                            .chain()
                            .focus()
                            .toggleHighlight({ color: "#ffc078" })
                            .run(),
                )}
            >
                🖍 Highlight
            </Button>
        </MenubarMenu>
    );
}
