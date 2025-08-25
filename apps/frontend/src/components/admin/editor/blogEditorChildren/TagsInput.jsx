import { useState } from "react";


export function TagsInput({ tags, setTags }) {
const [input, setInput] = useState((tags || []).join(", "));

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setTags(
      value.split(",").map(t => t.trim()).filter(Boolean)
    );
  };

  return (
    <input
      value={input || ''}
      onChange={handleChange}
      placeholder="tag1, tag2, tag3"
    />
  );
}


