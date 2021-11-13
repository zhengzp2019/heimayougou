Component({
  data: {},

  // 组件的属性列表
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },
  methods: {
    // 定义点击事件
    handleItemTap(e) {
      // 1.获取参数索引
      const { index } = e.currentTarget.dataset;
      // 2 触发 父组件中的事件 自定义
      this.triggerEvent("tabsItemChange", { index })
    }
  },
  options: {
    addGlobalClass: true
  }
})