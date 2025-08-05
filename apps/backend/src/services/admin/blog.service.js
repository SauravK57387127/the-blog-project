import Blog from "../../../../../database/models/blog.model.js";
import Draft from "../../../../../database/models/draft.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js";                 // will cause error without .js
import { blogQueue } from "../../../../../infra/bullmq/queues/blogQueue.js"


export default {
  // Draft helpers
  listDrafts: asyncHandler(async () => {
  const drafts = await Draft.find().sort({ updatedAt: -1 });
  return drafts;
}),

  blogAutoSave: asyncHandler( async ({ _id, title, content, coverImage, tags }) => {
  if (_id) {
    return await Draft.findByIdAndUpdate(_id, {
      title,
    //   slug, // Add this
      content,
      coverImage,
      tags, // Add this
      updatedAt: new Date(),
      autosaveAt: new Date()
    }, { new: true });
  } else {
    return await Draft.create({ 
      title, 
    //   slug: slug || slugify(title), // Add this
      content, 
      coverImage,
      tags: tags || [] // Add this
    });
  }
}),

    updateDraft: async (draftId, updates) => {
    return await Draft.findByIdAndUpdate(draftId, updates, { new: true });
},

    getDraftById: async (draftId) => {
  return await Draft.findById(draftId);
},

  // Publish now (status → published)
  publishNow: asyncHandler( async ({ title, slug, content, tags, category, draftId, scheduleAt }) => {
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
  }),

  

  // Schedule publish via BullMQ
  scheduleBlog: asyncHandler( async ({ title, slug, content, tags, category, draftId, scheduleAt }) => {
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
  })
};

