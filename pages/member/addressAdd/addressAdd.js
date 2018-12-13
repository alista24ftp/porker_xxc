// pages/member/addressAdd/addressAdd.js
const validator = require('../../../utils/addrValidate.js');
const config = require('../../../config.js');
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
    let addr = options.addr;
    let token = options.token;
    if(addr !== undefined){
      // 编辑地址
      addr = JSON.parse(addr);
      console.log(addr);
      this.setData({
        addr,
        isDefault: addr.add_default == 1,
        token: token
      });
    }else{
      // 添加地址
      this.setData({
        addr: {
          add_id: undefined,
          add_default: 0,
          add_name: '',
          add_phone: '',
          add_street: '',
          city: '',
          dist: '',
          province: ''
        },
        isDefault: false,
        token: token
      });
    }
  },

  resetAddr: function(e){
    console.log(this.data.addr);
  },

  done: function(e){
    console.log(e);
    let addrInfo = e.detail.value;
    if (validator.default.validateSubmit(addrInfo.add_name, addrInfo.add_phone, addrInfo.province, addrInfo.city, addrInfo.dist, addrInfo.add_street, addrInfo.add_default)){
      let reqData = {
        token: this.data.token, 
        add_phone: addrInfo.add_phone,
        add_name: addrInfo.add_name,
        province: addrInfo.province,
        city: addrInfo.city,
        dist: addrInfo.dist,
        add_street: addrInfo.add_street,
        add_default: addrInfo.add_default
      };
      if(this.data.addr.add_id !== undefined){
        reqData.add_id = this.data.addr.add_id;
      }
      wx.request({
        url: config.default.ApiHost + '/xcc/Address/edit',
        method: 'POST',
        data: reqData,
        success: function(res){
          if(res.data.code == 200){
            if(res.data.type == 1){
              console.log('地址信息提交成功');
              wx.redirectTo({
                url: '../receiveList/receiveList'
              });
            }else if(res.data.code == 2){
              console.error('地址信息提交失败');
            }else{
              console.error('地址信息参数错误');
            }
          }else{
            console.error('提交地址状态异常');
          }
        },
        fail: function(err){
          console.error(err);
        }
      });
    }else{
      console.error('提交地址验证错误, 请检查地址输入信息');
    }
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