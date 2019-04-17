//app.js
const requesturl = 'https://test.qianbaoxianjingji.com/meko/'

App({
    onLaunch: function() {
        this.login()
    },
    get(url, data) {
        var cookie = wx.getStorageSync('token') ? 'JSESSIONID=' + wx.getStorageSync('token') : ''
        var that = this
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${requesturl}${url}`,
                data,
                method: 'get',
                header: {
                    cookie: cookie
                },
                success(res) {
                    if (res.data.code == '1100') {
                        that.login()
                        console.log(res.message)
                    } else {
                        resolve(res.data);
                    }

                },
                fail(res) {
                    reject(new Error(res));
                }
            });
        });
    },
    post(url, data) {
        var cookie = wx.getStorageSync('token') ? 'JSESSIONID=' + wx.getStorageSync('token') : ''
        var that = this
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${requesturl}${url}`,
                data: data,
                method: 'post',
                header: {
                    cookie: cookie
                },
                success(res) {
                    if (res.data.code == '1100') {
                        that.login()
                        console.log(res.message)
                    } else {
                        resolve(res.data);
                    }
                },
                fail(res) {
                    reject(new Error(res));
                }
            });
        });
    },
    put(url, data) {
        var cookie = wx.getStorageSync('token') ? 'JSESSIONID=' + wx.getStorageSync('token') : ''
        var that = this
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${requesturl}${url}`,
                data: data,
                method: 'put',
                header: {
                    cookie: cookie
                },
                success(res) {
                    if (res.data.code == '1100') {
                        that.login()
                        console.log(res.message)
                    } else {
                        resolve(res.data);
                    }
                },
                fail(res) {
                    reject(new Error(res));
                }
            });
        });
    },
    // 提示
    toast(title, icon) {
        wx.showToast({
            title,
            icon: icon ? icon : 'none'
        })
    },
    //   跳转到下一页
    toUrl(url) {
        wx.navigateTo({
            url
        })
    },
    //   跳转到导航页
    toRedirect(url) {
        wx.redirectTo({
            url
        })
    },
    // 添加缓存
    setCache(key, value) {
        try {
            wx.setStorageSync(key, value)
        } catch (e) {
            console.log('set', e)
        }
    },
    // 获取缓存
    getCache(key) {
        var value;
        try {
            value = wx.getStorageSync(key)
        } catch (e) {
            console.log('get', e);
            // Do something when catch error
        }
        return value;
    },
    // 获取传参
    dataSet(e) {
        const dataset = e.currentTarget.dataset;
        return dataset;
    },
    // // 登录
    login() {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            console.log(res)
                            this.setCache('userinfo', res.userInfo)
                            wx.login({
                                success: res => {
                                    console.log(res)
                                    this.get('system/getOpenId', { jsCode: res.code }).then(res => {
                                        if (res.code == '200') {
                                            var userinfo = this.getCache('userinfo')
                                            console.log(userinfo)
                                            this.put('user/vxLogin', { avatar: userinfo.avatarUrl, sex: userinfo.gender, name: userinfo.nickName, openId: JSON.parse(res.data).openid }).then(res => {
                                                this.setCache('token', res.data.token)
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })


        // wx.login({
        //     success: res => {
        //         console.log(res)
        //         this.get('system/getOpenId', {
        //             jsCode: res.code
        //         }).then(res => {
        //             if (res.code == '200') {
        //                 console.log(res)
        //                 var userinfo = this.getCache('userinfo')
        //                 this.put('user/vxLogin', {
        //                     avatar: userinfo.avatarUrl,
        //                     name: userinfo.nickName,
        //                     sex: userinfo.gender,
        //                     openId: JSON.parse(res.data).openid
        //                 }).then(res => {
        //                     console.log(res)
        //                     this.setCache('token', res.data.token)
        //                     this.setCache('type', res.data.type)
        //                 })
        //             }
        //         })
        //     }
        // })
    },
    globalData: {
        userInfo: null
    }
})