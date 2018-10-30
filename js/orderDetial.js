'use strict';

var orderDetial = {
    m: {
        query: function query() {
            base.GTsetAjax('get', 'mallorderapi/getmallorderdetail', {
                orderId: base.GTUrlParam().orderid
            }, function (data) {
                orderDetial.v.orderView(data);
            });
        },
        payStatus: function payStatus(num) {
            ////类型：Number  必有字段  备注：订单状态：1待支付、2已支付、3取消、4已完成
            switch (Number(num)) {
                case 1:
                    return '订单未支付';
                case 2:
                    return '订单已支付';
                case 3:
                    return '订单已取消';
                case 4:
                    return '订单已完成';
                default:
                    base.tip.tipsFn('未知错误，请联系管理员');
                    return '';
            }
        }
    },
    v: {
        orderView: function orderView(data) {

            if (data.order) {
                var d = data.order;
                var btm = $('.btm');
                var cont = $('.cont');
                btm.html('');
                $('.back').attr('href', data.mallOrderListUrl);
                var moneyObj = $('.allMoney');
                $('.top').attr('href', 'detail.html?id=' + d.mallGoodsSku.goodsId);

                $('.topImg').attr('src', d.mallGoodsInfo.mainImg);
                $('.tit').html(d.mallGoodsInfo.title);
                $('.status').html(orderDetial.m.payStatus(d.status));

                btm.append('  <div class="item">\n' + '            <span class="l name">商品数量</span>\n' + '            <div class="r">*' + d.mallOrderGoods.purchaseNum + '</div>\n' + '        </div>');
                btm.append('  <div class="item allMoney">\n' + '            <span class="l name">订单总价</span>\n' + '            <div class="r"><span class="price">¥' + d.payFee + '</span></div>\n' + '        </div>');
                //btm.append(' <div class="item">\n' +
                //        '            <span class="l name">订单内容</span>\n' +
                //        '            <div class="r">\n' +
                //        '                <p class="c">xxxxxx卡券 *1</p>\n' +
                //        '                <p class="c">xxxxxx卡券 *1</p>\n' +
                //        '                <p class="c">xxxxxx卡券 *1</p>\n' +
                //        '            </div>\n' +
                //        '        </div>')
                btm.append('  <div class="item orderCont">\n' + '            <span class="l name">订单编号</span>\n' + '            <div class="r">' + d.orderNo + '</div>\n' + '        </div>');
                btm.append('  <div class="item">\n' + '            <span class="l name">创建时间</span>\n' + '            <div class="r">' + base.time(d.mallGoodsInfo.createTime).slice(0, -3) + '</div>\n' + '        </div>');

                // 备注：1:虚拟商品 2:到店安装 3:邮寄商品
                switch (Number(d.goodsType)) {
                    case 1:
                        //payFee
                        //Number  必有字段  备注：订单状态：1待支付、2已支付、3取消、4已完成
                        switch (Number(d.status)) {
                            case 1:
                                cont.append(' <div class="btnBox">\n' + '        <a class="btn" href="' + data.mallOrderDetailUrl + '">\n' +
                                //'        <a class="btn" href="pay.html?orderid='+base.GTUrlParam().orderid+'">\n' +
                                '            立即支付\n' + '        </a>\n' + '    </div>');
                                break;
                            case 2:
                                btm.append('  <div class="item">\n' + '            <span class="l name">支付时间</span>\n' + '            <div class="r">' + base.time(d.payTime).slice(0, -3) + '</div>\n' + '        </div>');
                                break;

                            case 3:
                                break;

                            case 4:
                                btm.append('  <div class="item">\n' + '            <span class="l name">支付时间</span>\n' + '            <div class="r">' + base.time(d.payTime).slice(0, -3) + '</div>\n' + '        </div>');
                                var cardStr = '';
                                var imgStr='';
                                if(v.serviceNetwork.serviceNetworkBanner.length){
                                    imgStr=' <img src="' + v.serviceNetwork.serviceNetworkBanner[0].bannerPhoto + '" class="brandLogo">'
                                }
                                cardStr += '<div class="swiper-slide">\n' + '                    <h2>' + data.order.orderInputCardLog.simpleName + '</h2>\n' + '                    <p class="t1">卡号： ' + data.order.orderInputCardLog.memberCardNo + ' </p>\n' + '                    <div class="person">\n' + '                        <div class="l">\n' + '                            <span class="name">会员姓名：' + data.order.orderInputCardLog.memberName + '</span>\n' + '                            <p> ' + data.order.orderInputCardLog.autoInfoName + ' ' + data.order.orderInputCardLog.plateNum + '</p>\n' + '                        </div>\n' + '                        <div class="r">\n' +imgStr+ '                        </div>\n' + '                    </div>\n' + '                </div>\n';

                                var str = '<div class="item">\n' + '            <span class="l name">\n' + '                已充入以下会员卡：\n' + '            </span>\n' + '            <div class="clear"></div>\n' + '            <div class="cardBox">\n' + cardStr + '            </div>\n' + '        </div>';
                                $('.orderCont').before(str);

                                break;
                            default:
                                base.tip.tipsFn('未知错误，请联系管理员');
                                break;
                        }

                        break;

                    case 2:
                        switch (Number(d.status)) {
                            case 1:
                                cont.append(' <div class="btnBox">\n' + '        <a class="btn" href="' + data.mallOrderDetailUrl + '">\n' + '            立即支付\n' + '        </a>\n' + '    </div>');
                                break;
                            case 2:case 4:
                                btm.append('  <div class="item">\n' + '            <span class="l name">支付时间</span>\n' + '            <div class="r">' + base.time(d.payTime).slice(0, -3) + '</div>\n' + '        </div>');
                                break;
                            case 3:
                                break;
                            default:
                                base.tip.tipsFn('未知错误，请联系管理员');
                                break;
                        }
                        break;
                    case 3:
                        switch (Number(d.status)) {
                            case 1:
                                cont.append(' <div class="btnBox">\n' + '        <a class="btn" href="' + data.mallOrderDetailUrl + '">\n' + '            立即支付\n' + '        </a>\n' + '    </div>');
                                break;
                            case 2:case 4:
                                btm.append('  <div class="item">\n' + '            <span class="l name">支付时间</span>\n' + '            <div class="r">' + base.time(d.payTime).slice(0, -3) + '</div>\n' + '        </div>');
                                if (d.mallOrderPost) {
                                    $('.orderCont').before('<div class="item shInfo">\n' + '            <span class="l name">\n' + '                收货信息\n' + '            </span>\n' + '  <div class="clear getadrBox">\n' + '                <p><span>收货人</span><span>：</span><span class="p">' + d.mallOrderPost.name + '</span></p>\n' + '                <p><span>收货电话</span><span>：</span><span class="p">' + d.mallOrderPost.tel + '</span></p>\n' + '                <p><span>收货地址</span><span>：</span><span class="p">' + d.mallOrderPost.address + '</span></p>\n' + '            </div>' + '        </div>');
                                    /* btm.append('<div class="item">\n' +
                                             '            <span class="l name">\n' +
                                             '                收货信息\n' +
                                             '            </span>\n' +
                                             '  <div class="clear getadrBox">\n' +
                                             '                <p><span>收货人</span><span>：</span><span class="p">'+d.mallOrderPost.name+'</span></p>\n' +
                                             '                <p><span>收货电话</span><span>：</span><span class="p">'+d.mallOrderPost.tel+'</span></p>\n' +
                                             '                <p><span>收货地址</span><span>：</span><span class="p">'+d.mallOrderPost.address+'</span></p>\n' +
                                             '            </div>'+
                                             '        </div>')*/
                                    if (Number(d.mallOrderPost.status) == 2) {
                                        $('.shInfo').after('<div class="item">\n' + '            <span class="l name">\n' + '                快递信息\n' + '            </span>\n' + '            <div class="clear getadrBox">\n' + '                <p><span>快递公司</span><span>：</span><span class="p">' + d.mallOrderPost.logisticsName + '</span></p>\n' + '                <p><span>快递单号</span><span>：</span><span class="p">' + d.mallOrderPost.logisticsNo + '</span></p>\n' + '            </div>\n' + '        </div>');
                                        /*  btm.append('<div class="item">\n' +
                                                  '            <span class="l name">\n' +
                                                  '                快递信息\n' +
                                                  '            </span>\n' +
                                                  '            <div class="clear getadrBox">\n' +
                                                  '                <p><span>快递公司</span><span>：</span><span class="p">'+d.mallOrderPost.logisticsName+'</span></p>\n' +
                                                  '                <p><span>快递单号</span><span>：</span><span class="p">'+d.mallOrderPost.logisticsNo+'</span></p>\n' +
                                                  '            </div>\n' +
                                                  '        </div>')*/
                                    }
                                }
                                //类型：Number  必有字段  备注：状态：1待邮寄，2已发货
                                break;
                            case 3:
                                break;
                            default:
                                base.tip.tipsFn('未知错误，请联系管理员');
                                break;
                        }
                        break;
                    default:
                        base.tip.tipsFn('未知错误，请联系管理员');
                        break;
                }
            }

            $('.loader').hide();
        }
    },
    c: {
        init: function init() {
            if (base.GTUrlParam().orderid) {
                orderDetial.m.query();
            } else {
                base.tip.tipsFn('订单id缺失，请联系管理员');
            }
        }
    }
};