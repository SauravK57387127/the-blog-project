"use client";


import { MenubarMenu } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";

export default function ImageMenu({ editor }) {
    if (!editor) return null;

    return (
        <MenubarMenu>
            <Button
                variant="outline"
                onMouseDown={(e) => {
                    e.preventDefault();
                    const url = window.prompt("Enter image URL");
                    if (!url) return;
                    editor.chain().focus().setImage({ src: url }).run();
                }}
            >
                🖼 Img
            </Button>
        </MenubarMenu>
    );
}
