const app = getApp()
const login = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            console.log(res)
                            app.setCache('userinfo', res.userInfo)
                            wx.login({
                                success: res => {
                                    console.log(res)
                                    app.get('system/getOpenId', { jsCode: res.code }).then(res => {
                                        if (res.code == '200') {
                                    
                                            var userinfo = app.getCache('userinfo')
                                            console.log(userinfo)
                                            app.put('user/vxLogin', { avatar: userinfo.avatarUrl, sex: userinfo.gender,name: userinfo.nickName, openId: JSON.parse(res.data).openid }).then(res => {
                                                app.setCache('token', res.data.token)
            
                                                resolve()
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
    })
}
const _login = fn => {
    login().then(() => {
        fn()
    })
}
module.exports = {
    login, _login
}