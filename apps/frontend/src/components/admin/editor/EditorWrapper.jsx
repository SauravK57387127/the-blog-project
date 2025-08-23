import useDraftEditor from "@/hooks/admin/useDraftEditor";
import { CoverImage, DateTimePicker, Editor, EditorMenuBar, PublishButton, ScheduleButton, TagsInput, TitleInput } from "./blogEditorChildren";

export function EditorWrapper() {
    const {
    draftId,
    title, setTitle,
    coverImage, setCoverImage,
    tags, setTags,
    // content, setContent,
    publishDraft,
    scheduleDraft,
    // editor,
    dt, setDt
  } = useDraftEditor()

  return (
    <>
    <TitleInput title={title} setTitle={setTitle} />
    <CoverImage coverImage={coverImage} setCoverImage={setCoverImage} />                   
    <TagsInput tags={tags} setTags={setTags} />
    <PublishButton publishDraft={publishDraft} />
    <DateTimePicker value={dt} onChange={setDt}/>
    <ScheduleButton scheduleDraft={scheduleDraft} />
    <Editor />
    <EditorMenuBar />
    </>
  )
}