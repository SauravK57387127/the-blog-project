"use client";
import { use } from "react";
import EditDraftPage from "@/ui-pages/admin/EditDraft";

export default function Page({ params }) {
    const { id } = use(params);
    return <EditDraftPage draftSlug={id} />;
}
