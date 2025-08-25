import useDraftEditor from "@/hooks/admin/useDraftEditor";
import { CoverImage, DateTimePicker, Editor, EditorMenuBar, PublishButton, ScheduleButton, TagsInput, TitleInput } from "./blogEditorChildren";

export default function EditorWrapper({ draftId }) {
  const {
    title, setTitle,
    tags, setTags,
    coverImage, setCoverImage,
    dt, setDt,
    publishDraft, scheduleDraft,
    isSaving
  } = useDraftEditor({ draftId })


  return (
    //     <div className="space-y-4 p-4">
    // </div>

    <>
    <TitleInput title={title} setTitle={setTitle} />
    <TagsInput tags={tags} setTags={setTags} />
    <CoverImage coverImage={coverImage} setCoverImage={setCoverImage} /> 

          <div className="flex items-center gap-3">
    <PublishButton publishDraft={publishDraft} />
    <DateTimePicker value={dt} onChange={setDt}/>
    <ScheduleButton scheduleDraft={scheduleDraft} />
            <span className="text-sm opacity-70">{isSaving ? 'Saving…' : 'Saved'}</span>
</div>                  

    <Editor />
    <EditorMenuBar />
    </>
  )
}