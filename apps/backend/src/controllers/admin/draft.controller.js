import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import AdminDraftService from '../../services/admin/draft.service.js';

const AdminDraftController = ({ blogQueue }) => ({
    createDraft: asyncHandler(async (req, res) => {
        console.log('✅ create draft controller is reached!');
        console.log(`frontend data [req.body]: ${req.body}`);
        const result = await AdminDraftService.createDraft(req.body);
        if (!result.success) {
            console.error('CONTROLLER: Draft creation failed 🟥');
            return sendResponse({
                res,
                statusCode: 400,
                success: false,
                message: 'Draft creation failed',
                data: null,
            });
        }

        return sendResponse({
            res,
            statusCode: 201,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    listDrafts: asyncHandler(async (req, res) => {
        console.log('✅ list drafts controller reached!');
        const result = await AdminDraftService.listDrafts();

        return sendResponse({
            res,
            statusCode: result.success ? 200 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    listDrafts: asyncHandler(async (req, res) => {
        console.log('✅ list drafts controller reached!');
        const result = await AdminDraftService.listDrafts();

        return sendResponse({
            res,
            statusCode: result.success ? 200 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    blogAutoSave: asyncHandler(async (req, res) => {
        const result = await AdminDraftService.blogAutoSave(req.body);
        return sendResponse({
            res,
            statusCode: result.success ? 201 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    getDraftById: asyncHandler(async (req, res) => {
        const result = await AdminDraftService.getDraftById(req.params.id);

        sendResponse({
            res,
            statusCode: result.success ? 201 : 404,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    updateDraft: asyncHandler(async (req, res) => {
        console.log('✅ update draft controller reached!');
        console.log(`Draft ID: ${req.params.id}`);

        const result = await AdminDraftService.updateDraft(
            req.params.id,
            req.body,
        );

        return sendResponse({
            res,
            statusCode: result.success ? 200 : 404,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    deleteDraft: asyncHandler(async (req, res) => {
        console.log('✅ delete draft controller reached!');
        console.log(`Draft ID: ${req.params.id}`);

        const result = await AdminDraftService.deleteDraft(req.params.id);

        return sendResponse({
            res,
            statusCode: result.success ? 200 : 404,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    blogAutoSave: asyncHandler(async (req, res) => {
        const result = await AdminDraftService.blogAutoSave(req.body);
        return sendResponse({
            res,
            statusCode: result.success ? 201 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    publishBlog: asyncHandler(async (req, res) => {
        const result = await AdminDraftService.publishNow(req.body);
        sendResponse({
            res,
            statusCode: result.success ? 201 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    scheduleBlog: asyncHandler(async (req, res) => {
        const result = await AdminDraftService.scheduleBlog(req.body, {
            blogQueue,
        });
        sendResponse({
            res,
            statusCode: result.success ? 201 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),
});

export default AdminDraftController;
