// pages/topic/topic_detail/topic_detail.js
const app = getApp()
const qiniu = require('../../../utils/qiniuUploader.js');
const login = require('../../../utils/login.js');
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content:{},
        inputvalue:'',
        topicUuid:'',
        comment: [{ name: 'hanghzou', content: 'safda' }, { name: 'jkajsdl;f', content:'sa'}],
        show:false,
        imageshow:false,
        text: 'hanghzou',
        src: 'https://qiniu.ayouayou.com/meko/normal/11871555409015_.pic_hd.jpg',
        contenttext: '啊啊啊啊我的世界哈哈！',
        savedImgUrl: ''
    },
    // 打开分享弹出框
    onshare(){
        this.setData({
            show:true
        })
    },
    // 生成图片
    makeimg(){
        wx.showLoading({
            title: '正在生成分享图片',
        })
        const promisify = api => {
            return (options, ...params) => {
                return new Promise((resolve, reject) => {
                    const extras = {
                        success: resolve,
                        fail: reject
                    }
                    api({ ...options, ...extras }, ...params)
                })
            }
        }
        const wxGetImageInfo = promisify(wx.getImageInfo)

        Promise.all([
            wxGetImageInfo({
                src: 'https://qiniu.ayouayou.com/meko/normal/11871555409015_.pic_hd.jpg'
            }),
            wxGetImageInfo({
                src: this.data.src
            }),
            wxGetImageInfo({
                src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640'
            })
        ]).then(res => {
            const ctx = wx.createCanvasContext('canvasPoster')
            // 底图
            ctx.drawImage(res[0].path, 0, 0, 375, 590)
            // 小程序码
            ctx.drawImage(res[2].path, 230, 420, 125, 125)
            // ctx.save()
            ctx.setTextAlign('left')    // 文字居中
            ctx.setFillStyle('#000')  // 文字颜色：黑色
            ctx.setFontSize(30)         // 文字字号：22px
            ctx.fillText(this.data.text, 80, 60)
            const content = this.data.contenttext
            ctx.setTextAlign('center')
            ctx.fillText(content.substring(0, 4), 187, 280)

            ctx.fillText(content.substring(4), 187, 320)
            // 控制头像为圆形
            ctx.setStrokeStyle('rgba(0,0,0,.2)') //设置线条颜色，如果不设置默认是黑色，头像四周会出现黑边框
            ctx.arc(50, 50, 20, 0, 2 * Math.PI)
            ctx.stroke()
            //画完之后执行clip()方法，否则不会出现圆形效果
            ctx.clip()
            ctx.drawImage(res[1].path, 30, 30, 40, 40)
            ctx.save()
            ctx.draw()

        }).then(()=>{
            var that = this;
            setTimeout(function () {
                wx.canvasToTempFilePath({
                    canvasId: 'canvasPoster',
                    success: function (res) {
                        wx.hideLoading()
                        console.log(res, '保存')
                        that.setData({
                            savedImgUrl: res.tempFilePath,
                            imageshow: true
                        })
  
                    },
                    fail:function(res){
                        wx.hideLoading()
                    }
                })
            }, 1000)
        })
   
    },
    //保存海报
    saveImageToPhoto: function () {
        var that = this;
        setTimeout(function () {
            if (that.data.savedImgUrl != "") {
                wx.saveImageToPhotosAlbum({
                    filePath: that.data.savedImgUrl,
                    success: function () {
                        wx.showModal({
                            title: '保存图片成功',
                            content: '图片已经保存到相册，快去炫耀吧！',
                            showCancel: false,
                            success: function (res) {
                                that.setData({
                                    canvasShow: false,
                                })
                            },
                            fail: function (res) { },
                            complete: function (res) { },
                        });
                    },
                    fail: function (res) {
                        console.log(res);
                        if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") {
                            wx.showModal({
                                title: '保存图片失败',
                                content: '您已取消保存图片到相册！',
                                showCancel: false
                            });
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '保存图片失败，您可以点击确定设置获取相册权限后再尝试保存！',
                                complete: function (res) {
                                    console.log(res);
                                    if (res.confirm) {
                                        wx.openSetting({}) //打开小程序设置页面，可以设置权限
                                    } else {
                                        wx.showModal({
                                            title: '保存图片失败',
                                            content: '您已取消保存图片到相册！',
                                            showCancel: false
                                        });
                                    }
                                }
                            });
                        }
                    }
                })
            }
        }, 1500)
    },
    // 播放音频
    startaudio(e){
        console.log(e)
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src =app.dataSet(e).src
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
    },
    // 停止播放
    onHide: function () {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.stop(()=>{
            console.log('tingzi')
        })
    },
    // 分享好友
    onShareAppMessage: function () {
        var topicUuid = this.data.topicUuid
        var imageUrl = this.data.content.cover
        var content = this.data.content.theme
        return {
            title: content,
            imageUrl: imageUrl,
            path: '/pages/consult/details/details?topicUuid=' + topicUuid
        }
    },
    // 加载
    onLoad: function(options) {
        this.setData({
            topicUuid: options.topicUuid
        })
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
    // 进入用户列表
    tourl(){
        app.toUrl('/pages/topic/topic_detail/user_list/user_list?topicUuid=' + this.data.topicUuid)
    },
    // 显示
    onShow: function() {
        this.getcontent(this.data.topicUuid)
        this.getcomment(this.data.topicUuid)
    },
    // 赋值
    getvalue(e){
        this.setData({
            inputvalue: e.detail.value
        })
    },
    // 点击提交
    onsub(e){
        if (this.data.inputvalue == '') {
            app.toast('请输入内容')
        } else {
                this._onsub(0,this.data.inputvalue)
        }

    },
    // 提交
    _onsub(type,key){
  app.post('comment/comment', {
            topicUuid: this.data.topicUuid,
            content: key,
            type
        }).then(res => {
            if (res.code == '200') {
                this.getcomment(this.data.topicUuid)
                if(type==0){
                    this.setData({
                        inputvalue: ''
                    })
                }     
            }else{
                app.toast(res.message)
            }
        })
    },
    // 获取话题详情
    getcontent(topicUuid){
        app.get('topic/topic', {
            topicUuid
        }).then(res => {
            if (res.code == '200') {
                this.setData({
                    content: res.data
                })
                wx.setNavigationBarTitle({
                    title: res.data.theme
                })
            } else {
                app.toast(res.message)
            }
        })
    },
    // 获取评论
    getcomment(topicUuid) {
        app.get('comment/comment', {
            topicUuid,
            page:0,
            size:1000
        }).then(res => {
            if (res.code == '200') {
                this.setData({
                    comment: res.data
                })
            } else {
                app.toast(res.message)
            }
        })
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
    // 选择图片
    selectimg() {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const src = res.tempFilePaths[0]
                const d = new Date().getTime();
                const index = src.lastIndexOf('.')
                const suffix =src.slice(index);
                const key = 'image' + d + suffix;
                that.upload(src, key).then(() => {
                    that._onsub(1,key);
                })
                // that.setData({
                //     src: res.tempFilePaths[0]
                // })
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
    
    // 开始录音
    startrecord(e) {
        this.startTime = e.timeStamp;
        this.startPoint = e.touches[0];
        const options = {
            duration: 10000,
            sampleRate: 44100,
            numberOfChannels: 1,
            encodeBitRate: 192000,
            format: 'mp3',
            frameSize: 50
        }
        recorderManager.start(options)
        wx.showToast({
            title: '正在录音，上滑取消',
            icon: 'none',
            duration: 60000
        })
        recorderManager.onStart(() => {
            console.log('recorder start')
        })
    },
    // 取消录音
    closerecord(e){
        this.moveLenght = e.touches[e.touches.length - 1].clientY - this.startPoint.clientY;
        if (Math.abs(this.moveLenght)>50){
            wx.hideToast()
            recorderManager.pause()
            wx.showToast({
                title: '已取消',
                icon: 'none',
                duration: 1000
            })
        }
    },
    // 停止录音
    endrecord(e){
        this.endTime = e.timeStamp;
        wx.hideToast()
        if (this.endTime - this.startTime > 2000 && Math.abs(this.moveLenght) < 50) {
            wx.showToast({
                title: '录音结束',
                icon: 'none',
                duration: 1000
            })
        }
        recorderManager.onStop((res) => {
            const src = res.tempFilePath
            console.log(res)
            const d = new Date().getTime();
            const index = src.lastIndexOf('.')
            const suffix = src.slice(index);
            const key = 'record' + d + suffix;
            this.upload(src, key).then(() => {
                this._onsub(2, key);
            })
        })
    },
    // 录音时间过短
    short(e){
        if (this.endTime - this.startTime < 2000) {
            wx.showToast({
                title: '录音时间太短',
                icon: 'none',
                duration: 1000
            })
        } 
    },
})