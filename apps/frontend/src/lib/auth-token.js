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
  document.cookie = `adminToken=${token}; path=/; max-age=${15 * 60}; SameSite=Strict`;
};
export const getAdminToken = () => {
  return document.cookie.split('; ').find(r => r.startsWith('adminToken='))?.split('=')[1] ?? null;
};
export const clearAdminToken = () => {
  document.cookie = `adminToken=; path=/; max-age=0; SameSite=Strict`;
};
