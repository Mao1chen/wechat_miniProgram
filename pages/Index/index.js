// pages/index/index.js
import ajax from '../../API/ajax'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banners:[],  //初始化数据
        recommendList:[],
        RanksList:[]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 发送请求 拿banner的数据
        this.getInitInfo()
    },
    async getInitInfo(){
        try {
            let data = await ajax('/banner',{type:1})
            this.setData({banners:data.banners})
            data = await ajax('/personalized')
            this.setData({recommendList:data.result})
            let index = 0
            let RankArr = []
            while (index < 5) {
                data = await ajax(`/top/list?idx=${index}`)
                index++
                RankArr.push({name:data.playlist.name,tracks:data.playlist.tracks})
                // 每回来一条数据我们就更新一次状态，这样会多次渲染页面。但是对网络不好的用户体验更好
                // this.setData({RanksList:RankArr})
            }
            // 统一渲染数据，不进行多次渲染，提高性能 但是对网络不好的用户体验不好
            this.setData({RanksList:RankArr})
        } catch (error) {
            throw error
        }
    },
    navRecommend(){
        wx.navigateTo({
          url: "/songPackage/pages/DayRecommend/recommend"
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