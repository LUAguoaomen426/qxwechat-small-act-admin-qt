import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/actInfo/add',
    method: 'post',
    data
  })
}

export function del(actCode) {
  return request({
    url: 'api/actInfo/delete?actCode=' + actCode,
    method: 'post'
  })
}

export function enable(actCode) {
  return request({
    url: 'api/actInfo/enable?actCode=' + actCode,
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: 'api/actInfo/save',
    method: 'post',
    data
  })
}

export function changeLevel(data) {
  return request({
    url: 'api/actInfo/changeLevel?actCode=' + data.actCode + '&isDown=' + data.isDown,
    method: 'post'
  })
}
