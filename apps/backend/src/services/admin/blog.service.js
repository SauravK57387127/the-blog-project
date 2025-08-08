import Blog from "../../../../../database/models/blog.model.js";
import Draft from "../../../../../database/models/draft.model.js"
import { blogQueue } from "../../../../../infra/bullmq/queues/blogQueue.js"

import mongoose from "mongoose";


export default {
  // Draft helpers
  listDrafts: async () => {
    if (!Draft) return [];
    const drafts = await Draft.find().sort({ updatedAt: -1 });
    return drafts;
  },

  blogAutoSave: async ({ _id, title, content, coverImage, tags }) => {
  if (!Draft) throw new Error('Draft model not available');
  if (!title?.trim()) throw new Error('Title is required');
  
  try {
    if (_id) {
      return await Draft.findByIdAndUpdate(_id, {
        title: title.trim(),
        //   slug, // Add this
        content, 
        coverImage,
        tags,
        updatedAt: new Date(),
        autosaveAt: new Date()
      }, { new: true });
    } else {
      return await Draft.create({ 
        title: title.trim(), 
        content, 
        coverImage,
        tags: tags || []
      });
    }
  } catch (error) {
    throw new Error(`Autosave failed: ${error.message}`);
  }
},

    updateDraft: async (draftId, updates) => {
        if (!Draft) throw new Error('Draft model not available');
    return await Draft.findByIdAndUpdate(draftId, updates, { new: true });
  },

  getDraftById: async (draftId) => {
  if (!Draft || typeof Draft.findById !== 'function') {
    return { found: false, message: "Draft model not created yet", draft: null };
  }

  if (!mongoose.Types.ObjectId.isValid(draftId)) {
    return { found: false, message: "Invalid draft ID format", draft: null };
  }

  const draft = await Draft.findById(draftId).lean();

  if (!draft) {
    return { found: false, message: "Draft not found", draft: null };
  }

  return { found: true, message: "Draft fetched", draft };
},

  // Publish now (status → published)
  publishNow: async ({ title, slug, content, tags, category, draftId, scheduleAt }) => {
    if (!Blog) throw new Error('Blog model not available');
  if (draftId && !Draft) throw new Error('Draft model not available')

    const blog = new Blog({
      title, slug, content, tags, category, scheduleAt,
      status: "published",
      publishedAt: new Date(),
    });

    const savedBlog = await blog.save()
    console.log(`Blog created => ${savedBlog}`);

    if(draftId){
      await Draft.findByIdAndDelete(draftId);
      console.log('🗑️ Draft deleted after publish:', draftId);
    }

    return savedBlog;
  },

  // Schedule publish via BullMQ
  scheduleBlog: async ({ title, slug, content, tags, category, draftId, scheduleAt }) => {
     if (!Blog) throw new Error('Blog model not available');
  if (draftId && !Draft) throw new Error('Draft model not available');
  
    const blog = new Blog({ title, slug, content, tags, category, scheduleAt, status: "scheduled" });

    const delay = new Date(scheduleAt) - Date.now();
    let scheduled = true;

    try {
      await blogQueue.add("publish-blog", { blogId: blog._id }, { delay });
      await blog.save();                          // Save as "scheduled" 
      console.log(`🎯 Blog scheduled!!`)
      console.log(`Scheduled at: ${scheduleAt}`)
      scheduled = true;
    } catch (err) {
      console.log(`This error occurred while scheduling: ${err}`)

      // Redis down = publish immediately instead
      blog.status = "published";
      blog.publishedAt = new Date();
      await blog.save();                          // Save as "published"
      console.log("Scheduling failed so PUBLISHED immediately.")
      scheduled = false;
    }

    if (draftId) {
      await Draft.findByIdAndDelete(draftId);
      console.log('🗑️ Draft deleted after schedule:', draftId);
    }

    return { blog, scheduled };
  }
};

