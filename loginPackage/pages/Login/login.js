// pages/Login/login.js

/*
    登录说明:
     1.收集表单数据
     2.前端验证
      (1)验证用户信息是否合法(账号,密码的格式)
      (2)前端验证不通过,就提示用户内容不合法,不需要发送请求后端验证
      (3)前端验证通过,发请求(账号,密码)进行后端验证
    3.后端验证
      (1)验证当前用户是否存在,如果该用户不存在,直接返回登陆失败并提示,如果该用户存在,需要验证密码是否正确,密码不正确返回给前端,并提示密码不正确,密码正确,返回登录成功数据  
*/
import ajax from '../../../API/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:'',
        password:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    handleSaveData(event){
        // event.target不一定是绑定事件的当前元素 也有可能是触发事件的元素
        // event.currentTarget  一定是绑定事件的当前元素
        // let type = event.currentTarget.id  通过id传过来唯一标识  唯一
        let type = event.currentTarget.dataset.type  //通过dataset来传递参数 传多个参数
        this.setData({
            [type]:event.detail.value
        })
    },
    async handleLogin(){
        let {phone,password} = this.data 
        let phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
        if(!phone){
            wx.showToast({
              title: '手机号不能为空',
              icon:'error'
            })
            return
        } 
        if(!phoneReg.test(phone)){
            wx.showToast({
              title: '手机号不合法',
              icon:'error'
            })
            return
        } 
        if(!password){
            wx.showToast({
              title: '密码不能为空',
              icon:'error'
            })
            return
        }
        let result = await ajax('/login/cellphone',{phone,password,isLogin:true})
        if(result.code == 200){
            wx.showToast({
              title: '登录成功',
              icon:'success'
            })
            // 请求成功并且登录成功,我们存入本地存储,然后跳转到个人中心页面
            wx.setStorageSync('userInfo', {name:result.profile.nickname,imgUrl:result.profile.avatarUrl,userId:result.profile.userId})
            wx.reLaunch({
              url: "/pages/Center/center"
            })
        }else if(result.code == 502){
            wx.showToast({
              title: '密码错误',
              icon:'error'
            })
        }else if(result.code ==501){
            wx.showToast({
              title: '账号未注册',
              icon:'error'
            })
        }else {
            wx.showToast({
              title: '网络繁忙',
              icon:'error'
            })
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