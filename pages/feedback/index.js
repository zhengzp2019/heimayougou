// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],

    // 存储被选中的图片路径
    chooseImgs: [],

    // 存储文本域的内容
    textVal: "",

  },

  // 存储外网文件连接
  UpLoadImgs: [],

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

  // 处理点击‘+’号，上传图片事件
  handleChooseImg(e) {
    wx.chooseImage({
      // 同时选中的图片数量 最大9
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
        })
      },
    });
  },

  // 处理删除图片事件
  handleRemoveImg(e) {
    console.log(e);
    let { index } = e.currentTarget.dataset;
    let { chooseImgs } = this.data;
    chooseImgs.splice(index, 1);
    this.setData({ chooseImgs });
  },

  // 处理文本输入事件
  handleTextInput(e) {
    this.setData({ textVal: e.detail.value });
  },

  // 处理提交按钮点击事件
  handleFormSubmit(e) {
    // 获取文本域和图片数据
    const { textVal, chooseImgs } = this.data;
    // 对文本内容进行合法性验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    }

    // 显示正在等待图标
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });

    // 判断有没有需要上传的图片数组
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: "http://img.coolcr.cn/api/upload",
          // 图片存在的地址
          filePath: v,
          // 上传的文件的名称 后台来获取文件  file
          name: "image",
          success: (res) => {
            // console.log(res);
            let { url } = JSON.parse(res.data).data;
            this.UpLoadImgs.push(url);
            // 所有数据上传完毕后才触发

            if (this.UpLoadImgs.length === chooseImgs.length) {
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组上传到后台去");

              // 提交都成功了，重置页面
              this.setData({
                textVal: "",
                chooseImgs: []
              });

              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      });
    }
    else {
      wx.hideLoading();
      console.log("只是将文本提交到后台去");
      wx.navigateBack({
        delta: 1
      });
    }
  }
})