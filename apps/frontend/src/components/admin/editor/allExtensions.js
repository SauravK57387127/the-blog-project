import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

export const allExtensions = [
    StarterKit,
    TextStyle,
    Color,
    Subscript,
    Superscript,
    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),
    Image,
    Link.configure({
        // openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        HTMLAttributes: {
            class: "text-blue-500 underline hover:text-blue-700 visited:text-purple-600 cursor-pointer",
            target: "_blank",
            rel: "noopener noreferrer",
        },
    }),
    Highlight.configure({
        multicolor: true,
    }),
    TaskList,
    TaskItem,
];