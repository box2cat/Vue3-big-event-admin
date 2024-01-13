import request from '@/utils/request'

// 分类：
export const artGetChannelsService = () => request.get('/my/cate/list')
export const artAddChannelService = (data) => request.post('/my/cate/add', data)
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)
export const artDeleteChannelService = (id) =>
  request.delete('/my/cate/del', { params: { id: id } })

// 文章：
export const artGetListService = (params) =>
  request.get('/my/article/list', { params: params })
export const artAddService = (data) => request.post('/my/article/add', data)
export const artGetDetailService = (id) =>
  request.get('/my/article/info', { params: { id } })
export const artUpdateService = (data) => request.put('/my/article/info', data)
