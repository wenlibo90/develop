'use strict';

var base = {
    path: 'http://test.yuntongauto.com/mall-webapi/',
    listUrl:'http://test.yuntongauto.com/',
    //path: 'http://172.16.104.225:9512/mall-webapi/',
    myId: 'appId_123456',
    arr3: [null, "2981510004500480", "3008074046613504", "3008063232354304", "2981517678323712", "3008051553888256", "3044991134590976", "3044995036096512", "3044983780730880", "3148508377819136", "3152752425969664", "3152759738607616", "3152758046730240", "3152765076154368", "3152762866575360", "3152755036252160", "3159882941655040", "3159847461775360", "3238898133657600", "3238901809424384", "3238886697330688", "3238900668409856", "3249040518031360", "3240591118329856", "3249047307429888", "3238899622160384", "3249044146825216", "3249042270578688", "3249036395276288", "3249045506992128", "3249021178800128", "3249057443538944", "3249038309599232", "3249056307685376", "3249048280672256", "111", "3295830573967360", "3295854282876928", "3296981194074112", "3297100860532736", "3297234872215552", "3298622767048704", "3295906524817408", "3287396812597248", "3305351953475584", "3287395577686016", "3319583257405440", "3335201332946944", "3335202548885504", "3335203671762944", "3335208889395200", "3335207727097856", "3340784020203520", "3691889552074752", "3695056871368704", "3696034588813312", "111", "111", "111", "111"],
    //arr2:["wx017397a5a78e210a","wxe4d40c4f7c1cc642", "wx73a6b0cd4e18583d", "wx4281be3d95bcf378", "wxaf424323472e4f17", "wx9e46235e9f68570b", "wx08b8f737fe2d1d6e", "wx25a2c792508fcf03", "wxc85d76e10935b756", "wx228e8bb30039ca29", "wx4b6f87aee17940ea", "wx8aabb67352be0285", "wx61802b87feaadf86", "wxfd83aab5df9d5072", "wx01d8a4dcbe19d30a", "wx79a9bcf7ba8ad6a1", "wx0c133041c8e6225a", "wx76b0702d5311b9fe", "wx1d3a42d3a46f3ff6", "wxad930b7d460dba4d", "wx4f3373e75fd4c2f2", "wx211aa119bd4c7674", "wx41583bdd1d4c0182", "wxe3acb9a4822b796e", "wx2575457b40f240b5", "wxbe378bba45be67bb", "wx5df73cdeba858e8f", "wx2a0be4164f321f6e", "wx4f5752b36758e10b", "wx979843a2ac91b627", "wx1bbbb1692fcf9ee8", "wx1a737e13c8cc9f0e", "wx4715195028e145fc", "wx5113e99b2029b2b9", "wx90a428146e3f985e", "wxc0bbedec1975e953", "wxc306c949f04eda8b", "wxca3d334834fde21c", "wx536b0593a0571e3f", "wxfff28e028bb53b89", "wx4473949c80deb86b", "wx56155b194db0ead1", "wxb19d367be22ac40e", "wx4639c95a9eea606d", "wx93920208beaaf6d5", "wxc1373a32bc8be3b3", "wx8be265c7ebd45a77", "wx2eafd82666110208", "wx71c63353f20ddc74", "wx325671e9cf22d55f", "wxfe0beaf154896b9f", "wx6bca2ead9d859df2", "wxfec5d6e59c267eab", "wx5e7d8a38f4ec914c", "wxc7a75b0d2f4abe04", "wxb0ce484a7ff9810d", "wxf12613315b07750c", "wx8159f7794b0153e7", "wx2d74cfdfc3eb30ff", "wxb88ea046b8a3abd0", "wx14809e3559fd74e7"],
    arr2: ["wx017397a5a78e210a", "wx73a6b0cd4e18583d", "wx4281be3d95bcf378", "wxaf424323472e4f17", "wx9e46235e9f68570b", "wx08b8f737fe2d1d6e", "wx25a2c792508fcf03", "wxc85d76e10935b756", "wx228e8bb30039ca29", "wx4b6f87aee17940ea", "wx8aabb67352be0285", "wx61802b87feaadf86", "wxfd83aab5df9d5072", "wx01d8a4dcbe19d30a", "wx79a9bcf7ba8ad6a1", "wx0c133041c8e6225a", "wx76b0702d5311b9fe", "wx1d3a42d3a46f3ff6", "wxad930b7d460dba4d", "wx4f3373e75fd4c2f2", "wx211aa119bd4c7674", "wx41583bdd1d4c0182", "wxe3acb9a4822b796e", "wx2575457b40f240b5", "wxbe378bba45be67bb", "wx5df73cdeba858e8f", "wx2a0be4164f321f6e", "wx4f5752b36758e10b", "wx979843a2ac91b627", "wx1bbbb1692fcf9ee8", "wx1a737e13c8cc9f0e", "wx4715195028e145fc", "wx5113e99b2029b2b9", "wx90a428146e3f985e", "wxc0bbedec1975e953", "wxc306c949f04eda8b", "wxca3d334834fde21c", "wx536b0593a0571e3f", "wxfff28e028bb53b89", "wx4473949c80deb86b", "wx56155b194db0ead1", "wxb19d367be22ac40e", "wx4639c95a9eea606d", "wx93920208beaaf6d5", "wxc1373a32bc8be3b3", "wx8be265c7ebd45a77", "wx2eafd82666110208", "wx71c63353f20ddc74", "wx325671e9cf22d55f", "wxfe0beaf154896b9f", "wx6bca2ead9d859df2", "wxfec5d6e59c267eab", "wx5e7d8a38f4ec914c", "wxc7a75b0d2f4abe04", "wxb0ce484a7ff9810d", "wxf12613315b07750c", "wx8159f7794b0153e7", "wx2d74cfdfc3eb30ff", "wxb88ea046b8a3abd0", "wx14809e3559fd74e7"],
    //arr1: [ "3036684041086976","3036684041086976", "3090593118824448", "3103317145200640", "3111450440181760", "3127295733213184", "3127301281556480", "3127317480269824", "3127318708119552", "3138682939500544", "3161186825480192", "3161476645496832", "3166616092518400", "3168279635765248", "3169714764130304", "3170045599377408", "3170150940190720", "3178289896466432", "3192204468430848", "3251881679628288", "3251922320386048", "3252035061966848", "3255913480857600", "3255930171238400", "3256031957952512", "3256247016187904", "3257477933180928", "3258919919134720", "3260306141849600", "3260308746840064", "3267267104909312", "3268598679627776", "3268817110034432", "3270323979511808", "3270359442679808", "3270673261471744", "3279868560975872", "3295832722974720", "3296970812008448", "3296987797334016", "3297102070114304", "3297236412377088", "3298624352380928", "3299737160361984", "3299823688607744", "3305352669833216", "3307123561785344", "3319596238088192", "3335314130987008", "3335315190933504", "3335332595705856", "3336640881928192", "3340851589474304", "3349364945889280", "3691882847119360", "3695055361615872", "3696031701116928", "3712131959023616", "3731825321502720", "3830889526405120", "3854932008822784"],
    arr1: ["3036684041086976", "3090593118824448", "3103317145200640", "3111450440181760", "3127295733213184", "3127301281556480", "3127317480269824", "3127318708119552", "3138682939500544", "3161186825480192", "3161476645496832", "3166616092518400", "3168279635765248", "3169714764130304", "3170045599377408", "3170150940190720", "3178289896466432", "3192204468430848", "3251881679628288", "3251922320386048", "3252035061966848", "3255913480857600", "3255930171238400", "3256031957952512", "3256247016187904", "3257477933180928", "3258919919134720", "3260306141849600", "3260308746840064", "3267267104909312", "3268598679627776", "3268817110034432", "3270323979511808", "3270359442679808", "3270673261471744", "3279868560975872", "3295832722974720", "3296970812008448", "3296987797334016", "3297102070114304", "3297236412377088", "3298624352380928", "3299737160361984", "3299823688607744", "3305352669833216", "3307123561785344", "3319596238088192", "3335314130987008", "3335315190933504", "3335332595705856", "3336640881928192", "3340851589474304", "3349364945889280", "3691882847119360", "3695055361615872", "3696031701116928", "3712131959023616", "3731825321502720", "3830889526405120", "3854932008822784"],
    GTrim: function GTrim(str) {
        return str.replace(/\s/g, '');
    },
    getIdData: function getIdData(id) {
        var index = 0;
        $.each(base.arr1, function (i, v) {
            if (Number(id) == Number(v)) {
                index = i;
                return false;
            }
        });
        return index;
    },
    componentAppid: 'wx5bba8907e87c088a',
    //生产环境的  wx37005eb608396a30
    //测试环境的 wx5bba8907e87c088a
    GTUrlParam: function GeTUrlParam() {
        //优化 可以全部转小写 在进行取值
        var arr = window.location.search.slice(1).split('&');
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            var arr1 = arr[i].split('=');
            obj[arr1[0]] = arr1[1];
        }
        return obj;
    },
    GTim: function GTim(needTime) {
        function add0(m) {
            return m < 10 ? '0' + m : m;
        }
        var now = new Date();

        //needTime是整数，否则要parseInt转换
        var time = new Date(needTime);

        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        if (m == now.getMonth() + 1 && d - 1 == now.getDate()) {
            return '明日 ' + add0(h) + ':' + add0(mm) + ' 开售';
        } else if (m == now.getMonth() + 1 && d == now.getDate()) {
            return '今日 ' + add0(h) + ':' + add0(mm) + ' 开售';
        } else {
            return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + '开售';
        }
    },
    time: function time(needTime) {
        function add0(m) {
            return m < 10 ? '0' + m : m;
        }
        //needTime是整数，否则要parseInt转换
        var time = new Date(needTime);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    },
    checkPhone: function checkPhone(num) {
        var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(16[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (num == null || num == "") {
            //电话号不存在
            return 0;
        }
        if (!myreg.test(num)) {
            // 格式不正确
            return 1;
        }
        return 2;
    },
    GTsetAjax: function GTsetAjax(type, url, data, okFn, beforeFn, completeFn) {
        var d = void 0;
        if (type == 'get') {
            d = data;
        } else {
            d = JSON.stringify(data);
        }
        $.ajax({
            type: type,
            url: base.path + url,
            data: d,
            contentType: 'application/json;charset=UTF-8',
            beforeSend: function beforeSend(xhr) {
                if (beforeFn || beforeFn != null) {
                    beforeFn(xhr);
                } else {
                    xhr.setRequestHeader("authorization", base.GTcookie.getCookie('authorization'));
                    xhr.setRequestHeader("appid", base.myId);
                }
            },
            complete: function complete() {
                if (completeFn || completeFn != null) {
                    completeFn();
                }
            },
            success: function success(data) {
                if (okFn || okFn != null) {
                    var a = data.state;
                    console.log(data);
                    if (data.state == '104' || data.state == '103') {
                        base.tip.tipsFn('您还没有登录哦');
                        return null;
                    } else {
                        if (data.state == '200') {
                            okFn(data.data);
                        } else {
                            base.tip.tipsFn(data.message);
                        }
                    }
                }
            },
            error: function error() {
                base.tip.tipsFn('服务器异常');
            }
        });
    },
    tip: {
        tipsFn: function tipsFn(msg) {
            if (msg) {
                $('.tips').show().find('p').html(msg);
            } else {
                $('.tips').show().find('p').html('未知错误，请联系管理员');
            }
        },
        closeTips: function closeTips() {
            $('.tips').hide();
            if ($('.tips').find('p').html() == '您还没有登录哦') {
                window.location.href = 'login.html?id=' + base.GTcookie.getCookie('id');
            }
        }
    },
    GTcookie: {
        //获取cookie
        getCookie: function getCookie(objName) {
            var arr = document.cookie.match(new RegExp("(^| )" + objName + "=([^;]*)(;|$)"));
            if (arr != null) {
                return unescape(arr[2]);
            }
            return null;
        },
        //添加cookie
        /*
        * setCookie  请求调用说明
        * @param objName  名  require
        * @param objValue   值   require
        * @param objHours  时间（天）
        * */
        setCookie: function setCookie(objName, objValue, objHours) {
            var str = objName + "=" + escape(objValue);
            if (!objHours || objHours == null || objHours < 0) {
                objHours = 999;
            }
            var date = new Date();
            date.setTime(date.getTime() + objHours * 24 * 60 * 60 * 1000);
            document.cookie = objName + "=" + escape(objValue) + ";expires=" + date.toGMTString();
        },
        //删除cookie
        delCookie: function delCookie(objName) {
            var date = new Date();
            date.setTime(date.getTime() - 1);
            var cval = base.cookie.getCookie(objName);
            if (cval != null) {
                document.cookie = objName + "=" + cval + ";expires=" + date.toGMTString();
                return true;
            } else {
                return false;
            }
        },
        //删除根目录cookie
        delCookieByPath: function delCookieByPath(objName) {
            var cval = base.cookie.getCookie(objName);
            var objHours = -1;
            if (cval != null) {
                var str = objName + "=" + escape('');
                var date = new Date();
                date.setTime(date.getTime() + objHours * 24 * 60 * 60 * 1000);
                document.cookie = str + ";path=/;expires=" + date.toGMTString();
                return true;
            } else {
                return false;
            }
        }
    },
    resourceVersion:function () {
        var box=$('html');
        var arrLink=box.find('link');

    }
};