"use client";

import { MenubarMenu } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
export function ImageMenu({
  editor
}) {
  return <MenubarMenu>
      <Button 
      variant="outline" 
      size="sm" 
      onMouseDown={e => {
        e.preventDefault();
        const url = window.prompt("Enter image URL");
        if (!url) return;
        editor.chain().focus().setImage({
          src: url
      }).run();}}
        className="h-9 px-3 flex items-center gap-2"
      >
        {/* <ImageIcon className="h-4 w-4 mr-1" />
        Image */}
        <ImageIcon className="h-4 w-4" />
  <span>Image</span>
      </Button>
    </MenubarMenu>;
}
