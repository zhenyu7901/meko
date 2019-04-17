// pages/my/other_attestation/other_attestation.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content:{}
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
    onLoad: function (options) {

    },
    onShow: function () {

    },
})