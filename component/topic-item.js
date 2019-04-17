// component/topic-item.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tableList: {
            type: Array,
            value: []
        },
        url: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

        show: false,

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onclose(e) {
            this.triggerEvent('onclose', app.dataSet(e));
        },
        entertopic(e) {
            this.triggerEvent('entertopic', app.dataSet(e));
        },

    }
})