//Page Object
import { request } from "../../request/index.js";
Page({
  data: {
    // 轮播图数组
    swiperList: [],

    // 导航 数组
    cateList: [],

    // 楼层数组
    floorList: []
  },
  //options(Object)
  onLoad: function (options) {
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });
    this.getSwipterList();
    this.getCateList();
    this.getFloorList();
  },

  // 获取轮播图数据
  getSwipterList() {
    request({ url: '/home/swiperdata' })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },

  // 获取导航栏数据
  getCateList() {
    request({ url: '/home/catitems' })
      .then(result => {
        this.setData({
          cateList: result
        })
      })
  },

  // 获取楼层数据
  getFloorList() {
    request({ url: '/home/floordata' })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  }
});