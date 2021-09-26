// pages/center/center.js
//手指点击的左边
import ajax from '../../API/ajax'
let startClientY;
let moveClientY;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        moveKey:'translateY(0)',
        endKey:'',
        userInfo:{},
        histroySong:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const userInfo = wx.getStorageSync('userInfo') || {}
        this.setData({
            userInfo
        })
        this.getHistory(this.data.userInfo.userId)
    },
    // 最近播放请求
    async getHistory(userId){
       const result = await ajax('/user/record',{uid:userId,type:1})
       const histroySong = result.weekData.slice(0,10).map((item,index)=>{item.id = index,index++
        return item})
       this.setData({histroySong})
    },
    // 手指点下的回调
    handleStart(event){
        this.setData({
            endKey:''
        })
        startClientY =  event.touches[0].clientY
    },
    handleMove(event){
        moveClientY =  event.touches[0].clientY
        let lastKey = moveClientY - startClientY
        if(lastKey>80) lastKey = 80
        this.setData({
            moveKey:`translateY(${lastKey}rpx)`
        })
    },
    handleEnd(){
        this.setData({
            moveKey:'translateY(0)',
            endKey:'transform 1s linear'
        })
    },
    // 去登录页面的回调
    handleToLogin(){
        if(!!this.data.userInfo.name) return
       wx.navigateTo({
         url: "/loginPackage/pages/Login/login"
       })
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