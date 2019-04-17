// pages/publish/publish.js
const qiniu = require('../../utils/qiniuUploader.js');
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: "",
        url:'',
        src:'',
        title:'',
        huati:'',
        location:'',
        mapshow: false,
        latitude: 0, //地图初次加载时的纬度坐标
        longitude: 0, //地图初次加载时的经度坐标
        name: "" //选择的位置名称
    },
    // 选择图片
    selectimg() {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                that.setData({
                    src: res.tempFilePaths[0]
                })
            }
        })
    },
    // 选择系统图片
    selectsystem(e){
        let src = app.dataSet(e).src
        let url = app.dataSet(e).url
        this.setData({
            src,
            url
        })
    },
    // 预览图片
    imgYu(e){
        var src = app.dataSet(e).src;//获取data-src
        var imgList = [];//获取data-list
        imgList.push(src)
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        })
    },
    // input值
    bindtitle(e){
        this.setData({
            title: e.detail.value
        })
    },
    // 传值
    bindhuati(e){
        this.setData({
            huati: e.detail.value
        })
    },
    onLoad: function(options) {

    },
    onShow: function() {

    },
    subupload(){
        if(this.data.title==''){
            app.toast('主题不能为空')
        }else if(this.data.huati==''){
            app.toast('描述不能为空')
        }else if(this.data.src==''){
            app.toast('图片不能为空')
        }else if(this.data.address==''){
            app.toast('定位不能为空')
        }else{
            wx.showLoading({
                title: '提交中',
            })
            if (this.data.src == 'https://qiniu.ayouayou.com/meko/normal/1.gif' || this.data.src == 'https://qiniu.ayouayou.com/meko/normal/2.gif' || this.data.src == 'https://qiniu.ayouayou.com/meko/normal/3.gif' || this.data.src == 'https://qiniu.ayouayou.com/meko/normal/4.gif'){
                this._submit(this.data.src);
            }else{

                const d = new Date().getTime();
                const index = this.data.src.lastIndexOf('.')
                const suffix = this.data.src.slice(index);
                const key = 'image' + d + suffix;
                this.upload(this.data.src, key).then(() => {
                    this._submit(key);
                })
            }
           
        }
    },
    _submit(src){
const data = {
    cover:src,
    description:this.data.huati,
    location:this.data.location,
    position:this.data.address,
    theme:this.data.title
}
console.log(data)
        app.post('topic/topic', data).then(res => {
            if (res.code === '200') {
                app.toast('发布成功');
                wx.hideLoading()
                wx.switchTab({ url: '/pages/plaza/plaza' })
            } else {
                wx.hideLoading()
                app.toast(res.message);
                console.log(res)
            }
        })
    },
    // 定位
    onChangeAddress() {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'XPPBZ-GZ4WI-IGGGP-5IDQO-B5LGH-FPBKR'
        });
        this.setData({
            mapshow: true
        })
        this.moveToLocation();
    },
    //移动选点
    moveToLocation: function() {
        var that = this;
        wx.chooseLocation({
            success: function(res) {
                console.log(res)
                that.setData({
                    location: res.longitude + '@' + res.latitude,
                    address: res.name,
                    mapshow: false
                })
                console.log(that.data.location)
                console.log(that.data.address)
            },
            fail: function() {
                that.setData({
                    mapshow: false
                })
                wx.getSetting({
                    success: function(res) {
                        var statu = res.authSetting;
                        if (!statu['scope.userLocation']) {
                            wx.showModal({
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                                success: function(tip) {
                                    if (tip.confirm) {
                                        wx.openSetting({
                                            success: function(data) {
                                                if (data.authSetting["scope.userLocation"] === true) {
                                                    wx.showToast({
                                                        title: '授权成功',
                                                        icon: 'success',
                                                        duration: 1000
                                                    })
                                                    //授权成功之后，再调用chooseLocation选择地方
                                                    wx.chooseLocation({
                                                        success: function(res) {
                                                            that.setData({
                                                                location: res.longitude + '@' + res.latitude,
                                                                address: res.name,
                                                                mapshow: false
                                                            })
                                                        },
                                                    })
                                                } else {
                                                    wx.showToast({
                                                        title: '授权失败',
                                                        icon: 'success',
                                                        duration: 1000
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    },
                    fail: function(res) {
                        wx.showToast({
                            title: '调用授权窗口失败',
                            icon: 'success',
                            duration: 1000
                        })
                    }
                })
            }
        });
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