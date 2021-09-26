// ajax封装函数
/*
1.封装功能函数
   1.功能点明确
   2.函数内部保留固定得代码(静态代码)
   3.将动态的数据抽取出来,由使用者提供最终的数据,以形参的形式提取
   4.一个良好的功能函数应该设置形参的默认值
2.封装功能组件
   1.功能点明确
   2.组件内部应该保留静态代码
   3.将动态的数据提取成props参数,由使用者提供最终的数据
   4.一个良好的组件应该设置组件props数据的必要性以及数据类型
*/
import config from './config'
export default (url,data={},method='GET')=>{
   return new Promise((resolve,reject)=>{
    wx.request({
        url: config.host + url,
        data,
        method,
      //   读取本地cookie,如果读取不到就返回空串
        header:{Cookie:wx.getStorageSync('cookie').toString() || ''},
        success:(res)=>{
           if(data.isLogin){
              wx.setStorageSync('cookie', res.cookies)
           }
            resolve(res.data)
        },
        fail:(error)=>{
            reject(error)
        }
      })
   })
}