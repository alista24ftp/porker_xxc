// pages/member/productStore/productStore.js
const config = require('../../../config.js');
const login = require('../../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  goToProduct: function(e){
    let index = e.currentTarget.dataset.index;
    let prodId = this.data.favList[index].goods_id;
    wx.navigateTo({
      url: '../../product/productDetail/productDetail?pid=' + prodId
    });
  },

  removeFav: function(e){
    let index = e.currentTarget.dataset.index;
    let that = this;
    login.default.getToken().then(token=>{
      wx.showModal({
        title: '确认删除此收藏',
        content: '您确认是否删除此收藏?',
        confirmText: '删除',
        cancelText: '取消',
        success: function (res) {
          if (res.confirm) {
            console.log('删除');
            wx.request({
              url: config.default.ApiHost + '/xcc/home/collection',
              method: 'POST',
              data: {
                token: token,
                goods_id: that.data.favList[index].goods_id
              },
              success: function (res) {
                console.log(res);
                if(res.data.code == 200){
                  if(res.data.type == 1){
                    console.log('删除成功');
                    wx.redirectTo({
                      url: './productStore',
                    });
                  }else if(res.data.type == 2){
                    console.error('删除失败');
                  }else{
                    console.error('删除参数错误');
                  }
                }else{
                  console.error('收藏夹删除操作异常');
                }
                
              },
              fail: function (err) {
                console.error(err);
              }
            });
          }
        }
      });
    }, err=>{
      console.error(err);
      wx.navigateTo({
        url: '../login/login'
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    login.default.getToken().then(token => {
      wx.request({
        url: config.default.ApiHost + '/xcc/home/getCollectionList',
        method: 'POST',
        data: {
          token: token
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            if (res.data.type == 1) {
              let favList = res.data.data;
              let hostRegex = new RegExp('^' + config.default.ApiHost);
              favList = favList.map(item => {
                item.goods_img = hostRegex.test(item.goods_img) ? item.goods_img : config.default.ApiHost + item.goods_img;
                return item;
              });
              console.log(favList);
              that.setData({
                favList: favList,
                token: token
              });
            } else {
              console.error('收藏夹没有任何商品');
              that.setData({
                favList: [],
                token: token
              });
            }

          } else {
            console.error('获取收藏夹列表状态异常');
          }
        },
        fail: function (err) {
          console.error(err);
        }
      });
    }, err => {
      console.error(err);
      wx.navigateTo({
        url: '../login/login'
      });
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})