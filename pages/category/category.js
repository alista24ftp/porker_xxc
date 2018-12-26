// pages/category/category.js
const {ApiHost} = require('../../config.js');
const {formatImg, successMsg, failMsg} = require('../../utils/util.js');
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
        url: ApiHost + '/xcc/material/category.html',
        method: 'POST',
        success: function(res){
          if(res.data.code == 200){
            //console.log(res.data.data);
            let categories = res.data.data;
            categories = categories.map(category=>{
              category.cat_img = formatImg(category.cat_img);
              category.cat_icon = formatImg(category.cat_icon);
              category.child = category.child.map(child=>{
                child.cat_img = formatImg(child.cat_img);
                child.cat_icon = formatImg(child.cat_icon);
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
            failMsg('获取分类异常');
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