'use strict';

var getAddr = {
    m: {
        query: function query() {
            base.GTsetAjax('get', 'mallorderapi/getmallorderdetail', {
                orderId: base.GTUrlParam().orderid ? base.GTUrlParam().orderid : base.GTUrlParam().orderId
            }, function (data) {
                getAddr.v.addView(data);
            });
        },
        checkPhone: function checkPhone(num) {
            var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(16[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if (num == null || num == "") {
                //电话号不存在
                return false;
            }
            if (!myreg.test(num)) {
                // 格式不正确
                return false;
            }
            return true;
        },
        addressFn: function addressFn(flag, uname, unum, adr) {

            if (flag) {
                if (!uname || uname == null || uname.trim() == '') {
                    base.tip.tipsFn('姓名未填写');
                    return null;
                }
                if (!getAddr.m.checkPhone(Number(unum))) {
                    base.tip.tipsFn('电话号码填写有误');
                    return null;
                }
                if (!adr || adr == null || adr.trim() == '') {
                    base.tip.tipsFn('地址信息未填写');
                    return null;
                }
            }
            base.GTsetAjax('post', 'mallorderapi/savemallorderpost', {
                orderId: base.GTUrlParam().orderid ? base.GTUrlParam().orderid : base.GTUrlParam().orderId,
                address: adr ? adr : null,
                districtName: null,
                createPerson: null,
                remark: null,
                cityId: null,
                provinceId: null,
                logisticsName: null,
                districtId: null,
                cityName: null,
                name: uname ? uname : null,
                logisticsNo: null,
                tel: unum ? unum : null,
                provinceName: null,
                status: 1
            }, function (data) {
                base.tip.tipsFn('保存成功');

                setTimeout(function () {
                    window.location.href = getAddr.c.listUrl;
                }, 1000);
            });
        }
    },
    v: {
        txtFn: function txtFn() {
            $('.txtcont').blur(function () {
                if ($(this).html().trim() == '') {
                    $(this).html('<span class="place" style="color: #999;font-size: 26px">请输入收货人详细的地址</span>');
                }
            }).focus(function () {
                if ($(this).find('.place').length) {
                    $(this).html('');
                } else {
                    $(this).find('.place').remove();
                }
            });
        },
        addView: function addView(data) {

            getAddr.c.listUrl = data.mallOrderListUrl;
            if (data.order.mallOrderPost != null) {
                $('.txtcont').html(data.order.mallOrderPost.address ? data.order.mallOrderPost.address : '<span class="place" style="color: #999;font-size: 26px">请输入收货人详细的地址</span>');
                $('#uName').val(data.order.mallOrderPost.name);
                $('#uNum').val(data.order.mallOrderPost.tel);
            }
            $('.back').attr('href', data.mallOrderListUrl);
            $('.loader').hide();
        }
    },
    c: {
        init: function init() {
            if (base.GTUrlParam().orderid || base.GTUrlParam().orderId) {
                getAddr.m.query();
            } else {
                base.tip.tipsFn('缺少订单id，请联系管理员');
            }
        },
        listUrl: ''
    }
};