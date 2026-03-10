"use client"
import { MenubarMenu } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { withEditorCommand } from "@/utils/editorUtils";
import { Quote } from "lucide-react";

export function BlockquoteMenu({
  editor
}) {
  return <MenubarMenu>
      <Button 
      variant={editor.isActive("blockquote") ? "default" : "outline"} 
      // className="italic border-l-4 border-border" 
          className="h-9 px-3 flex items-center gap-2"
      size="sm" 
      onMouseDown={withEditorCommand(editor, editor => editor.chain().focus().toggleBlockquote(), 
      editor => !editor.isActive("codeBlock") && editor.can().chain().focus().toggleBlockquote().run())}>
        {/* BlockQuote */}
        <Quote className="h-4 w-4" />
    <span>Quote</span>
      </Button>
    </MenubarMenu>;
}
