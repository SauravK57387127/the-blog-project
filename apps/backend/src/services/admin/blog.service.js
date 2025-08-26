import Blog from "../../../../../database/models/blog.model.js";
import Draft from "../../../../../database/models/draft.model.js"
import { blogQueue } from "../../../../../infra/bullmq/queues/blogQueue.js"

import mongoose from "mongoose";
import { slugify } from "../../utils/slugify.js";


export default {
  // Draft helpers
  createDraft: async (draftData) => {
    console.log('create draft SERVICE reached!! ✅')
    const draft = await Draft.create(draftData);

    if (!draft) {
          console.error("SERVICE: Draft creation failed 🟥");
        return { success: false, message: "Draft creation failed 🟥", data: null };
    } else {
        console.log('Draft created ✅')
        console.log(`Draft: ${draft}`)
    }
    // if (!draft) throw new Error("Failed to create draft");

    return { success: true, message: "Draft created ✅", data: draft };
  },

  listDrafts: async () => {
    console.log('list draft SERVICE reached!! ✅')

    const drafts = await Draft.find().sort({ updatedAt: -1 });
    if (drafts.length === 0) {
  console.warn("SERVICE: no drafts found");
  return { success: true, message: "No drafts found!!", data: [] };
}
    return { success: true, message: "No drafts found!!", data: drafts };
  },

  blogAutoSave: async ({ _id, title, content, coverImage, tags }) => {
//   if (!Draft) throw new Error("Draft model not available");
//   if (!title?.trim()) throw new Error("Title is required");
//   if (!content) throw new Error("Content is required");
    
    // if (!Draft) return { success: false, message: "Draft model not available 🟥", data: null };
    // if (!title?.trim()) return { success: false, message: "Title is empty, draft not created 🟥" };
    // if (!content) return { success: false, message: "Content is empty, draft not created 🟥" };


  try {
    if (_id) {
      // Update existing draft
      const updated_draft = await Draft.findByIdAndUpdate(
        _id,
        {
          title: title.trim(),
          content,
          coverImage: coverImage || null,
          tags: Array.isArray(tags) ? tags : [],
          updatedAt: new Date(),
          autosaveAt: new Date()
        },
        { new: true }
      );
      return {success: true, message: 'Draft Updated! ✅', data: updated_draft}

    } else {
      // Create new draft
      const new_draft_created = await Draft.create({
        title: title.trim(),
        content,
        coverImage: coverImage || null,
        tags: Array.isArray(tags) ? tags : []
      });
      return {success: true, message: 'New Draft created !!', data: new_draft_created}
    }
  } catch (error) {
    console.error(`SERVICE: auto-save failed 🟥 => ${error.message}`)
    // throw new Error(`Autosave failed: ${error.message}`);
  }
},

//     updateDraft: async (draftId, updates) => {
//     // if (!Draft) throw new Error("Draft model not available");
//     // if (!mongoose.Types.ObjectId.isValid(draftId)) throw new Error("Invalid draft ID format");

//     if (!Draft) return { found: false, message: "Draft model not available" };
//     if (!mongoose.Types.ObjectId.isValid(draftId)) return { found: false, message: "Invalid draft ID" };


//   return await Draft.findByIdAndUpdate(
//     draftId,
//     {
//       ...updates,
//       updatedAt: new Date()
//     },
//     { new: true }
//   );
// },

  getDraftById: async (draftId) => {
    // if (!Draft || typeof Draft.findById !== 'function') throw new Error("Draft model not created yet");
    // if (!mongoose.Types.ObjectId.isValid(draftId)) throw new Error("Invalid draft ID format");

    // OLD generation code

    // if (!Draft || typeof Draft.findById !== 'function') {
    // return { found: false, message: "Draft model not created yet", draft: null };
    // }                                                                                                            
    // if (!mongoose.Types.ObjectId.isValid(draftId)) {
    // return { found: false, message: "Invalid draft ID format", draft: null };
    // }


  const draft = await Draft.findById(draftId).lean();

  if (!draft) {
    return { success: false, message: "Draft not found 🟥", draft: null };
  }

  return { success: true, message: "Draft fetched! ✅", draft };
},


  // Publish now (status → published)
  publishNow: async ({ title, content, tags, category, _id }) => {
    // if (!Blog) throw new Error('Blog model not available');
    // if (draftId && !Draft) throw new Error('Draft model not available');

    // if (!Blog) return { success: false, message: "Blog model not available", data: null };
    // if (draftId && !Draft) return { success: false, message: "Draft model not available", data: null };

    const slug = slugify(title)

    const blog = new Blog({
      title, slug, content, tags, category,
      status: "published",
      publishedAt: new Date(),
    });

    const savedBlog = await blog.save()
    console.log(`Blog created => ${savedBlog} ✅✅`);

    if(_id){
      await Draft.findByIdAndDelete(draftId);
      console.log('🗑️ Draft deleted after publish:', _id, '✅✅✅');
    }

    return { success: true, message: "Blog published ✅", data: savedBlog};
  },


  // if (!Blog) throw new Error('Blog model not available');
 // if (draftId && !Draft) throw new Error('Draft model not available');
  // Schedule publish via BullMQ
scheduleBlog: async ({ title, content, tags, category, draftId, scheduleAt }) => {
    if(!draftId) return { success: false, message: 'draft Id not present ❌❌', data: null}
  if (!Blog) return { success: false, message: "Blog model not available", data: null };
  if (draftId && !Draft) return { success: false, message: "Draft model not available", data: null };

    const slug = slugify(title)
  const blog = new Blog({ title, slug, content, tags, category, scheduleAt, status: "scheduled" });

  const delay = new Date(scheduleAt) - Date.now();

  // ⏱ If scheduleAt is now/past => publish immediately
  if (delay <= 0) {
    blog.status = "published";
    blog.publishedAt = new Date();
    await blog.save();
    console.log("⏱ Schedule time already passed → published immediately.");

    if (draftId) {
      await Draft.findByIdAndDelete(draftId);
      console.log('🗑️ Draft deleted after publish:', draftId);
    }

    return { success: false, message: "Draft created ✅ | Published IMMEDIATELY ❌", data: blog };
  }

  try {
    await blogQueue.add("publish-blog", { blogId: blog._id }, { delay });
    await blog.save();
    console.log(`🎯 Blog scheduled!! at: ${scheduleAt}`);
    return { success: true, message: "Draft created ✅", data: blog };
  } catch (err) {
    console.log(`This error occurred while scheduling: ${err}`);
    blog.status = "published";
    blog.publishedAt = new Date();
    await blog.save();
    console.log("Scheduling failed so PUBLISHED immediately.");

    if (draftId) {
      await Draft.findByIdAndDelete(draftId);
      console.log('🗑️ Draft deleted after schedule:', draftId);
    }

    return { success: false, message: "Draft created ✅ | Published IMMEDIATELY ❌", data: blog };
  }
}

};

