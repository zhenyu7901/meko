// pages/plaza/search/search.js、
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        searchList:[],
        condition:'',
        page: 0, 
        size: 10,
    },

    onLoad: function (options) {
this.setData({
    condition: options.condition
})
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: res.windowHeight
                })
            }
        })
    },
    onShow: function () {
        this.getsearchList()
    },
    onSearch(e) {
        this.setData({
            condition:e.detail
        })
        this.getsearchList()
    },
    getsearchList() {
        app.get('topic/search', { condition: this.data.condition, page: 0, size: 10 }).then(res => {
            if (res.code == '200') {
                this.setData({
                    searchList: res.data
                })
            } else {
                app.toast(res.message)
            }
        })
    },
    lower() {
        var searchList = this.data.searchList
        var condition = this.data.condition
        var size = this.data.size
        var page = this.data.page + 1
        app.get('topic/search', {
            page,
            size,
            condition
        }).then(res => {
            if (res.code == '200') {
                var cont = searchList.concat(res.data)
                this.setData({
                    searchList: cont,
                    page: page
                })
            } else {
                app.toast(res.message)
            }
        })
    },
})