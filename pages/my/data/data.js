// pages/my/data/data.js
const app = getApp()
const qiniu = require('../../../utils/qiniuUploader.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content:{},
        array: ['女', '男'],
        currentDate: new Date().getTime(),
        minDate: new Date().getTime(),
        date:'',
        src:'',
        feeling:['单身','热恋','已婚'],
        feelindex:null,
        interest:'',
        signature:'',
        name:'',
        index:null,


    },

    onInput(event) {
        console.log(event)
        // this.setData({
        //     currentDate: event.detail.value
        // });
    },
    getname(e){
        this.setData({
            name: e.detail.value
        })
    },
    getinterest(e){
        this.setData({
            interest: e.detail.value
        })
    },
    getsignature(e){
        this.setData({
            signature: e.detail.value
        })
    },
    bindPickerChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    feelchange(e){
        this.setData({
            feelindex: e.detail.value
        })
    },
    bindDateChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },
    submit(){
        wx.showLoading({
            title: '提交中',
        })
        this._submit(this.data.src);
        // const d = new Date().getTime();
        // const index = this.data.src.lastIndexOf('.')
        // const suffix = this.data.src.slice(index);
        // const key = 'image' + d + suffix;
        // this.upload(this.data.src, key).then(() => {
        //     this._submit(key);
        // })
    },
    _submit(src) {
        const data = {
            avatar: src,
            birthday: this.data.date,
            emotion: this.data.feeling[this.data.feelindex] ? this.data.feeling[this.data.feelindex]:'',
            hobby: this.data.interest,
            name: this.data.name,
            sex: this.data.index,
            sign: this.data.signature,
            uuid: this.data.uuid
        }
        console.log(data)
        app.post('user/edit', data).then(res => {
            if (res.code === '200') {
                app.toast('修改成功');
                wx.hideLoading()
                wx.switchTab({ url: '/pages/my/my' })
            } else {
                wx.hideLoading()
                app.toast(res.message);
                console.log(res)
            }
        })
    },


    onLoad: function (options) {

    },
    onShow: function () {
        this.getcontent()
    },
    getcontent() {
        app.get('user/user').then(res => {
            const src = res.data.avatar
            const name = res.data.name
            const index = res.data.sex =='男'?1:0
            const date = res.data.birthday ? res.data.birthday:'2000-01-01'
            const feelindex = res.data.emotion == '单身' ? 0 : (res.data.emotion=='热恋'?1:2)
            const interest = res.data.hobby ? res.data.hobby:''
            const signature = res.data.sign ? res.data.sign:''
            const uuid = res.data.uuid
            this.setData({
                src,
                name,
                index, 
                date,
                feelindex,
                interest,
                signature,
                uuid
            })
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
                that.setData({
                    src: res.tempFilePaths[0]
                })
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
                            region: 'ECN',
                            domain: 'qiniu.ayouayou.com', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                            key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                            uptoken: token
                        }, () => { });
                }
            });
        })
    },
})