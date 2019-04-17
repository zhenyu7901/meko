// pages/topic/topic.js
const app = getApp()
const login = require('../../utils/login.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tableList: [],
        myList: [],
        show: false,
        actions: [{
            name: '确定'
        }, ],
        page:0,
        size:10,
        topicUuid:''
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
    // 关闭弹框
    onClose() {
        this.setData({
            show: false
        })
    },
    // 关闭话题
    off(e) {
        this.setData({
            show: true,
            topicUuid: e.detail.uuid
        })
    },
    // 确认关闭
    onSelect(e) {
        console.log(e)
        app.put('topic/topic', {
            flag: 2,
            topicUuid: this.data.topicUuid
        }).then(res => {
            if (res.code == '200') {
                this.getmyList()
                this.setData({
                    show: false
                })
            } else {
                app.toast(res.message)
            }
        })
    },
    // 切换tab
    onChange(e){
        if(e.detail.index==0){
            this.setData({
                page:0
            })
            this.getmyList()
        }else{

        }
    },
    // 无限滚动（滚动到底部刷新）
    lower() {
        var myList = this.data.myList
        var size = this.data.size
        var page = this.data.page + 1
        app.get('topic/myTopic', {
            page,
            size
        }).then(res => {
            if (res.code == '200') {
                var cont = myList.concat(res.data)
                this.setData({
                    myList: res.data
                })
            } else {
                app.toast(res.message)
            }
        })
    },
    // 打开话题详情
    entertopic(e){
        var topicUuid  = e.detail.uuid
        app.toUrl('/pages/topic/topic_detail/topic_detail?topicUuid=' + topicUuid)
    },
    onLoad: function(options) {
        let userinfo = app.getCache('userinfo')
        this.setData({
            userinfo
        })
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: res.windowHeight
                })
            }
        })
    },

    onShow: function() {
        this.getmyList()
    },
    // 获取我发起的话题
    getmyList() {
        app.get('topic/myTopic', {
            page: 0,
            size: 10
        }).then(res => {
            if(res.code=='200'){
                this.setData({
                    myList: res.data
                })
            }
        })
    },
})