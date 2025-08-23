

export function TitleInput({title, setTitle}) {
  return (
    <input
      value={title || ''}
      onChange={e => setTitle(e.target.value)}
      placeholder="Enter blog title..."
    />
  )
}

