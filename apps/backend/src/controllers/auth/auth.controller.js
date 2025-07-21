import { asyncHandler } from '../../utils/asyncHandler.js';
// import AuthService from '../../services/auth/auth.service.js';

export default {
  register: asyncHandler(async (req, res) => {
    res.json({ msg: 'signup stub' });
  }),

  login: asyncHandler(async (req, res) => {
    res.json({ msg: 'login stub' });
  }),

  logout: asyncHandler(async (_req, res) => {
    res.json({ msg: 'logout stub' });
  }),

  me: asyncHandler(async (_req, res) => res.json({ msg: 'me stub' })), // ← add this


  refreshAccessToken: asyncHandler(async (_req, res) => {
    res.json({ msg: 'refresh token stub' });
  }),
};
