import request from './request'

// 注册
function register (data) {
  return request('/register.php', 'POST', data);
}

// 登录
function login (data) {
  return request('/login.php', 'POST', data);
}

// 提交事故信息
function addAccident (data) {
  return request('/accident.php', 'POST', data);
}

// 评价
function addComment (data) {
  return request('/comment.php', 'POST', data);
}

// 发布车辆
function releaseCar (data) {
  return request('/addCar.php', 'POST', data);
}

// 租车
function rent (data) {
  return request('/rent.php', 'POST', data);
}

// 删除车辆
function deleteCar (data) {
  return request('/deleteCar.php', 'POST', data);
}

// 获取车辆
function getCars (data) {
  return request('/getCars.php', 'POST', data);
}

export default {
  register,
  login,
  addAccident,
  addComment,
  releaseCar,
  rent,
  deleteCar,
  getCars
}
