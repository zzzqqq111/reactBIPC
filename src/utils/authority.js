// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

// 获取token
export function getToken() {
  return localStorage.getItem('bi-pc-token');
}

// 设置token
export function setToken(token) {
  return localStorage.setItem('bi-pc-token', token);
}

// 获取文件上传的token
export function getFileToken() {
  return localStorage.getItem('file-token');
}

// 设置文件上传的token
export function setFileToken(token) {
  return localStorage.setItem('file-token', token);
}

// 设置permiss
export function setPermiss(permiss) {
  return localStorage.setItem('bi-pc-permiss', permiss);
}

// 获取permiss
export function getPermiss() {
  return localStorage.getItem('bi-pc-permiss');
}

// 设置用户角色
export function setRole(id) {
  return localStorage.setItem('role', id);
}

// 获取用户角色
export function getRole() {
  return localStorage.getItem('role');
}

// 设置用户角色
export function setUserId(id) {
  return localStorage.setItem('my', id);
}

// 获取用户角色
export function getUserId() {
  return localStorage.getItem('my');
}
