import { models } from '../../../database/index.js';

const { Comment } = models;

export async function createComment(blogId, userId, overrides = {}) {
    return Comment.create({
        blogId,
        userId,
        content: 'Test comment content',
        parentId: null,
        ...overrides,
    });
}
