import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 按钮隐藏熟悉
    isFocus: false,
    // 输入框的值
    inpValue: ""
  },
  TimeId: -1,

  handleInput(e) {
    // 获取输入内容
    const { value } = e.detail;
    // 检查输入合法性
    if (!value.trim()) {
      // 输入为空
      this.setData({
        isFocus: false,
        goods: []
      })
      return;
    }

    this.setData({ isFocus: true });
    // 防抖 功能
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qSearch(value);
    }, 1000);
  },

  // 发送搜索建议查询
  async qSearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } });
    this.setData({
      goods: res
    });
  },

  // 点击取消按钮事件
  handleCancel(e) {
    this.setData({
      isFocus: false,
      goods: [],
      inpValue: ""
    })
  }
})