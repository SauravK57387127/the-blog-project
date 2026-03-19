/**
 * Module-level token store
 * Solves the problem of needing Clerk's getToken inside axios interceptors,
 * which run outside React — hooks can't be called there.
 */

let _tokenGetter = null;
let _adminToken = null;

/** Called once from ClerkProvider wrapper to register Clerk's getToken */
export const setTokenGetter = (fn) => {
  _tokenGetter = fn;
};

/** Returns Clerk JWT for user endpoints */
export const getAuthToken = async () => {
  if (!_tokenGetter) return null;
  try {
    return await _tokenGetter();
  } catch {
    return null;
  }
};

/** Store admin JWT after successful login */
export const setAdminToken = (token) => {
  _adminToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token);
  }
};

/** Get admin JWT — checks memory first, then localStorage */
export const getAdminToken = () => {
  if (_adminToken) return _adminToken;
  if (typeof window !== 'undefined') {
    _adminToken = localStorage.getItem('adminToken');
    return _adminToken;
  }
  return null;
};

/** Clear admin JWT on logout */
export const clearAdminToken = () => {
  _adminToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
  }
};
