// pages/member/receiveList/receiveList.js
const config = require('../../../config.js');
//const login = require('../../../utils/login.js');
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

  editAddress: function(e){
    let index = e.currentTarget.dataset.index;
    let addr = JSON.stringify(this.data.addressList[index]);
    let token = this.data.token;
    wx.navigateTo({
      url: '/pages/member/addressAdd/addressAdd?addr=' + addr + '&token=' + token
    });
  },

  addAddress: function(e){
    let token = this.data.token;
    wx.navigateTo({
      url: '/pages/member/addressAdd/addressAdd?token=' + token
    }); 
  },

  delAddress: function(e){
    let token = this.data.token;
    let index = e.currentTarget.dataset.index;
    let that = this;
    wx.showModal({
      title: '确认删除地址',
      content: '您确认是否删除此地址?',
      confirmText: '删除',
      cancelText: '取消',
      success: function(res){
        if(res.confirm){
          console.log('删除');
          wx.request({
            url: config.default.ApiHost + '/xcc/address/del',
            method: 'POST',
            data: {
              token: token,
              add_id: that.data.addressList[index].add_id
            },
            success: function(res){
              if(res.data.code == 200){
                if(res.data.type == 1){
                  console.log('删除成功');
                  wx.redirectTo({
                    url: '/pages/member/receiveList/receiveList',
                    success: function(res){
                      wx.showToast({
                        title: '删除成功',
                      });
                    }
                  });
                }else if(res.data.type == 2){
                  console.error('删除失败');
                  wx.showToast({
                    title: '删除失败',
                    image: '/images/cross.png'
                  })
                }else{
                  console.error('删除失败, 地址参数错误');
                  wx.showToast({
                    title: '地址参数错误',
                    image: '/images/cross.png'
                  })
                }
              }else{
                console.error('删除地址状态异常');
                wx.showToast({
                  title: '删除状态异常',
                  image: '/images/cross.png'
                })
              }
            }
          });
        }
      }
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
    wx.getStorage({
      key: 'userinfo',
      success: function (userInfo) {
        wx.request({
          url: config.default.ApiHost + '/xcc/Address/getList',
          method: 'POST',
          data: {
            token: userInfo.data.loginToken
          },
          success: function (res) {
            if (res.data.code == 200) {
              if (res.data.type == 1) {
                console.log(res.data.data);
                that.setData({
                  addressList: res.data.data,
                  token: userInfo.data.loginToken
                });
              } else {
                console.error('没有用户地址信息');
                that.setData({
                  addressList: []
                });
              }
            } else {
              console.error('错误获取用户地址信息');
              wx.showToast({
                title: '获取地址失败',
                image: '/images/cross.png'
              })
            }
          },
          fail: function (err) {
            console.error(err);
            wx.showToast({
              title: '获取地址失败',
              image: '/images/cross.png'
            })
          }
        });
      },
      fail: function (err) {
        wx.navigateTo({
          url: '/pages/member/login/login',
          success: function(res){
            wx.showToast({
              title: '请先登录',
              image: '/images/cross.png'
            })
          }
        });
      }
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