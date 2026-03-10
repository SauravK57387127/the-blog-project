import { Router } from 'express';
import { publicRateLimit } from '../../middlewares/rateLimiter.middleware.js';
import blogRoutes from './blog.route.js';
import homepageRoutes from './homepage.route.js';
import searchRoutes from './search.route.js';  // ← ADD THIS
import viewTrackingRoutes from './viewTracking.route.js';
import commentRoutes from './comment.route.js';
import authorRoutes from './author.route.js';
import newsletterRoutes from './newsletter.route.js';

export default () => {
  const router = Router();

  router.use(publicRateLimit);

  router.use('/blogs', blogRoutes);
  router.use('/homepage', homepageRoutes);
  router.use('/search', searchRoutes);  // ← ADD THIS
  router.use('/views', viewTrackingRoutes);
  router.use('/comments', commentRoutes);
  router.use('/authors', authorRoutes);
router.use('/newsletter', newsletterRoutes);

  return router;
};
