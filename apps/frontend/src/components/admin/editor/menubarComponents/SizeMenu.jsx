import {
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "@/components/ui/menubar";
import { withEditorCommand } from "@/utils/editorUtils";






export default function SizeMenu({ editor }) {
    if (!editor) return null; // This is a important line.

    const sizes = [
        { label: "Small", class: "text-sm" },
        { label: "Medium", class: "text-base" },
        { label: "Large", class: "text-lg" },
        { label: "XL", class: "text-xl" },
    ];

    const defaultSize = "text-base";

    const nodeType = editor.isActive("heading") ? "heading" : "paragraph";
    const currentSize = editor.getAttributes(nodeType)?.class || defaultSize;
    const currentLabel =
        sizes.find((s) => s.class === currentSize)?.label || "Medium";

    return (
        <MenubarMenu>
            <MenubarTrigger>{currentLabel}</MenubarTrigger>
            <MenubarContent>
                {sizes
                    .filter((s) => s.class !== currentSize)
                    .map((s) => (
                        <MenubarItem
                            key={s.label}
                            onMouseDown={withEditorCommand(
                                editor,
                                (editor) => {
                                    // This is a function
                                    const node = e.isActive("heading")
                                        ? "heading"
                                        : "paragraph"; // Have to review this once more - LATER
                                    return editor
                                        .chain()
                                        .focus()
                                        .updateAttributes(node, {
                                            class: s.class,
                                        });
                                }, // “Ohh… that whole (editor) => { ... return editor.updateAttributes(...) } is just a function too — and withEditorCommand only runs it later.”
                            )}
                        >
                            {s.label}
                        </MenubarItem>
                    ))}
            </MenubarContent>
        </MenubarMenu>
    );
}











// export default function SizeMenu({ editor }) {

//     const currentSize = editor.getAttributes("paragraph")?.class || defaultSize
//     const currentLabel = sizes.find((s) => s.class === currentSize)?.label || "Medium"

//     return (
//         <MenubarMenu>
//             <MenubarTrigger> {currentLabel} </MenubarTrigger>
//             <MenubarContent>
//                 {sizes
//                     .filter((s) => s.class !== currentSize)
//                     .map((s) => (
//                         <MenubarItem
//                             key={s.label}
//                             onMouseDown={withEditorCommand(editor, (e) => {
//                                 const nodeType = e.isActive("heading") ? "heading" : "paragraph"
//                                 return e.updateAttributes("paragraph", {class: s.class})} )}>
//                                 {s.label}
//                         </MenubarItem>
//                     ))}
//             </MenubarContent>
//         </MenubarMenu>
//     );
// }
