import request from '@/utils/request'

export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })
export const userGetInfoService = () => request.get('/my/userinfo')
export const userUpdateInfoService = (data) => request.put('/my/userinfo', data)
// patch和put请求一样，body数据在第二个参数，但avatar没有封装为json,因此这里加{}号
export const userUpdateAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })
export const userUpdatePasswordService = (data) =>
  request.patch('/my/updatepwd', data)
