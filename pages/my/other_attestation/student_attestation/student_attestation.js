const qiniu = require('../../../../utils/qiniuUploader.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: ''
    },
    selectpicture() {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                that.setData({
                    src: tempFilePaths
                })
            }
        })
    },
    onLoad: function (options) {

    },
    onShow: function () {

    },
    onsubmit() {
        if (this.data.src == '') {
            app.toast('图片不能为空')
        } else {
            const d = new Date().getTime();
            const index = this.data.src.lastIndexOf('.')
            const suffix = this.data.src.slice(index);
            const key = 'image' + d + suffix;
            this.upload(this.data.src, key).then(() => {
                this._submit(key);
            })
        }
    },
    _submit(src) {
        const data = {
            cover: src,
        }
        console.log(data)
        app.post('topic/topic', data).then(res => {
            if (res.code === '200') {
                app.toast('认证成功')
                wx.hideLoading()
                wx.switchTab({ url: '/pages/plaza/plaza' })
            } else {
                wx.hideLoading()
                app.toast(res.message);
                console.log(res)
            }
        })
    },
    // 上传到七牛云
    upload(url, key) {
        console.log('开始上传')
        return new Promise((resolve, reject) => {
            app.get('system/token').then(res => {
                if (res.code == '200') {
                    const token = res.data;
                    qiniu.upload(url, res => {
                        resolve(res);
                    }, error => {
                        console.log(error);
                        reject(error)
                    }, {
                            region: 'SCN',
                            domain: 'qiniu.ayouayou.com', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                            key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                            uptoken: token
                        }, () => { });
                }
            });
        })
    },
})