// pages/product/productDetail/productDetail.js
const config = require('../../../config.js');
const login = require('../../../utils/login.js');
Page({
    data: {
      /*
        imgUrls: [
            'https://img01.camel.com.cn/product/image/A712357085/6fb33911-3ca6-4487-87b0-ce954573b6dd.jpg',
            'https://img01.camel.com.cn/product/image/A712357085/c8568bbd-5fcf-4c15-b143-f8e022ddbc18.jpg',
            'https://img01.camel.com.cn/product/image/A712357085/e9e1b0dc-c431-486a-a410-5dcd1c6b7c21.jpg'
        ],
        */
        indicatorDots: true,
        indicatorColor: '#fff',
        indicatorActiveColor: '#d2ab44',
        autoplay: true,
        interval: 5000,
        duration: 500,
        circular: true
    },

    onLoad: function(options){
      let prodId = options.pid;
      let that = this;
      wx.request({
        url: config.default.ApiHost + '/xcc/Goods/xccDetail/',
        method: 'POST',
        data: {
          id: prodId
        },
        success: function(res){
          console.log(res);
          if(res.data.code == 200){
            if(res.data.type == 1){
              let hostRegex = new RegExp('^'+config.default.ApiHost);
              let product = res.data.goods;
              product.goods_album = product.goods_album.map(img=>hostRegex.test(img) ? img : config.default.ApiHost + img);
              product.goods_des = product.goods_des.map(img => hostRegex.test(img) ? img : config.default.ApiHost + img);
              product.goods_img = hostRegex.test(product.goods_img) ? product.goods_img : config.default.ApiHost + product.goods_img;
              product.sku = product.sku.map(skuItem=>{
                skuItem.sku_img = hostRegex.test(skuItem.sku_img) ? skuItem.sku_img : config.default.ApiHost + skuItem.sku_img;
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
                    page.com_img = page.com_img.map(img => hostRegex.test(img) ? img : config.default.ApiHost + img);
                  } else {
                    for (var prop in page.com_img) {
                      if (page.com_img.hasOwnProperty(prop)) {
                        //console.log(prop);
                        page.com_img[prop] = hostRegex.test(page.com_img[prop]) ? page.com_img[prop] : config.default.ApiHost + page.com_img[prop];
                      }
                    }
                  }
                }
                return page;
              });
              console.log(pages);
              let recommendedItems = res.data.recommend;
              recommendedItems = recommendedItems.map(item=>{
                item.goods_album = JSON.parse(item.goods_album).map(img=>hostRegex.test(img) ? img : config.default.ApiHost + img);
                item.goods_des = JSON.parse(item.goods_des).map(img => hostRegex.test(img) ? img : config.default.ApiHost + img);
                item.goods_img = hostRegex.test(item.goods_img) ? item.goods_img : config.default.ApiHost + item.goods_img;
                return item;
              });
              let shownComment = pages.length > 0 ? pages[0] : undefined;
                
              that.setData({
                prodId: prodId,
                product: product,
                comments: comments,
                shownComment: shownComment,
                pages: pages,
                recommendedItems: recommendedItems,
                sku: (options.sku !== undefined) ? JSON.parse(options.sku) : undefined
              });
            }else{
              console.error('无法获取商品详细信息');
            }
          }else{
            console.error('获取商品详细信息错误');
          }
          
        },
        fail: function(err){
          console.error(err);
        }
      });
    },

    goToRec: function(e){
      let prodId = e.currentTarget.dataset.pid;
      wx.navigateTo({
        url: './productDetail?pid=' + prodId
      });
    },

    seeComments: function(e){
      console.log(this.data.pages);
      wx.navigateTo({
        url: '../productComments/productComments?comments=' + JSON.stringify(this.data.pages)
      });
    },

    selectSku: function(e){
      wx.navigateTo({
        url: '../productSpec/productSpec?pid=' + this.data.prodId
      });
    },

    addToCart: function(e){
      let that = this;
      if(this.data.sku !== undefined){
        wx.getStorage({
          key: 'userinfo',
          success: function (userInfo) {
            // 添加到购物车
            wx.request({
              url: config.default.ApiHost + '/xcc/Cart/add',
              method: 'POST',
              data: {
                token: userInfo.data.loginToken,
                goods_id: that.data.product.goods_id,
                num: that.data.sku.quantity
              },
              success: function(res){
                console.log(res);
                if(res.data.code == 200){
                  if (res.data.type == 1) {
                    console.log('成功添加到购物车');
                  } else {
                    console.error('添加购物车失败');
                  }
                }else{
                  console.error('添加购物车参数错误');
                }
                
              },
              fail: function(err){
                console.log(err);
              }
            });
          },
          fail: function (err) {
            // 先登录
            login.default.login().then((loginState)=>{
              let loginToken = loginState.loginToken;
              wx.request({
                url: config.default.ApiHost + '/xcc/Cart/add',
                method: 'POST',
                data: {
                  token: loginToken,
                  goods_id: that.data.product.goods_id,
                  num: that.data.sku.quantity
                },
                success: function (res) {
                  console.log(res);
                  if (res.data.code == 200) {
                    if (res.data.type == 1) {
                      console.log('成功添加到购物车');
                    } else {
                      console.error('添加购物车失败');
                    }
                  } else {
                    console.error('添加购物车参数错误');
                  }
                },
                fail: function (err) {
                  console.log(err);
                }
              });
            }, (err)=>{
              console.error(err);
            });
          }
        });
      }else{
        console.error('请先选择规格数量');
      }
    }
})