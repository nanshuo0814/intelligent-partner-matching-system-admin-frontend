import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/user/get/login',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

// 上传用户头像请求函数
export function uploadAvatar(data) {
  return request({
    url: '/api/file/upload', // 假设这是上传头像的后端接口地址，根据实际情况修改
    method: 'post',
    data
  });
}

export function updateUserInfo(data) {
  return request({
    url: '/api/user/update',
    method: 'post',
    data
  })
}

export function searchUserInfo(data) {
  return request({
    url: '/api/user/list/page',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/user/delete',
    method: 'post',
    data
  })
}

export function updateUserPwd(data) {
  return request({
    url: '/api/user/pwd/update',
    method: 'post',
    data
  })
}

export function addUserInfo(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

export function resetUserPwd(data) {
  return request({
    url: '/api/user/pwd/reset/byAdmin',
    method: 'post',
    data
  })
}

export function getUserGrowth() {
  return request({
    url: '/api/user/growth',
    method: 'get',
  })
}