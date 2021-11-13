// pages/goods_list/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: [],
  },

  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    console.log(options.query);
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.QueryParams })
    const total = res.total;
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    // 关闭下拉loading样式
    wx.stopPullDownRefresh();
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // console.log(e);
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  // 页面上滑 滚动条触底事件
  onReachBottom() {
    if (this.QueryParams.pagenum < this.totalPages) {
      // 有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
    else {// 没有下一页数据
      wx.showToast({ title: '没有下一页数据' })
    }
  },

  // 下拉刷新事件
  onPullDownRefresh() {
    // 重置数组
    this.setData({
      goodsList: []
    });
    // 重置页面
    this.QueryParams.pagenum = 1;
    // 重新请求数据
    this.getGoodsList();
  }
})