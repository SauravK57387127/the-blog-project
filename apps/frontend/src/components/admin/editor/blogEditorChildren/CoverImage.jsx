
export function CoverImage({coverImage, setCoverImage}) {
  return (
    <input
      type="text"
    placeholder="Paste cover image URL"
    value={coverImage || ''}
    onChange={(e) => setCoverImage(e.target.value)} 
    />
  )
}
