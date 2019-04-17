// pages/activity/activity.js
const app = getApp()
const login = require('../../utils/login.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tableList: [{ src:'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',address:'杭州'}],
        userinfo:null,
        activityList:[]
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
    
    onLoad: function (options) {
        let userinfo = app.getCache('userinfo')
        this.setData({
            userinfo
        })
    },
    onShow: function () {
        this.getactivityList()
    },
    getactivityList() {
        app.get('topic/official').then(res => {
            if (res.code == '200') {
                this.setData({
                    activityList: res.data
                })
            } else {
                app.toast(res.message)
            }
        })
    },
})