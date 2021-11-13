import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollected: false
  },

  // 存储当前商品信息
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const { goods_id } = currentPage.options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsInfo = res;
    // 从缓存中取出收藏数据
    const collect = wx.getStorageSync("collect") || [];
    // 判断当前商品是否存在购物车中
    let isCollected = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        // iphone部分手机 不识别 webp图片格式 
        // 最好找到后台 让他进行修改 
        // 临时自己改 确保后台存在 1.webp => 1.jpg 
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.pics
      },
      isCollected
    })
  },

  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },

  // 处理加入购物车事件
  handleCartAdd() {
    // 获取购物车缓存信息
    let cart = wx.getStorageSync("cart") || [];

    // 判断对象是否存在
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      // 商品不存在，添加商品
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      // this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    }
    else {
      // 商品存在，商品数量++
      cart[index].num++;
    }

    // 将购物车数据重新写入缓存
    wx.setStorage({
      key: 'cart',
      data: cart,
    });

    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    });
  },

  // 处理点击收藏事件
  handleCollect() {
    /**
     * 1、从缓存中获取收藏数据
     * 2、判断当前页面商品是否收藏
     *  2.1 已收藏：取消收藏，从数组中删除当前商品
     *  2.2 未收藏：收藏、加入收藏数组
     * 3、修改isCollected，设置页面data，将收藏数组写入缓存，
     */
    let isCollected = false;
    let collect = wx.getStorageSync("collect") || [];
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index !== -1) {
      // 商品存在收藏数组中
      collect.splice(index, 1);
    }
    else {
      // 商品不在收藏数组中
      collect.push(this.GoodsInfo);
      isCollected = true;
    }
    this.setData({ isCollected });
    wx.setStorageSync("collect", collect);
  }
})