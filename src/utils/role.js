import { getPermiss, getRole, getUserId } from '@/utils/authority';

function getUserInfo() {
  return new Promise(resolve => {
    /* eslint-disable no-underscore-dangle */
    window.g_app._store
      .dispatch({
        type: 'userManage/fetchDetail',
        payload: { userId: getUserId() },
      })
      .then(res => {
        window.globalInfo = true;
        resolve(res.user[0] || {});
      });
  });
}

export function isAdmin() {
  const role = getRole();
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return true;
  }
  return false;
}

export async function isAdmin2() {
  const role = getRole();
  let info = {};
  if (!window.globalInfo) {
    info = (await getUserInfo()) || {};
  }
  if (role === 'SUPER_ADMIN' || info.allowDownload) {
    return true;
  }
  return false;
}

export function hasPermiss(key, url, dispatch) {
  const newPermiss = getPermiss();
  newPermiss.forEach(item => {
    if (item === key) {
      dispatch({
        type: url,
        payload: true,
      });
    }
  });
}
