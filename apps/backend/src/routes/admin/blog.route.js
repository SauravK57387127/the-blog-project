import { Router } from 'express';
import AdminBlogController from '../../controllers/admin/blog.controller.js';

 
const router = Router();

// /api/admin/blogs

router.post('/publish-draft', AdminBlogController.publishBlog);
router.post('/schedule-draft', AdminBlogController.scheduleBlog);

router.post('/drafts/create-draft', AdminBlogController.createDraft)
router.get('/drafts/list-drafts', AdminBlogController.listDrafts);              // lists all drafts
router.get('/drafts/:id', AdminBlogController.getDraftById);
router.post('/drafts/:id/autosave', AdminBlogController.blogAutoSave)
// router.post('/drafts/:id', AdminBlogController.updateDraft);    // CRUD on a particular draft


// router.get('/', AdminBlogController.list);
// router.post('/', AdminBlogController.create);

// router.delete('/drafts/:draftId', AdminBlogController.deleteDraft);

// router.put('/:blogId', AdminBlogController.update);
// router.delete('/:blogId', AdminBlogController.remove);

// router.post('/:blogId/publish', AdminBlogController.publishNow);


 

export default router;






 

// ---

// ### ✅ 7. Drafting Strategy (Senior-Level Logic)

// What an SDE-3 would do:

// * **Frontend**: debounce input (e.g., 3–5 sec after stop typing)
// * **Also**: on `visibilitychange` (tab close/switch), trigger save
// * **Backend**: POST to `/admin/drafts/save`
// * Store to `Draft` model via upsert (`authorId` + `draftId`)
// * Optional: use `localStorage` as backup + sync on reconnect

// ⛔ Don’t save on every keystroke
// ✅ Combine: debounce + tab-close + interval (fallback)

// ---

