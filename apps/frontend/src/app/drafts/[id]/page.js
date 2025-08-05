// app/(admin)/drafts/[id]/page.jsx
"use client";

import TiptapEditor from "@/components/admin/editor/TiptapEditor";

export default function DraftEditorPage({ params }) {
    const { id } = params;

    return (
        <div className="p-4">
            <TiptapEditor mode="edit" draftId={id} />
        </div>
    );
}

// REMINDER: should be using next.js way of doing stuffs.

// "use client";

// import TiptapEditor from "@/components/admin/editor/TiptapEditor"
// import { useParams } from "next/navigation";

// export default function DraftEditorPage() {
//   const { id } = useParams();
//   return <TiptapEditor mode="edit" draftId={id} />;
// }
