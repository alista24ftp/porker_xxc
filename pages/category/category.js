// pages/zx/zx.js
var categoryData = require("../../data/classiFication.js");
const config = require('../../config.js');
Page({
    data: {
        currentIndex: 0
    },
    pud: function (e) {
        console.log(e)
        var cid = e.currentTarget.dataset.cid;
        let cname = e.currentTarget.dataset.cname;
        wx.navigateTo({
            url: '/pages/product/productList/productList?cid=' + cid + '&cname=' + cname
        })
    },
    onLoad: function (options) {
        /*
        //console.log(options)
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            categoryData: categoryData.default.data
        })
        */
      var that = this;
      wx.request({
        url: config.default.ApiHost + '/xcc/material/category.html',
        method: 'POST',
        success: function(res){
          if(res.data.code == 200){
            //console.log(res.data.data);
            let categories = res.data.data;
            let hostRegex = new RegExp('^'+config.default.ApiHost);
            categories = categories.map(category=>{
              category.cat_img = category.cat_img == '' ? '' : (hostRegex.test(category.cat_img) ? category.cat_img : config.default.ApiHost + category.cat_img);
              category.cat_icon = category.cat_icon == '' ? '' : (hostRegex.test(category.cat_icon) ? category.cat_icon : config.default.ApiHost + category.cat_icon);
              category.child = category.child.map(child=>{
                child.cat_img = child.cat_img == '' ? '' : (hostRegex.test(child.cat_img) ? child.cat_img : config.default.ApiHost + child.cat_img);
                child.cat_icon = child.cat_icon == '' ? '' : (hostRegex.test(child.cat_icon) ? child.cat_icon : config.default.ApiHost + child.cat_icon);
                return child;
              });
              return category;
            });
            console.log(categories);
            that.setData({
              categories: categories
            });
          }else{
            console.error(res);
            wx.showToast({
              title: '获取分类异常',
              image: '/images/cross.png'
            })
            that.setData({
              categories: []
            });
          }
        }
      });
    },
    onAside: function (options) {
        //console.log(options)
        //下标
        var index = options.currentTarget.dataset.index;
        console.log(index)
        this.setData({
            currentIndex: index
        });
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})