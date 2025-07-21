import { MenubarMenu } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";






export default function LinkMenu({ editor }) {
    if (!editor) return null;

    const isActive = editor.isActive("link");

    return (
        <MenubarMenu>
            <Button
                variant={editor.isActive("link") ? "default" : "outline"}
                onMouseDown={(e) => {
                    e.preventDefault();
                    const previousUrl = editor.getAttributes("link").href;
                    const url = window.prompt("URL", previousUrl);

                    if (url === null) return;
                    if (url === "") {
                        editor
                            .chain()
                            .focus()
                            .extendMarkRange("link")
                            .unsetLink()
                            .run();
                        return;
                    }

                    editor
                        .chain()
                        .focus()
                        .extendMarkRange("link")
                        .setLink({ href: url })
                        .run();
                }}
            >
                🔗 Link
            </Button>
        </MenubarMenu>
    );
}
