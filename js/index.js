'use strict';

var dataInit = {
    iscity: false, isshow: false, cityIndex: [],serviceNetworkId:''
};
Vue.component('city', {
    data: function data() {
        return {
            proList: [],
            cityList: [],
            flag:true
        };
    },
    props: {
        pageNum: { require: true },
        pageSize: { require: true },
        cityIndex: { require: true }
    },
    methods: {
        tipsFn: function tipsFn() {
            this.$emit('parent-tips');
        },

        checkPro: function checkPro(index) {
            //重新调用方法 渲染页面
            var that = this;

            if (index == 0) {
                this.$emit('parent-serviceid', null);
                $('.pro .proItem:eq(0)').addClass('on').siblings().removeClass('on');
                dataInit.cityIndex[1] = null;
                dataInit.cityIndex[0] = 0;
                that.serviceNetworkId=null;
                this.$emit('parent-query');
                this.$emit('parent-close');
                $('.cityShow span').html('店铺');$('.cityShow').removeClass('on');
                return null;
            }

            this.$http.get(base.path + 'baseapi/getservicenetworklist', { params: {
                    cityName: this.proList[index],
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
            }).then(function (res) {
                //成功函数
                var data = res.body;

                //获取到当前城市的店铺列表
                that.$emit('parent-connect', data, function () {
                    if (data.data.cityNameList.length) {
                        that.cityList = data.data.list;
                        if(dataInit.cityIndex[0] != index){
                            dataInit.cityIndex[0]=index;

                            //    点击了和之前不同的城市  全部已经被屏蔽
                            //   点击了别的城市 但是没有选中店铺
                            console.log(dataInit.cityIndex[1])
                            console.log(dataInit.serviceNetworkId)
                            if(dataInit.cityIndex[1] !=null){
                                if(that.cityList[dataInit.cityIndex[1]].id == dataInit.serviceNetworkId){
                                    that.flag=true
                                    $('.cityItem:eq(' + dataInit.cityIndex[1] + ')').addClass('on').siblings().removeClass('on');
                                }else{
                                    that.flag=false
                                    $('.cityItem').removeClass('on');
                                }
                            }else{
                                that.flag=false
                                $('.cityItem').removeClass('on');
                            }

                        }else{
                            //    点击了相同的城市
                            that.flag=true
                            $('.cityItem:eq(' + dataInit.cityIndex[1] + ')').addClass('on').siblings().removeClass('on');
                        }
                        $('.pro .proItem:eq(' + dataInit.cityIndex[0] + ')').addClass('on').siblings().removeClass('on');

                    } else {
                        that.tipsFn('城市列表为空');
                    }
                });
            }, function (reason) {
                //失败函数
                //console.log(reason)
                this.tipsFn();
            });
        },
        checkCity: function checkCity(index) {
            this.$emit('parent-serviceid', this.cityList[index].id);
            dataInit.serviceNetworkId=this.cityList[index].id;
            console.log(dataInit.serviceNetworkId)
            //店铺列表的index保存成功
            dataInit.cityIndex[1] = index;
            this.$emit('parent-query');
            this.$emit('parent-close');
            $('.cityShow span').html(this.cityList[index].name);
            $('.cityShow ').addClass('on');
            this.flag=true
        }
    },
    mounted: function mounted() {
        //这是一个每次都执行的函数
        var that = this;
        this.$http.get(base.path + 'baseapi/getservicenetworklist', { params: {
                cityName: null,
                pageNum: that.pageNum,
                pageSize: that.pageSize
            }
        }).then(function (res) {
            //成功函数
            var data = res.body;

            this.$emit('parent-connect', data, function () {
                if (data.data.cityNameList.length) {
                    //城市列表渲染完成
                    data.data.cityNameList.unshift('全部');
                    that.proList = data.data.cityNameList;

                    if(dataInit.cityIndex[0]){
                        that.checkPro(dataInit.cityIndex[0])
                    }

                } else {
                    that.tipsFn('城市列表为空');
                }
            });
            if (that.proList) console.log(dataInit.cityIndex);
        }, function (reason) {
            //失败函数
            //console.log(reason)
            this.tipsFn();
        });
    },
    updated: function updated() {
        //arrData改变并且要在页面重新渲染{{ arrData }}完成之后
        if(this.flag){
            $('.cityItem:eq(' + dataInit.cityIndex[1] + ')').addClass('on').siblings().removeClass('on');
        }else{
            $('.cityItem').removeClass('on');
        }
        $('.pro .proItem:eq(' + dataInit.cityIndex[0] + ')').addClass('on').siblings().removeClass('on');
    },
    template: '<div class="cityBox">\n' + '            <div class="l pro">\n' + '                <p class="proItem" v-for="(proItem,index) in proList" v-on:click="checkPro(index)">{{proItem}}</p>\n' + '            </div>\n' + '            <div class="l city">\n' + '                <p class="cityItem" v-for="(cityItem,index) in cityList" v-on:click="checkCity(index)">\n' + '                    {{cityItem.name}}' + '                </p>\n' + '            </div>\n' + '        </div>'

});

var wm = new Vue({
    el: '#app',
    data: {
        istips: false,
        iscity: dataInit.iscity,
        isshow: dataInit.isshow,
        spec: '',
        msg: '成功',
        flag: '',
        specList: [],
        saleCount: [{
            name: '销量从高到低',
            id: 'desc'
        }, {
            name: '销量从低到高',
            id: 'asc'
        }],
        basePrice: [{
            name: '价格从高到低',
            id: 'desc'
        }, {
            name: '价格从低到高',
            id: 'asc'
        }],
        isdata: false,
        shopList: [],
        pageNum: 0,
        pageSize: 100,
        count: 0,
        dataBox: false,
        flag1: true,
        dataObj: {
            saleCount: null,
            basePrice: null,
            serviceNetworkId: null,
            classId: null,
            pageNum: 0,
            pageSize: 100
        },
        arrIndex: [0],
        arrData: [],
        cityIndex: []
    },
    methods: {
        cityshow: function cityshow() {
            this.iscity = true;
            this.isshow = false;
        },
        checkPro: function checkPro(e) {
            //console.log(e.target)
        },
        tipsclose: function tipsclose() {
            this.istips = false;
        },
        shopShow: function shopShow() {
            this.isshow = true;
        },
        cityclose: function cityclose() {
            this.iscity = false;
        },
        changeServiceNetworkId: function changeServiceNetworkId(id) {
            this.dataObj.serviceNetworkId = id;
            return null;
        },
        everClose: function everClose(str) {
            var that = this;
            if (str) {
                that.str = false;
            }
        },
        setClass: function setClass(v) {
            //判断状态 1:已开售 2:未开售
            switch (Number(this.shopList[v].checkSale)) {
                case 1:
                    return 'toBtn';break;
                case 2:
                    return 'toBtn after';break;
                default:
                    return 'toBtn';break;
            }
        },
        isFree: function isFree(v) {
            switch (Number(this.shopList[v].basePrice)) {
                case 0:
                    return 't2 icon';
                default:
                    return 't2';
            }
        },
        toList:function () {
            if(base.GTcookie.getCookie('userId') || base.GTcookie.getCookie('userId')!=null){
                return base.listUrl+'pay/gomallorderlistpay?customerId='+base.GTcookie.getCookie('userId')+'&wecatPlatformId='+base.GTUrlParam().id
            }else{
                return 'login.html?id='+base.GTUrlParam().id
            }
        },
        scrollFn: function scrollFn() {
            //真实内容的高度
            var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
            //视窗的高度
            var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
            //隐藏的高度
            var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var l = $('.shopItem').length;
            if (this.count > l) {
                if (pageHeight - viewportHeight - scrollHeight < 10) {
                    //如果满足触发条件，执行
                    this.pageNum++;
                    this.query();
                    //console.log(this.pageNum)
                }
            } else if (this.count == l) {
                if (this.flag1) {
                    this.flag1 = false;
                    this.query();
                }
            }
        },
        query: function query(index) {
            this.isshow = false;
            var that = this;
            Vue.http.headers.common['authorization'] = base.GTcookie.getCookie('authorization');
            Vue.http.headers.common['appid'] = base.myId;
            var arrIndex = that.arrIndex;
            if (that.specList.length > 0 && index != null && index != undefined) {
                switch (that.flag) {
                    case '分类':
                        that.dataObj.classId = that.specList[index].id ? that.specList[index].id : null;
                        arrIndex[1] = index;
                        $('.specBox .spec:eq(' + arrIndex[1] + ')').addClass('on').siblings().removeClass('on');
                        console.log('分类');
                        $('.list li:eq(1)').addClass('on');
                        break;
                    case '销量':
                        if (index == arrIndex[2]) {
                            $('.specBox .spec:eq(' + arrIndex[2] + ')').removeClass('on');
                            $('.list li:eq(2)').removeClass('on');
                            arrIndex[2] = null;
                            that.dataObj.saleCount = null;
                        } else {
                            that.dataObj.saleCount = that.specList[index].id ? that.specList[index].id : null;
                            console.log(that.specList[index].id);
                            console.log('销量');
                            arrIndex[2] = index;
                            $('.list li:eq(2)').addClass('on');
                            $('.specBox .spec:eq(' + arrIndex[2] + ')').addClass('on').siblings().removeClass('on');
                        //    价格全部清空
                            $('.specBox .spec:eq(' + arrIndex[3] + ')').removeClass('on');
                            $('.list li:eq(3)').removeClass('on');
                            arrIndex[3] = null;
                            that.dataObj.basePrice = null;
                        }
                        break;
                    case '价格':
                        if (index == arrIndex[3]) {
                            $('.specBox .spec:eq(' + arrIndex[3] + ')').removeClass('on');
                            $('.list li:eq(3)').removeClass('on');
                            arrIndex[3] = null;
                            that.dataObj.basePrice = null;
                        } else {
                            that.dataObj.basePrice = that.specList[index].id ? that.specList[index].id : null;
                            console.log('价格');
                            arrIndex[3] = index;
                            $('.list li:eq(3)').addClass('on');
                            $('.specBox .spec:eq(' + arrIndex[3] + ')').addClass('on').siblings().removeClass('on');
                            //销量全部清空
                            $('.specBox .spec:eq(' + arrIndex[2] + ')').removeClass('on');
                            $('.list li:eq(2)').removeClass('on');
                            arrIndex[2] = null;
                            that.dataObj.saleCount = null;
                        }
                        break;
                    default:
                        break;
                }
            }
            var data = {
                platformId: base.GTUrlParam().id,
                saleCount: that.dataObj.saleCount,
                basePrice: that.dataObj.basePrice,
                serviceNetworkId: that.dataObj.serviceNetworkId ? that.dataObj.serviceNetworkId : null,
                classId: that.dataObj.classId,
                pageNum: that.pageNum,
                pageSize: that.pageSize
            };
            that.$http.get(base.path + "mallgoodsinfoapi/getmallgoodsinfolist", { params: data
            }).then(function (res) {
                //成功函数
                var data = res.body;
                that.shopList = [];
                this.isConnect(data, function () {
                    var shoplist = res.body.data.list;
                    that.count = res.body.data.count;
                    //console.log(res.body)
                    if (that.count < 1) {
                        that.isdata = false;
                        that.dataBox = true;
                    } else {
                        that.dataBox = false;
                        if (shoplist.length > 0) {
                            that.shopList = that.shopList.concat(shoplist);
                            //console.log(that.shopList)
                        } else {
                            that.isdata = true;
                        }
                    }
                });
            }, function (reason) {
                //失败函数
                //console.log(reason)
                this.tipsFn();
            });
        },
        getMsgFn: function getMsgFn(event) {
            this.getmsg = true;
        },
        isConnect: function isConnect(data, fn) {
            if (Number(data.state) == 200) {
                if (fn) {
                    fn();
                }
            } else {
                this.tipsFn(data.message);
            }
        },
        toDetial: function toDetial($event, str) {
            if (base.GTcookie.getCookie('authorization')) {
                window.location.href = str;
            } else {
                this.tipsFn('您还没有登录哦',true,'login.html?id='+ base.GTUrlParam().id);
                this.tipsclose=function tipsclose() {
                    window.location.href = 'login.html?id='+ base.GTUrlParam().id;
                    this.istips = false;
                }
            }
        },
        tipsFn: function tipsFn(txt) {
            if (!txt) {
                txt = '服务器走丢了,请联系客服处理～';
            }
            this.msg = txt;
            this.istips = true;
        },
        getId: function getId() {
            var that = this;

            that.dataObj.serviceNetworkId = base.arr3[getIdData(base.GTUrlParam().id)];
            console.log(that.dataObj.serviceNetworkId);
        }
    },
    mounted: function mounted() {
        var that = this;

        var componentAppid = base.componentAppid;
        var REDIRECT_URI = window.location;

        if (base.GTUrlParam().id) {
            base.GTcookie.setCookie('id', base.GTUrlParam().id);

            base.GTcookie.setCookie('platformId', base.GTUrlParam().id);
            base.GTcookie.setCookie('appId', base.arr2[base.getIdData(base.GTUrlParam().id)]);

            if (base.GTUrlParam().id + '' == '3036684041086976') {
                console.log('从运通汇进入');
            } else {
                $('.nav').removeClass('nav-4').addClass('nav-3');
                $('.cityShow').hide();
                that.getId();
            }

            if (base.GTUrlParam().code && base.GTUrlParam().state) {
                $.ajax({
                    type: "post",
                    url: base.path + "customer/getWechatInfo",
                    data: JSON.stringify({ wechatAppId: base.GTcookie.getCookie('appId'), code: base.GTUrlParam().code }),
                    contentType: 'application/json;charset=UTF-8',
                    beforeSend: function beforeSend(xhr) {
                        xhr.setRequestHeader("appid", base.myId);
                    },
                    success: function success(data) {
                        //alert('这个是发给我的appid'+JSON.stringify(data.data.token.appId))
                        $('.loader').hide()
                        base.GTcookie.setCookie('openId', data.data.wechatInfo.openId);
                        if (data.data.token || data.data.token != null) {
                            base.GTcookie.setCookie('authorization', data.data.token.authorization);
                            base.GTcookie.setCookie('userId', data.data.token.userId);
                            //base.myId=data.data.token.appId;
                            base.GTcookie.setCookie('token', data.data.token.token);
                        }
                    },
                    error: function error(data) {
                        alert(JSON.stringify(data));
                        that.tipsFn();
                    }
                });
            } else {
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+base.GTcookie.getCookie('appId')+"&redirect_uri="+REDIRECT_URI+"&response_type=code&scope=snsapi_base&state=STATE&component_appid="+componentAppid+"#wechat_redirect";
            }
            //初始化列表
            that.query();

        } else {
            that.tipsFn('来源id未获取到，请检查链接完整性');
        }

        //点击方法添加
        $('.list li').click(function (e) {
            if ($(this).hasClass('cityShow')) {
                dataInit.iscity = !dataInit.iscity;
                that.iscity = dataInit.iscity;
                that.isshow = false;
                //console.log($(this).find('span').html())
            } else {
                switch ($(this).find('span').html()) {
                    case '分类':
                        that.flag = '分类';

                        that.$http.get(base.path + "mallgoodsclassapi/getmallgoodsclasslist").then(function (res) {
                            //成功函数
                            var data = res.body;

                            this.isConnect(data, function () {
                                //添加了全部 id  为-1
                                if (data.data.list.length) {
                                    data.data.list.unshift({
                                        "remark": "全部", //类型：String  必有字段  备注：无
                                        "name": "全部", //类型：String  必有字段  备注：无
                                        "id": -1 //类型：Number  必有字段  备注：无
                                    });
                                    that.specList = data.data.list;
                                    if (that.arrIndex[1] || that.arrIndex[1] == 0) {
                                        $('.specBox .spec:eq(' + that.arrIndex[1] + ')').addClass('on').siblings().removeClass('on');
                                    } else {
                                        $('.specBox .spec').removeClass('on');
                                    }
                                } else {
                                    that.tipsFn('信息获取失败，分类未录入，请检查信息完整性');
                                }
                            });
                        }, function (reason) {
                            //失败函数
                            //console.log(reason)
                            this.tipsFn();
                        });
                        break;
                    case '销量':
                        that.flag = '销量';

                        that.specList = that.saleCount;
                        if (that.arrIndex[2] || that.arrIndex[2] == 0) {
                            $('.specBox .spec:eq(' + that.arrIndex[2] + ')').addClass('on').siblings().removeClass('on');

                        } else {
                            $('.specBox .spec').removeClass('on');
                        }
                        break;
                    case '价格':
                        that.flag = '价格';
                        that.specList = that.basePrice;
                        if (that.arrIndex[3] || that.arrIndex[3] == 0) {
                            $('.specBox .spec:eq(' + that.arrIndex[3] + ')').addClass('on').siblings().removeClass('on');
                        } else {
                            $('.specBox .spec').removeClass('on');
                        }
                        break;
                }
                that.iscity = false;
                that.isshow = !that.isshow;
            }
            e.stopPropagation();
        });
        $(window).bind("scroll", this.scrollFn);

        
    }
});