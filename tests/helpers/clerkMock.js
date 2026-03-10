jest.mock('@clerk/express', () => ({
  ClerkExpressWithAuth: () => (req, res, next) => {
    const testUserId = req.get('x-test-user-id');
    req.auth = testUserId ? { userId: testUserId } : null;
    next();
  },
  requireAuth: () => (req, res, next) => {
    if (!req.auth?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  }
}));
