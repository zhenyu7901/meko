// pages/topic/topic_detail/user_list/user_list.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tableList: [],
        total: ''
    },
    getlist(topicUuid) {
        app.get('topic/user', {
            topicUuid
        }).then(res => {
            if (res.code == '200') {
                this.setData({
                    tableList: res.data,
                    total: res.total
                })
            } else {
                app.toast(res.message)
            }
        })
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '参与用户'
        })
        this.getlist(options.topicUuid)
    },
    onShow: function() {

    },

})