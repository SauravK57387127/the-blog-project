"use client";


import {
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "@/components/ui/menubar";
import { withEditorCommand } from "@/utils/editorUtils";

export default function FontMenu({ editor }) {
    const fonts = ["Inter", "Serif", "Mono", "Comic Sans", "Times"];
    const currentFont =
        editor?.getAttributes("textStyle")?.fontFamily || "Mono";

    return (
        <MenubarMenu>
            <MenubarTrigger> Mono </MenubarTrigger>
            <MenubarContent>
                {fonts
                    .filter((font) => font !== currentFont)
                    .map((font) => (
                        <MenubarItem
                            key={font}
                            onMouseDown={withEditorCommand(editor, (editor) =>
                                editor
                                    .chain()
                                    .focus()
                                    .setMark("textStyle", { fontFamily: font }),
                            )}
                        >
                            {font}
                        </MenubarItem>
                    ))}
            </MenubarContent>
        </MenubarMenu>
    );
}
