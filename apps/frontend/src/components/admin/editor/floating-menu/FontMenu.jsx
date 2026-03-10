"use client"
import { MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";
import { withEditorCommand } from "@/utils/editorUtils";
import { Type } from "lucide-react";

export function FontMenu({
  editor
}) {
  const fonts = ["Inter", "Serif", "Mono", "Comic Sans", "Times"];
  const currentFont = editor?.getAttributes("textStyle")?.fontFamily || "Mono";
  return <MenubarMenu>
      {/* <MenubarTrigger >{currentFont}</MenubarTrigger> */}
      <MenubarTrigger className="flex items-center gap-2 px-3 min-w-[100px]">
    <Type className="h-4 w-4" />
    <span>{currentFont}</span>
  </MenubarTrigger>
      <MenubarContent>
        {fonts.filter(font => font !== currentFont).map(font => <MenubarItem key={font} onMouseDown={withEditorCommand(editor, editor => editor.chain().focus().setMark("textStyle", {
        fontFamily: font
      }))}>
              {font}
            </MenubarItem>)}
      </MenubarContent>
    </MenubarMenu>;
}
