"use client"

import { Editor } from "@tiptap/react";
import { Menubar } from "@/components/ui/menubar";
import { ParagraphMenu } from "@/components/admin/editor/floating-menu/ParagraphMenu";
import { FontMenu } from "@/components/admin/editor/floating-menu/FontMenu";
import { SizeMenu } from "@/components/admin/editor/floating-menu/SizeMenu";
import { BlockquoteMenu } from "@/components/admin/editor/floating-menu/BlockquoteMenu";
import { CodeBlockMenu } from "@/components/admin/editor/floating-menu/CodeBlockMenu";
import { ImageMenu } from "@/components/admin/editor/floating-menu/ImageMenu";
import { LinkMenu } from "@/components/admin/editor/floating-menu/LinkMenu";
import { HighlightMenu } from "@/components/admin/editor/floating-menu/HighlightMenu";
import { FormatMenu } from "@/components/admin/editor/floating-menu/FormatMenu";
// import { FloatingMenu } from "@tiptap/extension-floating-menu"; // Change this line
import { FloatingMenu } from '@tiptap/react/menus'


export function EditorToolbar({
  editor,
  draftSlug
}) {
    // console.log("FloatingMenu type:", typeof FloatingMenu, FloatingMenu);

  return ( 
  // <FloatingMenu
  //       editor={editor}
  //       shouldShow={({ editor, state }) => {
  //         const { from, to } = state.selection;
  //         const { $from } = state.selection;
  //         const node = $from.node();

  //         const selection = from !== to;
  //         const isEmpty = node.content.size === 0;
  //         const allowed = ["paragraph", "heading", "blockquote", "codeBlock"];

  //         return selection || (allowed.includes(node.type.name) && isEmpty);
  //       }}
  //     >


  // <div className="sticky top-0 z-10 border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2">
  // <Menubar className="bg-transparent border-none h-10 gap-1">
<FloatingMenu editor={editor}>
  <div>
    <Menubar>
        <ParagraphMenu editor={editor} />
        <FontMenu editor={editor} />
        <SizeMenu editor={editor} />
        <BlockquoteMenu editor={editor} />
        <CodeBlockMenu editor={editor} />
        <ImageMenu editor={editor} draftSlug={draftSlug} />
        <LinkMenu editor={editor} />
        <HighlightMenu editor={editor} />
        <FormatMenu editor={editor} />
      </Menubar>
    </div>
  </FloatingMenu>
    )
}

  // <div className="border-b bg-muted/30 p-2 sticky top-0 z-10">
  //   <Menubar className="bg-transparent border-none h-10 gap-1">
