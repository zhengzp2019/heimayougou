import { getUserProfile } from "../../utils/asyncWx.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  async handleGetUserInfo(e) {
    const res = await getUserProfile({ desc: '用于展示用户信息' });
    const { userInfo } = res;
    // console.log(userInfo);
    wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})