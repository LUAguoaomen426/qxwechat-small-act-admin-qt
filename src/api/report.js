import request from '@/utils/request'

export function analysisPVUVData(data) {
  return request({
    url: 'api/analysisPVUVData',
    method: 'post',
    data
  })
}

export function number(source) {
  return request({
    url: 'api/number?source=' + source,
    method: 'get'
  })
}

export function analysisFlopData(data) {
  return request({
    url: 'api/analysisFlopData',
    method: 'post',
    data
  })
}

export function analysisLuckyData(data) {
  return request({
    url: 'api/analysisLuckyData',
    method: 'post',
    data
  })
}

export function groupCount(source) {
  return request({
    url: 'api/findGroupCountBySource?source=' + source,
    method: 'get'
  })
}

export function addGroupNumber(source, peopleNum) {
  return request({
    url: 'api/addGroupNumber?source=' + source + '&addGroupNumber=' + peopleNum,
    method: 'post'
  })
}

export function addTicketNumber(source, data) {
  return request({
    url: 'api/addTicketNumber?source=' + source,
    method: 'post',
    data
  })
}

export function getBtnDailyReport(params) {
  return request({
    url: 'api/btnDaily',
    method: 'get',
    params: params
  })
}

// 获取字典
export function getDictTree(source) {
  return request({
    url: 'api/report/dict/tree/' + source,
    method: 'get'
  })
}

export function getSignUpFormParam(source) {
  return request({
    url: 'api/signUpFormParam/' + source,
    method: 'get'
  })
}

export function getSignUpData(source, params) {
  return request({
    url: 'api/signUpData/' + source,
    method: 'get',
    params
  })
}

export function getBtnSummary(data) {
  return request({
    url: 'api/btnDailySummary',
    method: 'get',
    params: data
  })
}
