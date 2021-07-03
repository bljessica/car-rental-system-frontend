import request from './request'

// 注册
function register (data) {
  return request('/register', 'POST', data);
}

export default {
  register
}
