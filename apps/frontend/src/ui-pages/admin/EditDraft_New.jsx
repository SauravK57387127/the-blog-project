"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Send, Calendar as CalendarIcon, Image as ImageIcon,
  Tag as TagIcon, Eye, Edit3, X, Plus, Upload, ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AdminLayout_New from "@/components/admin/AdminLayout_New";
import { TiptapEditor } from "@/components/admin/editor/TiptapEditor_New";
import { BlogPreview } from "@/components/admin/editor/BlogPreview";
import { DateTimePicker } from "@/components/admin/editor/DateTimePicker_New";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

const demoDraft = {
  _id: "draft-123",
  title: "Understanding React Server Components",
  content: "<p>Start writing your content here...</p>",
  coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop",
  tags: ["react", "typescript"],
  scheduleDate: null,
  status: "draft",
};

function formatTimeAgo(date) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function EditDraftPage() {
  const router = useRouter();
  const params = useParams();
  const draftId = params?.id;

  const [title, setTitle] = useState(demoDraft.title);
  const [content, setContent] = useState(demoDraft.content);
  const [coverImage, setCoverImage] = useState(demoDraft.coverImage);
  const [tags, setTags] = useState(demoDraft.tags);
  const [scheduleDate, setScheduleDate] = useState(demoDraft.scheduleDate);

  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [lastSaved, setLastSaved] = useState(new Date());

  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const [newTag, setNewTag] = useState("");
  const [coverInput, setCoverInput] = useState(coverImage);
  const fileInputRef = useRef(null);

  const suggestedTags = ["javascript", "web-dev", "tutorial", "nextjs", "programming"];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCoverInput(blobUrl);
    }
  };

  useEffect(() => {
    if (!title && !content) return;
    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        // TODO: PATCH /api/drafts/:id
        console.log("Auto-saving draft:", { title, content, coverImage, tags });
        setSaveStatus("saved");
        setLastSaved(new Date());
      } catch (err) {
        setSaveStatus("error");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [title, content, coverImage, tags, scheduleDate]);

  const handleAddTag = (tag) => {
    if (!tags.includes(tag)) setTags([...tags, tag]);
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleSaveCover = () => {
    setCoverImage(coverInput);
    setCoverModalOpen(false);
  };

  const handlePublish = async () => {
    try {
      // TODO: PATCH /api/drafts/:id/publish
      toast.success("Blog published!", { description: "Your post is now live." });
      router.push("/admin/blogs");
    } catch (err) {
      toast.error("Failed to publish", { description: err.message });
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate) {
      toast.error("Please select a schedule date");
      return;
    }
    try {
      // TODO: PATCH /api/drafts/:id/schedule
      toast.success("Blog scheduled!", {
        description: `Will publish on ${new Date(scheduleDate).toLocaleString()}`,
      });
      router.push("/admin/home");
    } catch (err) {
      toast.error("Failed to schedule", { description: err.message });
    }
  };

  return (
    <AdminLayout_New>

      {/* ── Sticky Top Bar ─────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border mb-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">

          {/* Save status */}
          <span className={`text-xs font-mono ${
            saveStatus === "saving" ? "text-muted-foreground" :
            saveStatus === "error" ? "text-destructive" :
            "text-muted-foreground"
          }`}>
            {saveStatus === "saving" && "saving..."}
            {saveStatus === "saved" && `saved ${formatTimeAgo(lastSaved)}`}
            {saveStatus === "error" && "save failed"}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-0 border-2 border-foreground">
            <button
              onClick={handleSchedule}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium uppercase tracking-wide border-r-2 border-foreground hover:bg-muted ${DESIGN_CONSTANTS.transitions.fast}`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              {scheduleDate
                ? new Date(scheduleDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "Schedule"
              }
            </button>
            <button
              onClick={handlePublish}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wide bg-foreground text-background hover:bg-foreground/80 ${DESIGN_CONSTANTS.transitions.fast}`}
            >
              <Send className="h-3.5 w-3.5" />
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* ── Metadata Strip ─────────────────────────────────── */}
      <div className="border-b border-border -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-stretch divide-x divide-border overflow-x-auto">

          {/* Title */}
          <div className="flex-1 min-w-[200px] py-3 pr-4">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Title</p>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              className="border-0 p-0 h-auto text-sm font-sans font-semibold focus-visible:ring-0 bg-transparent"
            />
          </div>

          {/* Cover */}
          <div className="px-4 py-3 flex-shrink-0">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Cover</p>
            <Dialog open={coverModalOpen} onOpenChange={setCoverModalOpen}>
              <DialogTrigger asChild>
                <button className={`flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast}`}>
                  {coverImage
                    ? <img src={coverImage} alt="Cover" className="w-12 h-7 object-cover border border-border" />
                    : <ImageIcon className="h-4 w-4" />
                  }
                  <span>{coverImage ? "change" : "add image"}</span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-serif italic font-normal text-xl">Cover Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Image URL or Upload</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={coverInput}
                        onChange={(e) => setCoverInput(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 font-reading border-foreground/20"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                        className={`px-3 border-2 border-foreground hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast}`}
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </div>
                  {coverInput && (
                    <div className="aspect-video overflow-hidden border border-border">
                      <img src={coverInput} alt="Preview" className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x400?text=Invalid"; }} />
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setCoverModalOpen(false)}
                      className={`px-4 py-2 text-xs font-mono uppercase tracking-wide border border-border hover:bg-muted ${DESIGN_CONSTANTS.transitions.fast}`}>
                      Cancel
                    </button>
                    <button onClick={handleSaveCover}
                      className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wide border-2 border-foreground bg-foreground text-background hover:bg-foreground/80 ${DESIGN_CONSTANTS.transitions.fast}`}>
                      Save
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tags */}
          <div className="px-4 py-3 flex-shrink-0">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Tags</p>
            <Dialog open={tagsModalOpen} onOpenChange={setTagsModalOpen}>
              <DialogTrigger asChild>
                <button className={`flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast}`}>
                  <TagIcon className="h-3.5 w-3.5" />
                  {tags.length > 0
                    ? tags.slice(0, 2).join(", ") + (tags.length > 2 ? ` +${tags.length - 2}` : "")
                    : "add tags"
                  }
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-serif italic font-normal text-xl">Tags</DialogTitle>
                </DialogHeader>
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Current tags</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono border border-border">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className={`hover:text-destructive ${DESIGN_CONSTANTS.transitions.fast}`}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {tags.length === 0 && (
                        <p className="text-xs font-reading text-muted-foreground italic">No tags yet</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Add tag</p>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Enter tag..."
                        className="flex-1 font-reading border-foreground/20"
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddNewTag(); } }}
                      />
                      <button onClick={handleAddNewTag}
                        className={`px-3 border-2 border-foreground hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast}`}>
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Suggested</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.filter((t) => !tags.includes(t)).map((tag) => (
                        <button key={tag} onClick={() => handleAddTag(tag)}
                          className={`px-2 py-1 text-xs font-mono border border-border hover:border-foreground/50 hover:bg-muted ${DESIGN_CONSTANTS.transitions.fast}`}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => setTagsModalOpen(false)}
                      className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wide border-2 border-foreground bg-foreground text-background hover:bg-foreground/80 ${DESIGN_CONSTANTS.transitions.fast}`}>
                      Done
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Schedule */}
          <div className="px-4 py-3 flex-shrink-0">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Schedule</p>
            <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
              <DialogTrigger asChild>
                <button className={`flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast}`}>
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {scheduleDate ? new Date(scheduleDate).toLocaleDateString() : "set date"}
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-serif italic font-normal text-xl">Schedule Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <DateTimePicker value={scheduleDate} onChange={setScheduleDate} />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setScheduleDate(null); setScheduleModalOpen(false); }}
                      className={`px-4 py-2 text-xs font-mono uppercase tracking-wide border border-border hover:bg-muted ${DESIGN_CONSTANTS.transitions.fast}`}>
                      Clear
                    </button>
                    <button onClick={() => setScheduleModalOpen(false)}
                      className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wide border-2 border-foreground bg-foreground text-background hover:bg-foreground/80 ${DESIGN_CONSTANTS.transitions.fast}`}>
                      Save
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

        </div>
      </div>

      {/* ── Mobile Toggle ──────────────────────────────────── */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast}`}
        >
          {showPreview ? <><Edit3 className="h-3.5 w-3.5" />Editor</> : <><Eye className="h-3.5 w-3.5" />Preview</>}
        </button>
      </div>

      {/* ── Editor + Preview Split ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Editor */}
        <div className={`${showPreview ? "hidden lg:block" : "block"}`}>
          <div className="border border-border overflow-auto custom-scroll" style={{ height: "calc(100vh - 360px)" }}>
            <TiptapEditor content={content} onUpdate={setContent} />
          </div>
        </div>

        {/* Preview */}
        <div className={`${showPreview ? "block" : "hidden lg:block"}`}>
          <div className="border border-border border-l-2 border-l-foreground/20 overflow-auto custom-scroll" style={{ height: "calc(100vh - 360px)" }}>
            <div className="p-6">
              <BlogPreview title={title} coverImage={coverImage} content={content} tags={tags} />
            </div>
          </div>
        </div>

      </div>

    </AdminLayout_New>
  );
}
