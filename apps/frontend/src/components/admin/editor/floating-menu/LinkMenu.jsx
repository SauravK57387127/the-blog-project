"use client";

import { MenubarMenu } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";
export function LinkMenu({
  editor
}) {
  return <MenubarMenu>
      <Button 
      variant={editor.isActive("link") ? "default" : "outline"} 
      size="sm" 
      onMouseDown={e => {
      e.preventDefault();
      const previousUrl = editor.getAttributes("link").href;
      const url = window.prompt("URL", previousUrl);
      if (url === null) return;
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({
        href: url
      }).run();}}

        className="h-9 px-3 flex items-center gap-2"
      >
        
        {/* <LinkIcon className="h-4 w-4 mr-1" />
        Link */}
        <LinkIcon className="h-4 w-4" />
  <span>Link</span>
      </Button>
    </MenubarMenu>;
}
