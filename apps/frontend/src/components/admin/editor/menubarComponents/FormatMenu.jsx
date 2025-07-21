import {
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
} from "@/components/ui/menubar";
import { withEditorCommand } from "@/utils/editorUtils";







export default function FormatMenu({ editor }) {
    if (!editor) return null;

    return (
        <MenubarMenu>
            <MenubarTrigger>≡</MenubarTrigger>
            <MenubarContent>
                <MenubarItem
                    onMouseDown={withEditorCommand(
                        editor,
                        (editor) => editor.chain().focus().toggleSubscript(),
                        (editor) =>
                            !editor.isActive("codeBlock") &&
                            editor
                                .can()
                                .chain()
                                .focus()
                                .toggleSubscript()
                                .run(),
                    )}
                >
                    sub
                </MenubarItem>

                <MenubarItem
                    onMouseDown={withEditorCommand(
                        editor,
                        (editor) => editor.chain().focus().toggleSuperscript(),
                        (editor) =>
                            !editor.isActive("codeBlock") &&
                            editor
                                .can()
                                .chain()
                                .focus()
                                .toggleSuperscript()
                                .run(),
                    )}
                >
                    sup
                </MenubarItem>

                <MenubarSeparator />

                <MenubarItem
                    onMouseDown={withEditorCommand(editor, (editor) =>
                        editor.chain().focus().setTextAlign("left"),
                    )}
                >
                    align L
                </MenubarItem>

                <MenubarItem
                    onMouseDown={withEditorCommand(
                        editor,
                        (editor) =>
                            editor.chain().focus().setTextAlign("center"),
                        (editor) =>
                            !editor.isActive("codeBlock") &&
                            editor
                                .can()
                                .chain()
                                .focus()
                                .setTextAlign("center")
                                .run(),
                    )}
                >
                    align C
                </MenubarItem>
            </MenubarContent>
        </MenubarMenu>
    );
}







// export default function FormatMenu({ editor }) {
//     return (
//         <MenubarMenu>
//             <MenubarTrigger> ≡ </MenubarTrigger>
//             <MenubarContent>
//                 <MenubarItem> sub </MenubarItem>
//                 <MenubarItem> sup </MenubarItem>

//                 <MenubarSeparator />

//                 <MenubarItem> align L</MenubarItem>
//                 <MenubarItem> align R</MenubarItem>
//             </MenubarContent>
//         </MenubarMenu>
//     );
// }
