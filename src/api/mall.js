import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/tbWapMall',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/tbWapMall/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mall',
    method: 'put',
    data
  })
}
export function async() {
  return request({
    url: 'api/mallBaseInfo/async',
    method: 'get'
  })
}
