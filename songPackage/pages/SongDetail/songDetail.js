// pages/SongDetail/songDetail.js
import ajax from '../../../API/ajax.js'
import pubsub from 'pubsub-js'
import moment from 'moment'
let appInstance = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isswitch:false,
        currentTime:'00:00',
        durationTime:'00:00',
        currentWidth:'',
        songDetail:{},
        songId:0,
        musicLink:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let {id} = options
        this.getSongDetail(id)
        this.setData({songId:id})
        //一上来就播放
        // this.getSongUrl(this.data.isswitch)
        if(appInstance.globalData.isMusicPlay&&appInstance.globalData.musicId ==id){
            this.setData({
                isswitch:true
            })
        }
        // 生成播放音乐的实列
         this.getBackgroundAudioManager = wx.getBackgroundAudioManager()
        //  监听音乐播放/暂停/停止
        this.getBackgroundAudioManager.onPlay(()=>{
            this.changeIsPlayState(true)
            appInstance.globalData.musicId = id
        })
        this.getBackgroundAudioManager.onPause(()=>{
            this.changeIsPlayState(false)
        })
        this.getBackgroundAudioManager.onStop(()=>{
            this.changeIsPlayState(false)
        })
        // 监听音乐实时播放的进度
        this.getBackgroundAudioManager.onTimeUpdate(()=>{
            let currentWidth = this.getBackgroundAudioManager.currentTime /this.getBackgroundAudioManager.duration * 450
            // 把播放的当前时长实时设置给状态里的当前时长
            this.setData({
            currentTime:moment(this.getBackgroundAudioManager.currentTime * 1000).format('mm:ss'),
            currentWidth
        })

        })
        // 订阅详情页发送过来的ID
        pubsub.subscribe('cutSongId',(_,songID)=>{
            this.getSongDetail(songID)
            this.setData({songId:songID})
            this.getSongUrl(true)
        })
    },
    // 切换歌曲的回调
    handleSwitch(event){
        // 取出你点的是哪个类型
        let type = event.currentTarget.id
        pubsub.publish('switchSong',type)
    },
    // 修改状态的功能函数
    changeIsPlayState(boolean){
        this.setData({
            isswitch:boolean
        })
        appInstance.globalData.isMusicPlay = boolean
    },
    // 根据ID获取播放信息
    async getSongDetail(id){
       const songDetail =  await ajax('/song/detail',{ids:id})
       let durationTime = songDetail.songs[0].dt
       this.setData({
           songDetail:songDetail.songs[0],       
            durationTime:moment(durationTime).format('mm:ss')
        })
       wx.setNavigationBarTitle({
         title: this.data.songDetail.name,
       })
    },
    // 修改播放状态的回调
    setIsSwitch(){
        let isswitch = !this.data.isswitch
        let musicLink = this.data.musicLink
        this.setData({isswitch})
        this.getSongUrl(isswitch,musicLink)
    },
    // 获取歌曲播放地址的功能函数
    async getSongUrl(isswitch,musicLink){
        if(isswitch){
            // 获取播放歌曲地址的请求
            // 如果当前url不存在我们才会去发请求拿
            if(!musicLink){
                let musicLinkData =  await ajax('/song/url',{id:this.data.songId})
                musicLink = musicLinkData.data[0].url
                this.setData({
                    musicLink
                })
            }
                this.getBackgroundAudioManager.src = this.data.musicLink
                this.getBackgroundAudioManager.title = this.data.songDetail.name
        //    appInstance.globalData.isMusicPlay = true  //修改全局的播放状态
        //    appInstance.globalData.musicId = this.data.songId //存入当前歌曲的ID
        }else {
            this.getBackgroundAudioManager.pause()
            // appInstance.globalData.isMusicPlay = false
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