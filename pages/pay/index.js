import { request } from "../../request/index.js"
import { requestPayment, showToast } from "../../utils/asyncWx.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addorder_numbers: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  // 页面出现在前台时执行
  onShow: function () {
    // 获取缓存中收获地址
    const addorder_numbers = wx.getStorageSync("addorder_numbers");
    // 获取缓存中购物车数据
    let cart = wx.getStorageSync("cart") || [];
    cart = cart.filter(v => v.checked);
    let totalPrice = 0, totalNum = 0;

    cart.forEach(v => {
      totalNum += v.num;
      totalPrice += v.num * v.goods_price;
    });

    this.setData({
      cart,
      totalNum,
      totalPrice,
      addorder_numbers
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  async handleOrderPay(e) {
    try {
      // 1、创建订单
      // 从缓存中获取用户token，并判断是否存在
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }

      // 获取支付参数 生成订单号
      // const header = { Authorization: token };
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.addorder_numbers.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => {
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        });
      });

      const orderParams = { order_price, consignee_addr, goods }
      // 请求订单号
      const { order_number } = await request({
        url: "/my/orders/create", method: "post", data: orderParams
      });
      // 2、发起 预支付 接口
      const { pay } = await request({
        url: "/my/orders/req_unifiedorder", method: "post", data: { order_number }
      });
      console.log(pay);
      // // 3、发起微信支付
      // await requestPayment(pay);

      // // 4、查询订单状态
      // const res = await request({
      //   url: "/my/orders/chkOrder", method: "post", data: orderParams, header
      // });
      await showToast({ title: "支付成功" });
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);

      wx.navigateTo({
        url: '/pages/order/index',
      });

    } catch (error) {
      await showToast({ title: "支付失败" });
    }
  }
})