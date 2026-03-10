"use client";

import { MenubarMenu } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { Highlighter } from "lucide-react";
import { withEditorCommand } from "@/utils/editorUtils";
export function HighlightMenu({
  editor
}) {
  return <MenubarMenu>
      <Button 
      variant={editor.isActive("highlight") ? "default" : "outline"} 
      size="sm" 
      onMouseDown={withEditorCommand(editor, editor => {
      return editor.isActive("highlight") ? editor.chain().focus().unsetHighlight() : editor.chain().focus().toggleHighlight({
        color: "#ffc078"
      });
    }, editor => !editor.isActive("codeBlock") && editor.can().chain().focus().toggleHighlight({
      color: "#ffc078"
    }).run())}

      className="h-9 px-3 flex items-center gap-2"
    >
        {/* <Highlighter className="h-4 w-4 mr-1" />
        Highlight */}
        <Highlighter className="h-4 w-4" />
  <span>Highlight</span>
      </Button>
    </MenubarMenu>;
}
