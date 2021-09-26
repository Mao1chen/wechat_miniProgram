// pages/DayRecommend/recommend.js
import ajax from '../../../API/ajax'
import pubsub from 'pubsub-js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day:'',
        month:'',
        recommendList:[],
        index:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            day:new Date().getDate(),
            month:new Date().getMonth() + 1
        })
        this.getRecommendSongList()
        // 订阅歌曲页的上一首下一首并且发布新的歌曲ID
        pubsub.subscribe('switchSong',(_,switchType)=>{
            let {recommendList,index} = this.data
            if(switchType== 'next'){
                // 数组长度-1等于最后一个元素的索引
                // 如果当前索引等于当前数组的最后一个索引
                (index === recommendList.length - 1) && (index = -1)
                index+=1
            }else{
                // 如果当前索引等于0
                (index === 0) && (index = recommendList.length)
                index-=1
            }
            this.setData({
                index
            })
            pubsub.publish('cutSongId',recommendList[index].id)
        })
    },
    // 跳转到歌曲详情的函数
    handleToSongDetail(event){
        let {index,songid} = event.target.dataset
        wx.navigateTo({
          url: `/pages/SongDetail/songDetail?id=${songid}`
        })
        this.setData({index})
    },
    // 获取今日推荐歌曲列表
    async getRecommendSongList(){
        let resultdata = await ajax('/recommend/songs')
        this.setData({
            recommendList:resultdata.recommend
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