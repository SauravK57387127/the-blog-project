// Handles all blog CRUD for admin circle
export default {
  // List every blog (any status) with pagination / filters
  list: async ({ page, status }) => { /* TODO */ },

  // Persist a brand‑new blog as published
  create: async (blogData) => { /* TODO */ },

  // Draft helpers
  listDrafts: async () => { /* TODO */ },
  updateDraft: async (draftId, updates) => { /* TODO */ },
  deleteDraft: async (draftId) => { /* TODO */ },

  // Update / delete live blog
  update: async (blogId, updates) => { /* TODO */ },
  remove: async (blogId) => { /* TODO */ },

  // Publish now (status → published)
  publishNow: async (blogId) => { /* TODO */ },

  // Schedule publish via BullMQ
  schedulePublish: async (blogId, scheduleAt) => { /* TODO */ },
};
