// pages/member/addressAdd/addressAdd.js
const {validateSubmit} = require('../../../utils/addrValidate.js');
const {ApiHost} = require('../../../config.js');
const areas = require('../../../utils/area.js');
const {successMsg, failMsg} = require('../../../utils/util.js');
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
    let addr = options.addr;
    let areaJson = areas.getAreaJson();
    let provinces = areas.getProvinces();
    
    if(addr !== undefined){
      // 编辑地址
      addr = JSON.parse(addr);
      console.log(addr);
      let provIndex = areas.getIndexByProv(addr.province);
      let cityIndex = areas.getIndexByCity(provIndex, addr.city);
      let distIndex = areas.getIndexByDist(provIndex, cityIndex, addr.dist);
      this.setData({
        addr,
        isDefault: addr.add_default == 1,
        areaJson,
        provinces,
        cities: areas.getCitys(provIndex),
        districts: areas.getAreas(provIndex, cityIndex),
        provIndex,
        cityIndex,
        distIndex
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
        areaJson,
        provinces,
        cities: areas.getCitys(0),
        districts: areas.getAreas(0, 0),
        provIndex: 0,
        cityIndex: 0,
        distIndex: 0
      });
    }
  },

  chooseProvince: function(e){
    console.log(e);
    let provIndex = e.detail.value;
    let cities = areas.getCitys(provIndex);
    let districts = areas.getAreas(provIndex, 0);
    this.setData({
      provIndex,
      cityIndex: 0,
      distIndex: 0,
      cities,
      districts
    });
  },

  chooseCity: function(e){
    console.log(e);
    let cityIndex = e.detail.value;
    let provIndex = this.data.provIndex;
    let districts = areas.getAreas(provIndex, cityIndex);
    this.setData({
      cityIndex,
      distIndex: 0,
      districts
    });
  },

  chooseDist: function(e){
    console.log(e);
    let distIndex = e.detail.value;
    this.setData({
      distIndex
    });
  },

  resetAddr: function(e){
    console.log(this.data.addr);
    this.setData({
      cities: areas.getCitys(0),
      districts: areas.getAreas(0,0),
      provIndex: 0,
      cityIndex: 0,
      distIndex: 0
    });
  },

  done: function(e){
    console.log(e);
    let addrInfo = e.detail.value;
    let {provIndex, cityIndex, distIndex} = this.data;
    let that = this;
    //if (validateSubmit(addrInfo.add_name, addrInfo.add_phone, addrInfo.province, addrInfo.city, addrInfo.dist, addrInfo.add_street, addrInfo.add_default)){
    if(validateSubmit(addrInfo.add_name, addrInfo.add_phone, provIndex, cityIndex, distIndex, addrInfo.add_street, addrInfo.add_default)){
      getToken().then(token=>{
        let reqData = {
          token: token,
          add_phone: addrInfo.add_phone,
          add_name: addrInfo.add_name,
          //province: addrInfo.province,
          //city: addrInfo.city,
          //dist: addrInfo.dist,
          province: areas.getProvName(provIndex),
          city: areas.getCityName(provIndex, cityIndex),
          dist: areas.getDistName(provIndex, cityIndex, distIndex),
          add_street: addrInfo.add_street,
          add_default: addrInfo.add_default
        };
        if (that.data.addr.add_id !== undefined) {
          reqData.add_id = that.data.addr.add_id;
        }
        wx.request({
          url: ApiHost + '/xcc/Address/edit',
          method: 'POST',
          data: reqData,
          success: function (res) {
            if (res.data.code == 200) {
              if (res.data.type == 1) {
                console.log('地址信息提交成功');
                wx.navigateBack({
                  delta: 1,
                  success: function (res) {
                    successMsg('地址提交成功');
                  }
                });
              } else if (res.data.code == 2) {
                console.error('地址信息提交失败');
                failMsg('地址提交失败');
              } else {
                console.error('地址信息参数错误');
                failMsg('地址参数错误');
              }
            } else {
              console.error('提交地址状态异常');
              failMsg('地址提交失败');
            }
          },
          fail: function (err) {
            console.error(err);
            failMsg('地址提交失败');
          }
        });
      }, err=>{
        goLogin();
      });
      
    }else{
      console.error('提交地址验证错误, 请检查地址输入信息');
      failMsg('地址验证失败');
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