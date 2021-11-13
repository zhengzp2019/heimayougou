// pages/category/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],

    // 被点击的左侧菜单
    currentIndex: 0,

    scrollTop: 0
  },

  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCates();
    // 1.获取本地存储中的数据
    const Cates = wx.getStorageSync("cates");
    // 2.判断
    if (!Cates) {// 缓存中不存在数据 发送请求获取数据
      this.getCates();
    }
    else {// 本地缓存中存在旧数据
      if (Date.now() - Cates.time > 1000 * 5 * 60) {// 本地存储中数据过期,重新请求数据
        this.getCates();
      }
      else {// 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        // 重新设置右侧商品位置置顶
        this.setData({
          leftMenuList,
          rightContent,
          scrollTop: 0
        })
      }
    }
  },

  // 获取分类数据--异步请求
  //! es7语法
  async getCates() {
    const res = await request({ url: '/categories' });
    this.Cates = res;
    // 把接口数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    // 构造左侧的菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //map() 方法创建一个新数组，其结果是该数组中的每个元素调用一次提供的函数后的返回值
    // 构造右侧商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  //! es6语法
  // getCates() {
  //   request({ url: '/categories' })
  //     .then(res => {
  //       // console.log(res);
  //       this.Cates = res;
  //       // 把接口数据存入到本地存储中
  //       wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
  //       // 构造左侧的菜单数据
  //       let leftMenuList = this.Cates.map(v => v.cat_name);
  //       //map() 方法创建一个新数组，其结果是该数组中的每个元素调用一次提供的函数后的返回值
  //       // 构造右侧商品数据
  //       let rightContent = this.Cates[0].children;
  //       this.setData({
  //         leftMenuList,
  //         rightContent
  //       })
  //     })
  // },

  // 处理左侧点击事件
  handleItemTap(e) {
    // console.log(e);
    const { index } = e.currentTarget.dataset;
    // 构造右侧的商品数据
    let rightContent = this.Cates[index].children;

    this.setData({
      currentIndex: index,
      rightContent
    })
  }
})