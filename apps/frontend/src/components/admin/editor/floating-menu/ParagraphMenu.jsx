"use client"
import { MenubarMenu, MenubarTrigger, MenubarContent, MenubarLabel, MenubarItem, MenubarSeparator } from "@/components/ui/menubar";
import { withEditorCommand } from "@/utils/editorUtils";
import { Type } from "lucide-react";

export function ParagraphMenu({
  editor
}) {
  return <MenubarMenu>
      {/* <MenubarTrigger>Text ▾</MenubarTrigger> */}
      <MenubarTrigger className="flex flex-column items-center gap-2 px-3">
    <Type className="h-4 w-4" />
    <span>Text</span>
  </MenubarTrigger>
      
      <MenubarContent>
        <MenubarLabel>Hierarchy</MenubarLabel>
        <MenubarSeparator />
        <MenubarItem onMouseDown={withEditorCommand(editor, editor => editor.chain().focus().setParagraph(), editor => !editor.isActive("codeBlock") && editor.can().chain().focus().setParagraph().run())}>
          Paragraph
        </MenubarItem>
        <MenubarItem onMouseDown={withEditorCommand(editor, editor => editor.chain().focus().toggleHeading({
        level: 1
      }))}>
          Heading 1
        </MenubarItem>
        <MenubarItem onMouseDown={withEditorCommand(editor, editor => editor.chain().focus().toggleHeading({
        level: 2
      }))}>
          Heading 2
        </MenubarItem>
        <MenubarItem onMouseDown={withEditorCommand(editor, editor => editor.chain().focus().toggleHeading({
        level: 3
      }))}>
          Heading 3
        </MenubarItem>
        <MenubarSeparator />
        <MenubarLabel>Lists</MenubarLabel>
        <MenubarSeparator />
        <MenubarItem onMouseDown={withEditorCommand(editor, editor => editor.chain().focus().toggleBulletList(), editor => !editor.isActive("codeBlock") && editor.can().chain().focus().toggleBulletList().run())}>
          Bullet List
        </MenubarItem>
        <MenubarItem onMouseDown={withEditorCommand(editor, editor => editor.chain().focus().toggleOrderedList(), editor => !editor.isActive("codeBlock") && editor.can().chain().focus().toggleOrderedList().run())}>
          Ordered List
        </MenubarItem>
        <MenubarItem onMouseDown={withEditorCommand(editor, editor => editor.chain().focus().toggleTaskList(), editor => !editor.isActive("codeBlock") && editor.can().chain().focus().toggleTaskList().run())}>
          Task List
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>;
}
