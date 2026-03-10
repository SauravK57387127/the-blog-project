import { sendResponse } from '../../utils/sendResponse.js';
import AdminHomeService from '../../services/admin/home.service.js';


export default {
  /**
   * GET /api/admin/home
   * Dashboard overview
   */
  getDashboard: async (req, res) => {
    console.log('🏠 Admin home dashboard controller reached!');

    const result = await AdminHomeService.getDashboard();

    return sendResponse({
      res,
      statusCode: result.success ? 200 : 500,
      success: result.success,
      message: result.message,
      data: result.data
    });
  }
};