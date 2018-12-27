// pages/member/receiveList/receiveList.js
const {ApiHost} = require('../../../config.js');
const {successMsg, failMsg, setPrevPageAndBack} = require('../../../utils/util.js');
const {getToken, goLogin} = require('../../../utils/login.js');
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
    let showSel = options.sel !== undefined;
    this.setData({
      showSel
    });
  },

  editAddress: function(e){
    let index = e.currentTarget.dataset.index;
    let addr = JSON.stringify(this.data.addressList[index]);
    wx.navigateTo({
      url: '/pages/member/addressAdd/addressAdd?addr=' + addr
    });
  },

  addAddress: function(e){
    wx.navigateTo({
      url: '/pages/member/addressAdd/addressAdd'
    }); 
  },

  chooseAddress: function(e){
    let index = e.currentTarget.dataset.index;
    let addrId = this.data.addressList[index].add_id;
    setPrevPageAndBack({addrId});
  },

  delAddress: function(e){
    let index = e.currentTarget.dataset.index;
    let that = this;
    wx.showModal({
      title: '确认删除地址',
      content: '您确认是否删除此地址?',
      confirmText: '删除',
      cancelText: '取消',
      success: function(res){
        if(res.confirm){
          getToken().then(token=>{
            wx.request({
              url: ApiHost + '/xcc/address/del',
              method: 'POST',
              data: {
                token: token,
                add_id: that.data.addressList[index].add_id
              },
              success: function (res) {
                if (res.data.code == 200) {
                  if (res.data.type == 1) {
                    console.log('删除成功');
                    wx.redirectTo({
                      url: '/pages/member/receiveList/receiveList' + (that.data.showSel ? '?sel=1' : ''),
                      success: function (res) {
                        successMsg('删除成功');
                      }
                    });
                  } else if (res.data.type == 2) {
                    console.error('删除失败');
                    failMsg('删除失败');
                  } else {
                    console.error('删除失败, 地址参数错误');
                    failMsg('地址参数错误');
                  }
                } else {
                  console.error('删除地址状态异常');
                  failMsg('删除状态异常');
                }
              }
            });
          }, err=>{
            goLogin();
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
    console.log(this.data.showSel);
    getToken().then(token=>{
      wx.request({
        url: ApiHost + '/xcc/Address/getList',
        method: 'POST',
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code == 200) {
            if (res.data.type == 1) {
              console.log(res.data.data);
              that.setData({
                addressList: res.data.data
              });
            } else {
              console.error('没有用户地址信息');
              that.setData({
                addressList: []
              });
            }
          } else {
            console.error('错误获取用户地址信息');
            failMsg('获取地址失败');
          }
        },
        fail: function (err) {
          console.error(err);
          failMsg('获取地址失败');
        }
      }); 
    }, err=>{
      goLogin();
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