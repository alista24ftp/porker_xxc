// pages/member/edit/editPhoto/editPhoto.js
const config = require('../../../../config.js');
const login = require('../../../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  chooseImg: function (e) {
    let that = this;
    login.default.getLoginData().then(loginData=>{
      wx.chooseImage({
        count: 1,
        success: function (res) {
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths);
          wx.uploadFile({
            url: config.default.ApiHost + '/xcc/home/img', 
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              token: loginData.loginToken
            },
            success(res) {
              console.log(res)
              var data = JSON.parse(res.data)
              console.log(data)
              // do something
              if(data.code == 200){
                if(data.type == 1){
                  let hostRegex = new RegExp('^' + config.default.ApiHost);
                  let newPhoto = hostRegex.test(data.msg) ? data.msg : config.default.ApiHost + data.msg;
                  that.setData({
                    disabled: false,
                    photoLink: data.msg,
                    fullPhotoLink: newPhoto
                  });
                  wx.showToast({
                    title: '上传图片成功',
                  })
                  
                }else{
                  console.error('上传图片失败');
                  that.setData({
                    disabled: false,
                    photoLink: '',
                    fullPhotoLink: ''
                  });
                  wx.showToast({
                    title: '上传图片失败',
                    image: '/images/cross.png'
                  });
                }
              }else{
                console.error('上传图片参数错误');
                that.setData({
                  disabled: false,
                  photoLink: '',
                  fullPhotoLink: ''
                });
                wx.showToast({
                  title: '上传参数错误',
                  image: '/images/cross.png'
                });
              }
            },
            fail: function(err){
              console.error(err);
              that.setData({
                disabled: false,
                photoLink: '',
                fullPhotoLink: ''
              });
              wx.showToast({
                title: '上传图片失败',
                image: '/images/cross.png'
              });
            }
          })
        },
        fail: function(err){
          console.error(err);
          console.error('取消选择图片');
          that.setData({
            disabled: true,
            photoLink: '',
            fullPhotoLink: ''
          });
        }
      });
    }, err=>{
      console.error(err);
      wx.navigateTo({
        url: '/pages/member/login/login',
        success: function(res){
          wx.showToast({
            title: '请先登录',
            image: '/images/cross.png'
          });
        }
      });
    });
    
  },

  editImg: function(e){
    if(!this.data.disabled){
      let that = this;
      login.default.getLoginData().then(loginData=>{
        let userInfo = loginData.user;
        let token = loginData.loginToken;
        let photoLink = that.data.photoLink;
        let fullPhotoLink = that.data.fullPhotoLink;
        wx.request({
          url: config.default.ApiHost + '/xcc/home/userUpdate',
          method: 'POST',
          data: {
            user_photo: photoLink,
            token: token
          },
          success: function (res) {
            if (res.data.code == 200) {
              if (res.data.type == 1) {
                console.log('修改头像成功');
                userInfo.user_photo = fullPhotoLink;
                wx.setStorage({
                  key: 'userinfo',
                  data: {
                    user: userInfo,
                    loginToken: token
                  },
                  success: function(res){
                    wx.navigateBack({
                      delta: 1,
                      success: function(res){
                        wx.showToast({
                          title: '修改头像成功'
                        });
                      }
                    });
                  }
                });
                
              } else if (res.data.type == 2) {
                console.error('修改头像失败');
                wx.showToast({
                  title: '修改头像失败',
                  image: '/images/cross.png'
                });
              } else {
                console.error('修改头像参数错误');
                wx.showToast({
                  title: '修改参数错误',
                  image: '/images/cross.png'
                });
              }
            } else {
              console.error('修改头像状态异常');
              wx.showToast({
                title: '修改状态异常',
                image: '/images/cross.png'
              });
            }
          }
        });
      }, err=>{
        wx.navigateTo({
          url: '/pages/member/login/login',
          success: function(res){
            wx.showToast({
              title: '请先登录',
              image: '/images/cross.png'
            });
          }
        });
      });
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
  onShow: function (options) {
    let that = this;
    login.default.getLoginData().then(loginData=>{
      that.setData({
        disabled: true,
        fullPhotoLink: loginData.user.user_photo
      });
    }, err=>{
      wx.navigateTo({
        url: '/pages/member/login/login',
        success: function(res){
          wx.showToast({
            title: '请先登录',
            image: '/images/cross.png'
          })
        }
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