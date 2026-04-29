"use client"

import { Editor } from "@tiptap/react";
import { Menubar } from "@/components/ui/menubar";
import { ParagraphMenu } from "@/components/admin/editor/floating-menu/ParagraphMenu";
//import { FontMenu } from "@/components/admin/editor/floating-menu/FontMenu";
//import { SizeMenu } from "@/components/admin/editor/floating-menu/SizeMenu";
import { BlockquoteMenu } from "@/components/admin/editor/floating-menu/BlockquoteMenu";
import { CodeBlockMenu } from "@/components/admin/editor/floating-menu/CodeBlockMenu";
import { ImageMenu } from "@/components/admin/editor/floating-menu/ImageMenu";
//import { LinkMenu } from "@/components/admin/editor/floating-menu/LinkMenu";
//import { HighlightMenu } from "@/components/admin/editor/floating-menu/HighlightMenu";
import { FormatMenu } from "@/components/admin/editor/floating-menu/FormatMenu";
// import { FloatingMenu } from "@tiptap/extension-floating-menu"; // Change this line
import { FloatingMenu } from '@tiptap/react/menus'


export function EditorToolbar({
  editor,
  draftSlug
}) {

  return ( 
  <FloatingMenu editor={editor}>
  <div>
    <Menubar>
        <ParagraphMenu editor={editor} />
        <BlockquoteMenu editor={editor} />
        <CodeBlockMenu editor={editor} />
        <ImageMenu editor={editor} draftSlug={draftSlug} />
        <FormatMenu editor={editor} />
      </Menubar>
    </div>
  </FloatingMenu>
    )
}

