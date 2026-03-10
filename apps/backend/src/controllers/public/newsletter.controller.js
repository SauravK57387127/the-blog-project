import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import NewsletterService from '../../services/public/newsletter.service.js';

export default {
  subscribe: asyncHandler(async (req, res) => {
    const { email, source = 'newsletter_page' } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];

    if (!email) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'Email required',
        data: null,
      });
    }

    const result = await NewsletterService.subscribe({
      email,
      source,
      ipAddress,
    });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  unsubscribeByToken: asyncHandler(async (req, res) => {
    const { token } = req.params;

    const result = await NewsletterService.unsubscribeByToken(token);

    // Redirect to a confirmation page or send response
    if (result.success) {
      res.send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1>Unsubscribed Successfully</h1>
            <p>You've been unsubscribed from our newsletter.</p>
            <p><a href="/">Return to homepage</a></p>
          </body>
        </html>
      `);
    } else {
      res.status(400).send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1>Error</h1>
            <p>${result.message}</p>
          </body>
        </html>
      `);
    }
  }),
};
