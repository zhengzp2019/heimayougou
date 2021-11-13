import { chooseAddress, showModal, showToast } from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  // 页面出现在前台时执行
  onShow: function () {
    // 获取缓存中收获地址
    const address = wx.getStorageSync("address");
    // 获取缓存中购物车数据
    let cart = wx.getStorageSync("cart") || [];
    this.setData({ address });

    this.setCart(cart);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  async handleChooseAddress() {

    let address = await chooseAddress();
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    wx.setStorageSync("address", address);
  },

  // 商品选中事件
  handeItemChange(e) {
    // 获取商品id
    const goods_id = e.currentTarget.dataset.id;
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },

  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let totalPrice = 0, totalNum = 0;
    let allChecked = true;

    cart.forEach(v => {
      if (v.checked) {
        totalNum += v.num;
        totalPrice += v.num * v.goods_price;
      }
      else {
        allChecked = false;
      }
    });

    allChecked = cart.length != 0 ? allChecked : false;

    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    });
    // 将修改后的cart数据写入缓存中
    wx.setStorageSync("cart", cart);
  },

  // 处理商品全选点击事件
  handleItemAllCheck(e) {
    // console.log(e);
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },

  // 处理商品数量点击事件
  async handleItemNum(e) {
    // 获取商品id和执行的操作
    const { operation, id } = e.currentTarget.dataset;
    // 找到商品索引
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: "您是否要删除该商品？" })
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    }
    else {
      cart[index].num += operation;
      this.setCart(cart);
    }
  },

  // 处理结算事件
  async handlePay() {
    // 获取用户地址和商品数目
    const { address, totalNum } = this.data;
    // 若用户地址不存在或商品数目为0则弹窗提示错误
    if (!address.userName) {
      await showToast({ title: "您还没有添加地址" });
      return;
    }
    if (totalNum === 0) {
      await showToast({ title: "您还没有添加商品" });
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})