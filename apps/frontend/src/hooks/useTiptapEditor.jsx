"use client"
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";

export const useTiptapEditor = ({
  content = "",
  onUpdate
} = {}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Image,
      Link.configure({ openOnClick: false }),
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    
    // ✔ THIS MUST BE INCLUDED
    content,     

    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[500px] max-w-none p-4",
      },
    },

    // ✔ THIS IS WHAT UPDATES YOUR PREVIEW
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
  });

  return editor;
};

// import FloatingMenu from "@tiptap/extension-floating-menu";
// export const useTiptapEditor = ({
//   content = "",
//   onUpdate
// } = {}) => {
//   const editor = useEditor({
//     immediatelyRender: false,
//     extensions: [
//       StarterKit.configure({
//         heading: {
//           levels: [1, 2, 3]
//         }
//       }), 
//       TextStyle, 
//       TextAlign.configure({
//         types: ['heading', 'paragraph']
//       }), 
//       Highlight.configure({
//         multicolor: true
//       }), 
//       Image, 
//       Link.configure({
//         openOnClick: false
//       }), 
//       Subscript, 
//       Superscript, 
//       TaskList, 
//       TaskItem.configure({
//         nested: true
//       }),
//       // FloatingMenu
//       // .configure({
//       //   // Optional: configure the floating menu
//       //   pluginKey: 'floatingMenu',
//       // }),
//     ],
//     // ... rest of your config
//   });
//   return editor;
// };




// export const useTiptapEditor = ({
//   content = "",
//   onUpdate
// } = {}) => {
//   const editor = useEditor({
//     immediatelyRender: false,
//     extensions: [StarterKit.configure({
//       heading: {
//         levels: [1, 2, 3]
//       }
//     }), TextStyle, TextAlign.configure({
//       types: ['heading', 'paragraph']
//     }), Highlight.configure({
//       multicolor: true
//     }), Image, Link.configure({
//       openOnClick: false
//     }), Subscript, Superscript, TaskList, TaskItem.configure({
//       nested: true
//     }),
//   ],
//     content,
//     editorProps: {
//       attributes: {
//         class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] max-w-none p-4"
//       }
//     },
//     onUpdate: ({
//       editor
//     }) => {
//       if (onUpdate) {
//         onUpdate(editor.getHTML());
//       }
//     }
//   });
//   return editor;
// };
