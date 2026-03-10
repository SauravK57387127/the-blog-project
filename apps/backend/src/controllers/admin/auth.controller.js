import authService from '../../services/admin/auth.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { getClientIP } from '../../utils/adminAuth.js';

export default {
  
  /**
   * POST /api/admin/auth/login
   * 
   * Body: { username, password }
   * Returns: { accessToken, refreshToken, admin }
   */
  login: async (req, res) => {
    console.log('\n📥 Login Controller - START');

    const { username, password } = req.body;

    // Validate request body
    if (!username || !password) {
      console.log('❌ Missing username or password');
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'Username and password required'
      });
    }

    // Extract request metadata for security
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    console.log(`📍 IP: ${ipAddress}`);
    console.log(`🖥️  Device: ${userAgent}`);

    // Call service
    const result = await authService.login({
      username,
      password,
      ipAddress,
      userAgent
    });

    // Determine status code based on result
    const statusCode = result.success ? 200 : 401;

    // If login successful, set refresh token as httpOnly cookie
    if (result.success) {
      res.cookie('adminRefreshToken', result.data.refreshToken, {
        httpOnly: true,        // Can't be accessed by JavaScript (XSS protection)
        // secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
        sameSite: 'strict',    // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
      });

      console.log('🍪 Refresh token set as httpOnly cookie');

      // Don't send refresh token in response body (already in cookie)
      delete result.data.refreshToken;
    }

    console.log('✅ Login Controller - END\n');

    return sendResponse({
      res,
      statusCode,
      success: result.success,
      message: result.message,
      data: result.data
    });
  },



  
  /**
   * POST /api/admin/auth/refresh
   * 
   * Body: {} (refresh token from cookie)
   * Returns: { accessToken, admin }
   */
  refresh: async (req, res) => {
    console.log('\n📥 Refresh Controller - START');

    // Get refresh token from cookie
    const refreshToken = req.cookies?.adminRefreshToken;

    if (!refreshToken) {
      console.log('❌ No refresh token in cookie');
      return sendResponse({
        res,
        statusCode: 401,
        success: false,
        message: 'Refresh token not found'
      });
    }

    // Extract request metadata
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Call service
    const result = await authService.refresh({
      refreshToken,
      ipAddress,
      userAgent
    });

    const statusCode = result.success ? 200 : 401;

    console.log('✅ Refresh Controller - END\n');

    return sendResponse({
      res,
      statusCode,
      success: result.success,
      message: result.message,
      data: result.data
    });
  },

  /**
   * POST /api/admin/auth/logout
   * 
   * Body: {} (needs admin authentication)
   * Returns: { message: "Logged out" }
   */
  logout: async (req, res) => {
    console.log('\n📥 Logout Controller - START');

    // Get refresh token from cookie
    const refreshToken = req.cookies?.adminRefreshToken;
    
    // Get admin ID from middleware (req.admin set by requireAdmin middleware)
    const adminId = req.admin?.id;

    if (!refreshToken) {
      console.log('❌ No refresh token in cookie');
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'No active session found'
      });
    }

    // Extract request metadata
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Call service
    const result = await authService.logout({
      refreshToken,
      adminId,
      ipAddress,
      userAgent
    });

    // Clear refresh token cookie
    res.clearCookie('adminRefreshToken', {
      httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    console.log('🍪 Refresh token cookie cleared');
    console.log('✅ Logout Controller - END\n');

    return sendResponse({
      res,
      statusCode: 200,
      success: result.success,
      message: result.message,
      data: result.data
    });
  },

  /**
   * POST /api/admin/auth/revoke-all-sessions
   * 
   * Revoke all refresh tokens (logout from all devices)
   * Useful if admin suspects account compromise
   */
  revokeAllSessions: async (req, res) => {
    console.log('\n📥 Revoke All Sessions Controller - START');

    const adminId = req.admin?.id;
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Call service
    const result = await authService.revokeAllSessions({
      adminId,
      ipAddress,
      userAgent
    });

    // Clear current refresh token cookie
    res.clearCookie('adminRefreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    console.log('✅ Revoke All Sessions Controller - END\n');

    return sendResponse({
      res,
      statusCode: 200,
      success: result.success,
      message: result.message,
      data: result.data
    });
  },

  /**
   * GET /api/admin/auth/me
   * 
   * Get current admin info (verify token is still valid)
   * Returns: { admin: { id, username, role } }
   */
  me: async (req, res) => {
    console.log('\n📥 Get Current Admin - START');

    // req.admin is set by requireAdmin middleware
    const admin = req.admin;

    console.log(`✅ Admin: ${admin.username} (ID: ${admin.id})`);
    console.log('✅ Get Current Admin - END\n');

    return sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: 'Admin info retrieved',
      data: {
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role
        }
      }
    });
  }
};
