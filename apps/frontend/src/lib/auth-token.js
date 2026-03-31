let _tokenGetter = null;
let _adminToken = null;

export const setTokenGetter = (fn) => {
  _tokenGetter = fn;
};

export const getAuthToken = async () => {
  if (!_tokenGetter) return null;
  try {
    return await _tokenGetter();
  } catch {
    return null;
  }
};

export const setAdminToken = (token) => {
  _adminToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token);
    // Also set cookie so middleware can read it (httpOnly=false needed for JS access)
    document.cookie = `adminToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  }
};

export const getAdminToken = () => {
  if (_adminToken) return _adminToken;
  if (typeof window !== 'undefined') {
    _adminToken = localStorage.getItem('adminToken');
    return _adminToken;
  }
  return null;
};

export const clearAdminToken = () => {
  _adminToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
    // Clear cookie
    document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Lax';
  }
};
