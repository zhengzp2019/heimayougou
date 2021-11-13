import { getUserProfile, login } from "../../utils/asyncWx.js"
import { request } from "../../request/index.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  // 处理用户授权事件
  async handleGetUserInfo(e) {
    // 获取用户个人信息
    const res = await getUserProfile({ desc: '用于展示用户信息' });
    const { encryptedData, rawData, iv, signature } = res;
    // 获取用户登陆后的code
    const { code } = await login();
    const loginParams = { encryptedData, rawData, iv, signature, code };
    // 发送请求 获取用户token
    const token = await request({ url: '/users/wxlogin', data: loginParams, method: 'post' });
    // 将token存储在缓存中 并跳转回之前的页面
    wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
    wx.navigateBack({
      delta: 1
    });
  }
})