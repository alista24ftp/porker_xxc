//index.js
//获取应用实例
const app = getApp()
const {ApiHost} = require('../../config.js');
const {formatImg, failMsg} = require('../../utils/util.js');
Page({
    data: {
        imgUrls: [
            'https://topic.camel.com.cn/module/wap_index_focus_201709/7645c28f-9674-49f0-8490-dca3f6237496.jpg?d=1',
            'https://topic.camel.com.cn/module/wap_index_focus_201709/cb445730-dda3-466e-ab17-60f1f6ca1cb7.jpg',
            'https://topic.camel.com.cn/module/wap_index_focus_201709/92b890bb-7182-4ba4-8bc7-3ffd7ebbcf1c.jpg'
        ],
        indicatorDots: true,  
        indicatorColor: '#fff',
        indicatorActiveColor: '#d2ab44',
        autoplay: true,
        interval: 5000,
        duration: 500,
        circular: true
    },
    onLoad: function(options){
      let that = this;
      wx.request({
        url: ApiHost + '/xcc/material/index/',
        method: 'POST',
        success: function(res){
          console.log(res);
          if(res.data.code == 200){
            let {goods, hot, slide} = res.data;
            goods = goods.map(good=>{
              good.goods_img = formatImg(good.goods_img);
              return good;
            });
            hot = hot.map(good => {
              good.goods_img = formatImg(good.goods_img);
              return good;
            });
            slide = slide.map(sl => {
              sl.slide_url = formatImg(sl.slide_url);
              return sl;
            });
            console.log(goods);
            console.log(hot);
            that.setData({
              goods, hot, slide
            });
          }else{
            console.error('获取主页商品错误');
            failMsg('获取主页错误');
          }
        },
        fail: function(err){
          console.error(err);
          failMsg('获取主页错误');
        }
      });
    },

    goToProduct: function(e){
      let prodId = e.currentTarget.dataset.pid;
      wx.navigateTo({
        url: '/pages/product/productDetail/productDetail?pid=' + prodId
      });
    },

    onShow: function(){
      
    }
})
