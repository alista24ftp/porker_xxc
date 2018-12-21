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
                
              let specList = res.data.spec;
              specList = specList.map(spec=>{
                if(spec.sku_img != ''){
                  spec.sku_img = hostRegex.test(spec.sku_img) ? spec.sku_img : config.default.ApiHost + spec.sku_img;
                }else{
                  spec.sku_img = '';
                }
                return spec;
              });

              login.default.getToken().then(token=>{
                wx.request({
                  url: config.default.ApiHost + '/xcc/home/getCollectionList',
                  method: 'POST',
                  data: {
                    token: token
                  },
                  success: function(res){
                    let isFav = '';
                    if(res.data.code == 200){
                      if(res.data.type == 1){
                        let favList = res.data.data;
                        isFav = favList.some(item=>item.goods_id == prodId) ? 'isfav' : '';
                      }else{
                        isFav = '';
                      }
                    }else{
                      isFav = '';
                    }
                    that.setData({
                      prodId: prodId,
                      product: product,
                      comments: comments,
                      shownComment: shownComment,
                      pages: pages,
                      recommendedItems: recommendedItems,
                      specList: specList,
                      sku: (options.sku !== undefined) ? JSON.parse(options.sku) : undefined,
                      isFav: isFav
                    });
                  },
                  fail: function(err){
                    that.setData({
                      prodId: prodId,
                      product: product,
                      comments: comments,
                      shownComment: shownComment,
                      pages: pages,
                      recommendedItems: recommendedItems,
                      specList: specList,
                      sku: (options.sku !== undefined) ? JSON.parse(options.sku) : undefined,
                      isFav: isFav
                    });
                  }
                });
              }, err=>{
                that.setData({
                  prodId: prodId,
                  product: product,
                  comments: comments,
                  shownComment: shownComment,
                  pages: pages,
                  recommendedItems: recommendedItems,
                  specList: specList,
                  sku: (options.sku !== undefined) ? JSON.parse(options.sku) : undefined,
                  isFav: ''
                });
              });

              
            }else{
              wx.showToast({
                title: '无法取商品详情',
                image: '/images/cross.png'
              });
              console.error('无法获取商品详细信息');
            }
          }else{
            wx.showToast({
              title: '取商品详情错误',
              image: '/images/cross.png'
            });
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
      let sku = (this.data.sku !== undefined) ? '&sku='+JSON.stringify(this.data.sku) : '';
      wx.navigateTo({
        url: '../productSpec/productSpec?pid=' + this.data.prodId + sku + '&spec=' + JSON.stringify(this.data.specList)
      });
    },

    fav: function(e){
      let that = this;
      let prodId = e.currentTarget.dataset.id;
      let isFav = this.data.isFav == 'isfav';
      console.log(isFav);
      login.default.getToken().then(token=>{
        wx.request({
          url: config.default.ApiHost + '/xcc/home/collection',
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
                  wx.showToast({
                    title: '收藏取消成功',
                    success: function(res){
                      console.log('收藏取消成功');
                    }
                  });
                  
                  that.setData({
                    isFav: ''
                  });
                }else{
                  wx.showToast({
                    title: '收藏添加成功',
                    success: function (res) {
                      console.log('收藏添加成功');
                    }
                  });
                  that.setData({
                    isFav: 'isfav'
                  });
                }
              }else if(res.data.type == 2){
                wx.showToast({
                  title: '操作收藏夹失败',
                  image: '/images/cross.png'
                });
                console.error('操作收藏夹失败');
              }else{
                wx.showToast({
                  title: '收藏夹参数错误',
                  image: '/images/cross.png'
                });
                console.error('操作收藏夹参数错误');
              }
            }else{
              wx.showToast({
                title: '操作收藏夹异常',
                image: '/images/cross.png'
              });
              console.error('操作收藏夹异常');
            }
          },
          fail: function(err){
            wx.showToast({
              title: '无法操作收藏夹',
              image: '/images/cross.png'
            });
            console.error(err);
          }
        });
      }, err=>{
        wx.navigateTo({
          url: '../../member/login/login',
          success: function(res){
            wx.showToast({
              title: '请先登录',
              image: '/images/cross.png'
            });
          }
        });
      });
    },

    addToCart: function(e){
      let that = this;
      if(this.data.sku !== undefined){
        login.default.getToken().then(token=>{
          let params = {
            token: token,
            goods_id: that.data.product.goods_id,
            sku: that.data.sku.sku_id,
            num: that.data.sku.quantity
          };
          console.log(that.data.sku);
          wx.request({
            url: config.default.ApiHost + '/xcc/Cart/add',
            method: 'POST',
            data: params,
            success: function (res) {
              console.log(res);
              if (res.data.code == 200) {
                if (res.data.type == 1) {
                  wx.showToast({
                    title: '添加购物车成功',
                    success: function(res){
                      console.log('成功添加到购物车');
                    }
                  });
                } else {
                  wx.showToast({
                    title: '添加购物车失败',
                    image: '/images/cross.png',
                    success: function (res) {
                      console.error('添加购物车失败');
                    }
                  });
                }
              } else {
                wx.showToast({
                  title: '添加购物车错误',
                  image: '/images/cross.png',
                  success: function (res) {
                    console.error('添加购物车参数错误');
                  }
                });
              }
            },
            fail: function (err) {
              wx.showToast({
                title: '无法添加购物车',
                image: '/images/cross.png'
              });
              console.log(err);
            }
          });
        }, err=>{
          wx.navigateTo({
            url: '../../member/login/login',
            success: function(res){
              wx.showToast({
                title: '请先登录',
                image: '/images/cross.png'
              });
            }
          });
        });
        
      }else{
        wx.showToast({
          title: '请选择规格数量',
          image: '/images/cross.png',
          success: function (res) {
            console.error('请先选择规格数量');
          }
        });
        
      }
    },

    onShow: function(options){
      let that = this;
      login.default.getToken().then(token=>{
        wx.request({
          url: config.default.ApiHost + '/xcc/home/getCollectionList',
          method: 'POST',
          data: {
            token: token
          },
          success: function(res){
            if(res.data.code == 200){
              if(res.data.type == 1){
                let favList = res.data.data;
                if(favList.some(item=>item.goods_id == that.data.prodId)){
                  that.setData({
                    token: token,
                    isFav: 'isfav'
                  })
                }else{
                  that.setData({
                    token: token,
                    isFav: ''
                  });
                }
              }else{
                that.setData({
                  token: token,
                  isFav: ''
                });
              }
            }else{
              wx.showToast({
                title: '获取收藏夹异常',
                image: '/images/cross.png',
                success: function(res){
                  console.error('获取收藏夹列表异常');
                }
              });
              that.setData({
                token: token,
                isFav: ''
              });
            }
          },
          fail: function(err){
            wx.showToast({
              title: '无法获取收藏夹',
              image: '/images/cross.png',
              success: function (res) {
                console.error(err);
              }
            });
            
          }
        });
      }, err=>{
        wx.navigateTo({
          url: '../../member/login/login',
          success: function(res){
            wx.showToast({
              title: '请先登录',
              image: '/images/cross.png'
            });
          }
        });
      });
    }
})