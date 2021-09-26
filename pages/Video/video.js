// pages/video/video.js
import ajax from '../../API/ajax'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList:[],
        navId:'',
        videoList:[],
        imgId:'',
        updataCurrentVideoTimer:[],
        isTrue:false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getVideoGroupList()
    },
    // 根据导航栏ID获取视频的回调
    async getVideoList(navid){
        const result = await ajax(`/video/group`,{id:navid})
        let videoList = result.datas.map((item,index)=>{
                item.id = index
                return item
         })
        this.setData({
            videoList,
            isTrue:false
        })
        wx.hideLoading()
    },
    // 视频导航栏的回调
    async getVideoGroupList(){
        try {
            const result = await ajax("/video/group/list")
            // slice不会改变原数组是返回一个新的
            //splice会对原数组进行增删改查
            this.setData({
                videoGroupList:result.data.slice(0,14),
                navId:result.data[0].id
            })
           this.getVideoList(this.data.navId)
        } catch (error) {
           wx.showToast({
             title: '网络繁忙',
             icon:'none'
           })
           throw error
        }
    },
    /*  
        需求:1.当播放新视频的时候关掉之前播放的视频
        思路:
           1.找到关闭视频的方法 wx.createVideoContext('id', component) //会根据视频ID创建一个上下文对象
           2.必须找到上一个视频的实列对象,然后关掉
        设计模式:单列模式
           1.需要创建多个对象的情况下,使用一个变量来保存,始终只有一个对象
           2.当创建新的对象的时候会把之前的对象覆盖掉
           3.节省内存空间
    */
   //那边一点击播放就会掉这个回调,一点击把当前视频的ID传过来,这边取出视频ID
   //视频和图片切换的回调
    handleSwitch(event){
        // 取出传过来的当前视频ID
        let vid = event.target.id
        // 当前视频的实列上下文对象存在并且当前实列对象的视频ID不等于你传过来的视频ID我们才停止
        // this.contextObject && this.vid !== vid && this.contextObject.stop()
        // // 把视频ID挂载在当前实列页面上
        // this.vid = vid
        this.setData({imgId:vid})  //传过来当前视频ID并且设置进状态
        // 根据传过来的视频ID创建当前视频ID的视频实列对象
        this.contextObject = wx.createVideoContext(vid)
        let {updataCurrentVideoTimer} = this.data
        let videoItem = updataCurrentVideoTimer.find(item => item.vid == vid )
        if(videoItem){
            this.contextObject.seek(videoItem.currentTime)
        }
        this.contextObject.play() //并播放
    },
    // 播放完清除当前保存的视频进度
    clearVideoTime(event){
        let vid = event.currentTarget.id
        let {updataCurrentVideoTimer} = this.data
        updataCurrentVideoTimer.splice(updataCurrentVideoTimer.findIndex(item=>item.vid ==vid),1)
        this.setData({updataCurrentVideoTimer})
    },
    // 保存当前视频进度的回调
    handleSetTime(event){
        let vid = event.target.id
        let currentTime = event.detail.currentTime
        let videoTimeObj = {vid,currentTime}
        let {updataCurrentVideoTimer} = this.data
        let vodemoItem = updataCurrentVideoTimer.find(item => item.vid == vid)
        if(vodemoItem){
         vodemoItem.currentTime = event.detail.currentTime
        }else {
            updataCurrentVideoTimer.push(videoTimeObj)
        }
        this.setData({updataCurrentVideoTimer})
    },
    // 切换当前导航栏ID的回调 并获取最新视频列表
    setNavId(event){
                //这里传过来的是个字符串的ID
                let id = event.target.id
                this.setData({
                    // 位移运算符,
                    //将目标数据先转换成二进制,然后去移动指定的唯一数字,移出去的不要,不够的用零补齐
                    //位移0位会强制转换成number数据类型
                    navId:id >>> 0,
        videoList:[]
                })
                wx.showLoading({
                  title: '正在加载'
                })
                this.getVideoList(this.data.navId)
            },
        // 下拉刷新的回调
        handleNewData(){
            this.getVideoList(this.data.navId)
        },
        //滚动到底部的回调
        handleBase(){
           console.log(1);
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