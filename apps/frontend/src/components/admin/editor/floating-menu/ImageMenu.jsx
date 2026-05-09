"use client";

import { useRef } from "react";
import { MenubarMenu } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { toast } from "sonner";

export function ImageMenu({ editor, draftSlug }) {
    const fileInputRef = useRef(null);

    // Insert image via URL prompt — existing behaviour unchanged
    const handleUrlInsert = (e) => {
        e.preventDefault();
        const url = window.prompt("Enter image URL");
        if (!url) return;
        editor.chain().focus().setImage({ src: url }).run();
    };

    // Insert image via local file upload → Cloudinary → insert URL at cursor
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input so same file can be picked again
        e.target.value = "";

        try {
            const formData = new FormData();
            formData.append("image", file);
            if (draftSlug) formData.append("draftSlug", draftSlug);

            toast.loading("Uploading image...", { id: "img-upload" });

            const result = await apiClient.post(
                API_ENDPOINTS.ADMIN.UPLOAD.CONTENT_IMAGE,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );

            const url = result.data?.url;
            if (!url) throw new Error("No URL returned");

            // Insert at current cursor position in editor
            editor.chain().focus().setImage({ src: url }).run();
            toast.success("Image inserted", { id: "img-upload" });
        } catch {
            toast.error("Upload failed", { id: "img-upload" });
        }
    };

    return (
        <MenubarMenu>
            {/* URL insert — original button */}
            <Button
                variant="outline"
                size="sm"
                onMouseDown={handleUrlInsert}
                className="h-9 px-3 flex items-center gap-2"
            >
                <ImageIcon className="h-4 w-4" />
                <span>Image</span>
            </Button>

            {/* Upload from device */}
            <Button
                variant="outline"
                size="sm"
                onMouseDown={(e) => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                }}
                className="h-9 px-3 flex items-center gap-2"
                title="Upload image from device"
            >
                <Upload className="h-4 w-4" />
            </Button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </MenubarMenu>
    );
}
