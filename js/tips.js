'use strict';

Vue.component('tips', {
    data: function data() {
        return {
            count: 0
        };
    },
    props: {
        msg: {
            require: true
        }
    },
    methods: {
        closeA: function closeA(event) {
            this.$emit('parent-close');
        }
    },
    template: '<div class="tips">\n' + '        <div class="tipsBox">\n' + '            <img src="img/tips.png" alt="">\n' + '            <p>{{msg}}</p>\n' + '        </div>\n' + '        <img src="img/closeBtn.png" alt="" class="closeBtn" v-on:click="closeA">\n' + '    </div>'
});