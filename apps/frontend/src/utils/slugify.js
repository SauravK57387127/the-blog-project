export function slugify(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // removes emojis/symbols
        .trim()
        .replace(/\s+/g, "-"); // replaces spaces with dash
}
