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
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退货/退款",
        isActive: false
      }
    ],
    orders: []
  },

  onShow: function () {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }

    // 页面出现在前台时执行
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const { type } = currentPage.options;
    this.changeTitleByIndex(type - 1);
    // token存在，请求订单
    this.getOrders(type);
  },

  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    this.getOrders(index + 1);
  },

  // 获取订单
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } });
    this.setData({
      // ?map括号中的是什么意思
      orders: res.orders.map(v => ({ ...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
  })
  }
})