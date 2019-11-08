import request from '@/utils/request'

export function getMallInfo(actCode) {
  return request({
    url: 'api/' + actCode + '/mallInfo',
    method: 'get'
  })
}

export function getLinkData(actCode) {
  return request({
    url: 'api/' + actCode + '/actSpecLink',
    method: 'get'
  })
}

export function getDrawData(actCode) {
  return request({
    url: 'api/' + actCode + '/draw/list',
    method: 'get'
  })
}

export function uploadMall(actCode, data) {
  return request({
    url: 'api/' + actCode + '/mallInfo/upload',
    method: 'post',
    data
  })
}

export function saveMallInfo(actCode, data) {
  return request({
    url: 'api/' + actCode + '/mallInfo/save',
    method: 'post',
    data
  })
}

export function refresh(actCode, omsCode) {
  return request({
    url: 'api/' + actCode + '/mallInfo/refresh?omsCode=' + omsCode,
    method: 'post'
  })
}

export function addSpecLink(actCode, data) {
  return request({
    url: 'api/' + actCode + '/actSpecLink/add',
    method: 'post',
    data
  })
}

export function saveSpecLink(actCode, data) {
  return request({
    url: 'api/' + actCode + '/actSpecLink/save',
    method: 'post',
    data
  })
}

export function deleteSpecLink(actCode, data) {
  return request({
    url: 'api/' + actCode + '/actSpecLink/delete',
    method: 'post',
    data
  })
}

export function openDrawEdit(actCode, drawId) {
  return request({
    url: 'api/' + actCode + '/draw/' + drawId,
    method: 'get'
  })
}

export function drawAdd(actCode, data) {
  return request({
    url: 'api/' + actCode + '/draw/add',
    method: 'post',
    data
  })
}

export function drawSave(actCode, data) {
  return request({
    url: 'api/' + actCode + '/draw/save',
    method: 'post',
    data
  })
}

export function deleteDraw(actCode, drawId) {
  return request({
    url: 'api/' + actCode + '/draw/' + drawId,
    method: 'delete'
  })
}

export function getActList(size) {
  return request({
    url: 'api/actModule?size=' + size,
    method: 'get'
  })
}
