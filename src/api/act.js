import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/actInfo/add',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/actModule/' + id,
    method: 'delete'
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
