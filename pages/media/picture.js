import util from './../../utils/util.js';
Page({
  data: {
    showtab: 0,  //顶部选项卡索引
    tabnav: {
      tabnum: 5,
      tabitem: [
        {
          "id": 0,
          "text": "商品分类1"
        },

        {
          "id": 1,
          "text": "商品分类2"
        },

        {
          "id": 2,
          "text": "商品分类3"
        },

        {
          "id": 3,
          "text": "商品分类4"
        },

        {
          "id": 4,
          "text": "商品分类5"
        },

        {
          "id": 5,
          "text": "商品分类6"
        },

        {
          "id": 6,
          "text": "商品分类7"
        }
      ]
    },
    productList: [],
  },

  onLoad: function () {

  },

  setTab: function (e) {
    const edata = e.currentTarget.dataset;
    this.setData({
      showtab: edata.tabindex,
    })
  },
})