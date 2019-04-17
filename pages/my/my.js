// pages/my/my.js
const app = getApp()
const login = require('../../utils/login.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        age: 22,
        grade: 3,
        content: {},
        show: false,

    },
    tourl() {
        app.toUrl('/pages/my/data/data')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let userinfo = app.getCache('userinfo')
        this.setData({
            userinfo
        })
    },
    onShow: function() {
        this.getcontent()
    },
    getuserInfo(e) {
        console.log(e)
        if (e.detail.userInfo) {
            app.setCache('userinfo', e.detail.userInfo)
            let userinfo = app.getCache('userinfo')
            this.setData({
                userinfo
            })
            // 获取完用户信息调登录接口
            login._login(this.onShow)
        }
    },
    getcontent() {
        app.get('user/user').then(res => {
            if (res.code == '200') {
                this.setData({
                    content: res.data
                })
            } else {
                app.toast(res.message)
            }
        })
    },
})