// pages/product/productDetail/productDetail.js
const {ApiHost} = require('../../../config.js');
const {getToken, goLogin} = require('../../../utils/login.js');
const {formatImg, successMsg, failMsg} = require('../../../utils/util.js');
Page({
    data: {
      indicatorDots: true,
      indicatorColor: '#fff',
      indicatorActiveColor: '#d2ab44',
      autoplay: true,
      interval: 5000,
      duration: 500,
      circular: true
    },
  onShareAppMessage(res) {
    let that=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.product.goods_name,
      path: '/pages/product/productDetail/productDetail?pid='+that.data.product.goods_id
    }
  },
    onLoad: function(options){
      let prodId = options.pid;
      let that = this;
      wx.request({
        url: ApiHost + '/xcc/Goods/xccDetail/',
        method: 'POST',
        data: {
          id: prodId
        },
        success: function(res){
          console.log(res);
          if(res.data.code == 200){
            if(res.data.type == 1){
              let product = res.data.goods;
              product.goods_album = product.goods_album.map(img=>formatImg(img));
              product.goods_des = product.goods_des.map(img => formatImg(img));
              product.goods_img = formatImg(product.goods_img);
              product.sku = product.sku.map(skuItem=>{
                skuItem.sku_img = formatImg(skuItem.sku_img);
                return skuItem;
              });
              let comments = res.data.comments;
              let pages = res.data.page;
              pages = pages.map(page=>{
                let commentTime = new Date(page.com_time * 1000);
                let convertedTime = commentTime.getFullYear() + '年';
                convertedTime += (commentTime.getMonth() + 1) + '月';
                convertedTime += (commentTime.getDate()) + '日';
                convertedTime += ' ' + (commentTime.getHours() >= 10 ? commentTime.getHours() : '0' + commentTime.getHours()) + ':';
                convertedTime += (commentTime.getMinutes() >= 10 ? commentTime.getMinutes() : '0' + commentTime.getMinutes()) + ':';
                convertedTime += (commentTime.getSeconds() >= 10 ? commentTime.getSeconds() : '0' + commentTime.getSeconds());
                page.com_time = convertedTime;

                if(page.com_type == 1){
                  if (Array.isArray(page.com_img)) {
                    page.com_img = page.com_img.map(img => formatImg(img));
                  } else {
                    for (var prop in page.com_img) {
                      if (page.com_img.hasOwnProperty(prop)) {
                        //console.log(prop);
                        page.com_img[prop] = formatImg(page.com_img[prop]);
                      }
                    }
                  }
                }

                page.user_photo = formatImg(page.user_photo);
                return page;
              });
              console.log(pages);
              let recommendedItems = res.data.recommend;
              recommendedItems = recommendedItems.map(item=>{
                item.goods_album = JSON.parse(item.goods_album).map(img=>formatImg(img));
                item.goods_des = JSON.parse(item.goods_des).map(img => formatImg(img));
                item.goods_img = formatImg(item.goods_img);
                return item;
              });
              let shownComment = pages.length > 0 ? pages[0] : false;
                
              let specList = res.data.spec;
              specList = specList.map(spec=>{
                spec.sku_img = formatImg(spec.sku_img);
                return spec;
              });

              that.setData({
                prodId: prodId,
                product: product,
                comments: comments,
                shownComment: shownComment,
                pages: pages,
                recommendedItems: recommendedItems,
                specList: specList,
                sku: false
              }, that.checkFav);
              
            }else{
              failMsg('无法取商品详情');
              console.error('无法获取商品详细信息');
            }
          }else{
            failMsg('取商品详情错误');
            console.error('获取商品详细信息错误');
          }
          
        },
        fail: function(err){
          console.error(err);
          failMsg('无法取商品详情');
        }
      });
    },

    goToRec: function(e){
      let prodId = e.currentTarget.dataset.pid;
      wx.navigateTo({
        url: '/pages/product/productDetail/productDetail?pid=' + prodId
      });
    },

    seeComments: function(e){
      console.log(this.data.pages);
      wx.navigateTo({
        url: '/pages/product/productComments/productComments?comments=' + JSON.stringify(this.data.pages)
      });
    },

    selectSku: function(e){
      let sku = (this.data.sku !== false) ? 'sku='+JSON.stringify(this.data.sku) : '';
      wx.navigateTo({
        url: '/pages/product/productSpec/productSpec?' + sku + '&spec=' + JSON.stringify(this.data.specList)
      });
    },

    fav: function(e){
      let that = this;
      let prodId = e.currentTarget.dataset.id;
      let isFav = this.data.isFav == 'isfav';
      console.log(isFav);
      getToken().then(token=>{
        wx.request({
          url: ApiHost + '/xcc/home/collection',
          method: 'POST',
          data: {
            token: token,
            goods_id: prodId
          },
          success: function(res){
            console.log(res);
            if(res.data.code == 200){
              if(res.data.type == 1){
                if(isFav){
                  successMsg('收藏取消成功');
                  that.setData({
                    isFav: ''
                  });
                }else{
                  successMsg('收藏添加成功');
                  that.setData({
                    isFav: 'isfav'
                  });
                }
              }else if(res.data.type == 2){
                failMsg('操作收藏夹失败');
                console.error('操作收藏夹失败');
              }else{
                failMsg('收藏夹参数错误');
                console.error('操作收藏夹参数错误');
              }
            }else{
              failMsg('操作收藏夹异常');
              console.error('操作收藏夹异常');
            }
          },
          fail: function(err){
            failMsg('无法操作收藏夹');
            console.error(err);
          }
        });
      }, err=>{
        goLogin();
      });
    },

    addToCart: function(e){
      let that = this;
      if(this.data.sku !== false){
        getToken().then(token=>{
          let params = {
            token: token,
            goods_id: that.data.product.goods_id,
            sku: that.data.sku.sku_id,
            num: that.data.sku.quantity
          };
          console.log(that.data.sku);
          wx.request({
            url: ApiHost + '/xcc/Cart/add',
            method: 'POST',
            data: params,
            success: function (res) {
              console.log(res);
              if (res.data.code == 200) {
                if (res.data.type == 1) {
                  successMsg('添加购物车成功');
                } else {
                  failMsg('添加购物车失败');
                }
              } else {
                failMsg('购物车参数错误');
              }
            },
            fail: function (err) {
              failMsg('无法添加购物车');
              console.log(err);
            }
          });
        }, err=>{
          goLogin();
        });
        
      }else{
        failMsg('请选择规格数量');
      }
    },

    goToBuy: function(e){
      if(this.data.sku !== false){
        let sku = this.data.sku;
        sku.goods_img = this.data.product.goods_img;
        sku.goods_name = this.data.product.goods_name;
        sku.goods_id = this.data.product.goods_id;
        getToken().then(token=>{
          wx.navigateTo({
            url: '/pages/order/orderConfirm/orderConfirm?type=2&item=' + JSON.stringify(sku)
          });
        }, err=>{
          goLogin();
        });
      }else{
        failMsg('请选择规格数量');
      }
      
    },

    goHome: function(e){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },

    onShow: function(){
      this.checkFav();
    }, 

    checkFav: function(){
      let that = this;
      getToken().then(token => {
        wx.request({
          url: ApiHost + '/xcc/home/getCollectionList',
          method: 'POST',
          data: {
            token: token
          },
          success: function (res) {
            if (res.data.code == 200) {
              if (res.data.type == 1) {
                let favList = res.data.data;
                let isFav = favList.some(item => item.goods_id == that.data.prodId) ? 'isfav' : '';
                console.log(isFav);
                that.setData({ isFav });
              } else {
                that.setData({ isFav: '' });
              }
            } else {
              failMsg('获取收藏夹异常');
              that.setData({ isFav: '' });
            }
          },
          fail: function (err) {
            failMsg('无法获取收藏夹');
          }
        });
      }, err => {
        that.setData({ isFav: '' });
      });
    }
})