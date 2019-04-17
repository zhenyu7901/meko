// pages/plaza/plaza.js
const app = getApp()
const login = require('../../utils/login.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: '',
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        page:0,
        size:10,
        location:'',
        officialList: [],
        hotList:[],
        nearList:[],
        searchShow:true
    },
    onChange(e){
        if (e.detail.index==1){
            this.setData({
                searchShow:false
            })
            this.getlocation()
        }else{
            this.setData({
                searchShow: true
            })
            this.getofficialList()
            this.gethotList()
        }
    },
    // 打开话题详情
    entertopic(e) {
        var topicUuid = e.detail.uuid
        app.toUrl('/pages/topic/topic_detail/topic_detail?topicUuid=' + topicUuid)
    },
    // 打开发布话题
    toupload(){
        app.toUrl('/pages/publish/publish')
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
        // login._login(this.onShow)
    },
    onShow: function() {
        this.getofficialList()
        this.gethotList()
    },
    // 获取官方话题
    getofficialList(){
        app.get('topic/official').then(res => {
            if(res.code=='200'){
                this.setData({
                    officialList: res.data
                })
            }else{
                app.toast(res.message)
            }  
        })
    },
    // 获取热门话题
    gethotList(){
        app.get('topic/hot').then(res => {
            if (res.code == '200') {
                this.setData({
                    hotList: res.data
                })
            } else {
                app.toast(res.message)
            }    
        })
    },
    getlocation(){
        var that = this
        wx.getSetting({
            success: (res) => {
                console.log(JSON.stringify(res))
                wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        var latitude = res.latitude
                        var longitude = res.longitude
                        that.setData({
                            location: longitude +'@'+ latitude
                        })
                        that.getnearList()
                    },
                    fail: function (res) {
                        console.log('fail' + JSON.stringify(res))
                    }
                })
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (dataAu) {
                                        if (dataAu.authSetting["scope.userLocation"] == true) {
                                            wx.getLocation({
                                                type: 'wgs84',
                                                success: function (res) {
                                                    var latitude = res.latitude
                                                    var longitude = res.longitude
                                                    that.setData({
                                                        location: longitude + latitude+''
                                                    })
                                                    that.getnearList()
                                                },
                                                fail: function (res) {
                                                    console.log('fail' + JSON.stringify(res))
                                                }
                                            })
                                          
                                            //再次授权，调用wx.getLocation的API

                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    //调用wx.getLocation的API
                }
                else {
                    //调用wx.getLocation的API
                }
            }
        })
    },
    // 获取附近的话题
    getnearList(){
        app.get('topic/near', { location:this.data.location,page:0,size:10}).then(res => {
            if (res.code == '200') {
                this.setData({
                    nearList: res.data
                })
            } else {
                app.toast(res.message)
            }  
        })
    },
    // 无限滚动（滚动到底部刷新）
    lower() {
        var nearList = this.data.nearList
        var location = this.data.location
        var size = this.data.size
        var page = this.data.page + 1
        app.get('topic/near', {
            page,
            size,
            location
        }).then(res => {
            if (res.code == '200') {
                var cont = nearList.concat(res.data)
                this.setData({
                    nearList: cont,
                    page: page
                })
            } else {
                app.toast(res.message)
            }  
        })
    },
    onSearch(e) {
        app.toUrl('/pages/plaza/search/search?condition=' + e.detail)
    },
    getuserInfo(e){
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
    }
})