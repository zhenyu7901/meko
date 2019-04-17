// pages/my/phone_attestation/phone_attestation.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        err_message:'',
        count:'发送验证码',
        disabled:false,
        phone:'',
        sms:'',

    },
    onLoad: function (options) {

    },
    onShow: function () {

    },
    submit(){
        app.get('').then(res => {
            if (res.code == '200') {
                app.toast('认证成功')
                this.setData({
                    disabled: true
                })
                this.counttime()
            } else {
                app.toast(res.message)
            }
        })
    },
    counttime(){
        var num = 60
        const time = setInterval(()=>{
            num--;
                this.setData({
                    count:num+''
                })
                console.log(this.data.count)
                if(num==0){
                    clearInterval(time)
                }
          
        },1000)
    },
    getcode(){
            app.get('').then(res => {
                if (res.code == '200') {
                    app.toast('获取验证码成功')
                    this.setData({
                        disabled: true
                    })
                    this.counttime()
                } else {
                    app.toast(res.message)
                }
            })
   
    }
})