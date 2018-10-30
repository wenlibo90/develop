'use strict';

var login = {
    m: {
        sure: function sure() {
            var uName = $('#uName').val();
            var uCall = $('#uCall').val();
            var uCode = $('#uCode').val();
            if (login.m.isNull(uName) || login.m.isNull(uCall) || login.m.isNull(uCode)) {
                base.GTsetAjax('post', 'customer/login_validate', {
                    mobile: uCall,
                    code: uCode,
                    name: uName,
                    //在入口出获取并保存在前端
                    platformid: base.GTcookie.getCookie('platformId'),
                    //   在首页出获取 并保存
                    openId: base.GTcookie.getCookie('openId')
                }, function (data) {
                    base.GTcookie.setCookie('authorization', data.authorization);
                    base.GTcookie.setCookie('appId', data.appId);
                    base.GTcookie.setCookie('redisKey', data.redisKey);
                    base.GTcookie.setCookie('token', data.token);
                    base.GTcookie.setCookie('userId', data.userId);
                    var id = base.GTUrlParam().id;

                    window.location.href = 'index.html?id=' + id;
                });
            } else {
                base.tip.tipsFn('请完善填写信息');
            }
        },
        isNull: function isNull(val) {
            if (!val || val == null || val.trim() == '') {
                return false;
            } else {
                return true;
            }
        },
        getCode: function getCode() {
            var num = $('#uCall').val();
            switch (login.m.checkPhone(num.trim())) {
                case 0:
                    base.tip.tipsFn('电话号不存在');
                    break;
                case 1:
                    base.tip.tipsFn('电话号格式不正确');
                    break;
                case 2:
                    if (login.c.flag) {
                        //类型，1登录，2找回修改密码
                        login.c.flag = false;
                        base.GTsetAjax('post', 'customer/get_validate_code', { mobile: num, type: 1 }, function (data) {
                            console.log(data);
                        }, function (xhr) {
                            xhr.setRequestHeader("authorization", "test123");
                            xhr.setRequestHeader("appid", base.appId);
                            login.v.yzmFn(xhr);
                        });
                    }
                    break;
                default:
                    break;
            }
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
        }
    },
    v: {
        yzmFn: function yzmFn(xhr) {
            var t = 60;
            var box = $('.yzm');
            if (box.html() == '获取验证码') {
                var time = setInterval(function () {
                    if (t <= 0) {
                        clearInterval(time);
                        box.html('获取验证码');
                        login.c.flag = true;
                    } else {
                        box.html(--t + 's后重新发送');
                    }
                }, 1000);
            }
        }
    },
    c: {
        flag: true
    }
};