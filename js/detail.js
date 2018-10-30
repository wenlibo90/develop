'use strict';

var detail = {
    m: {
        //未开售倒计时
        timeEnd: function timeEnd(timerid, needTime) {
            function add0(m) {
                return m < 10 ? '0' + m : m;
            }
            var leftTime = new Date(needTime) - new Date(); //计算剩余的毫秒数
            var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
            var seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数
            days = add0(days);
            hours = add0(hours);
            minutes = add0(minutes);
            seconds = add0(seconds);
            if (days >= 0 || hours >= 0 || minutes >= 0 || seconds >= 0) return {
                days: days, hours: hours, minutes: minutes, seconds: seconds
            };
            if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
                window.clearInterval(timerid);
                timerid = null;
            }
        },
        query: function query(id) {
            //页面初始化
            base.GTsetAjax('get', 'mallgoodsinfoapi/getmallgoodsinfobyid', { id: id }, function (data) {
                detail.v.viewInit(data);
            });
        },
        checkNum: function checkNum(v) {
            if (!isNaN(v)) {
                if (v > 0) {
                    if (v * Number($('.specCont .price span').html()) > 10000) {
                        base.tip.tipsFn('单笔订单金额不能超过<span style="color: #FF6A20 ;">10000</span>元');
                        return false;
                    } else {
                        return true;
                    }
                }
            }
            base.tip.tipsFn('<span style="color: #FF6A20 ;">请输入正确的商品数量,数量至少为1</span>');
            return false;
        },
        specQuery: function specQuery(obj) {
            // 规格面板
            var str = $(obj).html();
            //判断一下 是否属于可以查看面板的 在售 下架 未开售 未定
            switch (str) {
                case '确定':
                    var o = $(obj).parents('.skuBox').find('.pItem.on');
                    if (o.length == $(obj).parents('.skuBox').find('.p2List').length) {
                        //    生成预支付订单 跳转支付页面
                        var num_ = $('.getNum').val();
                        var b = {
                            skuId: sessionStorage.getItem('skuId'),
                            purchaseNum: num_,
                            platformId: base.GTcookie.getCookie('platformId')
                        };
                        if (detail.m.checkNum(num_)) {
                            base.GTsetAjax('get', 'mallorderapi/savemallorder', b, function (data) {
                                //500毫秒延迟跳转
                                $('.loader').show();
                                setTimeout(function () {
                                    window.location.href = data.mallOrderDetailUrl;
                                },500)
                            });
                        }
                    } else {
                        base.tip.tipsFn('<span style="color: #FF6A20 ;">请完善商品规格的选择</span>');
                    }
                    break;
                case '已售罄':
                    base.tip.tipsFn('对不起,该商品已售罄，再看看别的吧');
                    break;
                case '已下架':
                    base.tip.tipsFn('对不起,该商品已下架，再看看别的吧');
                    break;
                default:
                    base.GTsetAjax('get', 'mallgoodsskuapi/getmallgoodsskulistbygoodsid', { goodsId: base.GTUrlParam().id }, function (data) {
                        detail.v.specView(data);
                    }, null, function () {
                        $('.specBox').show();
                        $(obj).html('确定');
                    });
                    break;
            }
        },
        check: function check(obj) {
            $(obj).addClass('on').siblings().removeClass('on');
            var o = $(obj).parents('.skuBox').find('.pItem.on');
            if (o.length == $(obj).parents('.skuBox').find('.p2List').length) {
                //规格属性集合字符串 例如：[{attrId=1,attrValueId=1},{attrId=2,attrValueId=2},{attrId=3,attrValueId=3}]
                var arr = '[';
                $.each(o, function (i, v) {
                    arr += '{attrId=' + $(v).attr('data-attrid') + ',attrValueId=' + $(v).attr('data-id') + '},';
                });
                detail.m.getPrice(base.GTUrlParam().id, arr.slice(0, -1) + ']');
            }
        },
        getPrice: function getPrice(goodsId, paramList) {
            base.GTsetAjax('get', 'mallgoodsskuapi/getmallgoodsskubyparam', { goodsId: goodsId, paramList: paramList }, function (data) {
                detail.v.priceView(data);
            });
        },
        plusFn: function plusFn() {
            var obj = $('.getNum');
            var num = obj.val();
            ++num;
            $('.plus').addClass('on');$('.reduce').removeClass('on');
            if (num * $('.p1 .price span').html() > 10000) {
                base.tip.tipsFn('单笔订单金额不能超过<span style="color: #FF6A20 ;">10000</span>元');
                return null;
            } else {
                obj.val(num);
            }
        },
        reduceFn: function reduceFn() {
            var obj = $('.getNum');
            var num = obj.val();
            --num;
            $('.reduce').addClass('on');$('.plus').removeClass('on');
            if (num <= 0) {
                base.tip.tipsFn('购买数量至少为<span style="color: #FF6A20 ;">1</span>个');
                return null;
            } else {
                obj.val(num);
            }
        }
    },
    v: {
        closeFn: function closeFn() {
            $('.specBox').hide();
            $('.toBuy').html('立即购买');
        },
        viewInit: function viewInit(data) {

            //状态：1未上架，2已上架，3下架
            var btn = $('.toBuy');

            if (data.mallGoodsInfo || data.mallGoodsInfo != null) {
                switch (Number(data.mallGoodsClass.status)) {
                    case 1:

                        base.tip.tipsFn();
                        break;
                    case 2:
                        //1:已开售 2:未开售
                        //   sumStock 以售罄字段
                        if (data.mallGoodsInfo.checkSale == 2) {
                            btn.addClass('in');
                            detail.m.specQuery = null;
                            var timeObj = void 0;
                            var time = setInterval(function () {
                                timeObj = detail.m.timeEnd(time, data.mallGoodsInfo.saleTimeStart);

                                btn.html('距离开售：' + timeObj.days + '天' + timeObj.hours + '时' + timeObj.minutes + '分' + timeObj.seconds + '秒');
                            }, 1000);
                        } else {
                            if (data.sumStock == '0') {
                                btn.addClass('out').html('已售罄');
                            } else {
                                btn.attr('class', 'toBuy');
                            }
                        }
                        break;
                    case 3:
                        btn.addClass('out').unbind("click");
                        detail.m.specQuery = null;
                        break;
                    default:
                        base.tip.tipsFn();
                        break;
                }
                if (data.mallGoodsInfoContent) {
                    $('.cont').html(data.mallGoodsInfoContent.content);
                } else {
                    //    暂无详细描述
                }
                var box = $('.swiper-wrapper');
                if (data.mallGoodsInfo.mallGoodsImgsList.length > 0) {
                    var s;

                    (function () {
                        box.html('');
                        var flag = /(mp4|avi|WMV|RM|RMVB|MPEG1|MPEG2|MPEG4|3GP|ASF|SWF|VOB|DAT|MOV|M4V|FLV|F4V|MKV|MTS|TS)$/.test(data.mallGoodsInfo.mallGoodsImgsList[0].openUrl);
                        $.each(data.mallGoodsInfo.mallGoodsImgsList, function (i, v) {
                            if (i) {
                                box.append('<div class="swiper-slide "><img src="' + v.openUrl + '"></div>');
                            } else {
                                if (flag) {
                                    box.append('<div class="swiper-slide videoBox"><video src="' + data.mallGoodsInfo.mallGoodsImgsList[0].openUrl + '" controls="controls" poster="img/noshop.png"  playsinline="true" webkit-playsinline="true"  preload="auto"></video>' + '  <div class="posterBg">\n' + '   <img class="videoImg" src="img/arrow.png"/>' + ' </div>\n' + '</div>');
                                    var videoBor = $('.videoBox');
                                    var video1 = $('video');
                                    videoBor.on("click", function () {
                                        s.autoplay.stop();
                                        var $video = $(this).find("video")[0];
                                        if ($video.paused) {
                                            var videoPoster = $(this).find(".posterBg"); //当前封面对象
                                            videoPoster.hide();
                                            $video.play();
                                        }
                                    });
                                    video1.on("pause", function () {
                                        /*所有封面浮层show&所有视频hide*/
                                        videoBor.find(".posterBg").show();
                                        videoBor.find("video").hide();
                                    });

                                    video1.on("play", function () {
                                        /*当前视频show*/
                                        $(this).show();
                                        if ($(this)[0].play) {
                                            s.autoplay.stop();
                                        }
                                    });
                                } else {
                                    box.append('<div class="swiper-slide "><img src="' + v.openUrl + '"></div>');
                                }
                            }
                        });
                        s = new Swiper('.swiper-container', {
                            pagination: {
                                el: '.swiper-pagination'
                            }
                        });


                        var imgsurl = [];
                        var nowurl = '';
                        var imgObj = $(".swiper-wrapper img");
                        for (var i = 0; i < imgObj.length; i++) {
                            imgsurl[i] = imgObj[i].src;
                            imgObj[i].onclick = function () {
                                nowurl = this.src;
                                wx.previewImage({
                                    current: nowurl,
                                    urls: imgsurl
                                });
                            };
                        }
                    })();
                } else {
                    //缺一个商品默认图片
                    box.html('<div class="swiper-slide "><img src="http://static.yuntongauto.com/web/badminton/img/noshop.png"></div>');
                }
                //价格
                if (Number(data.mallGoodsInfo.basePrice) == 0) {
                    $('.t1 .price').html('免费');
                } else {
                    $('.t1 .price span').html(data.mallGoodsInfo.basePrice);
                }

                //规格面板img
                $('.specCont .p1 img').attr('src', data.mallGoodsInfo.mainImg);
                //title名称
                $('.t1 .tit').html(data.mallGoodsInfo.title);
                //规格名称
                $('.p1 .txt p:last-child').html(data.mallGoodsInfo.title);
                //注意事项
                $('.matter .p2List').html(data.mallGoodsInfo.buyExplain);
                //卖点
                $('.t2 span').html('商品卖点：' + data.mallGoodsInfo.sellingPoints);
            } else {
                base.tip.tipsFn('没有商品信息');
                btn.addClass('out').html('已下架');
            }
            $('.back').attr('href','index.html?id='+base.GTcookie.getCookie('id'))
            $('.loader').hide()
        },
        specView: function specView(data) {
            //规格面板的价格

            $('.specCont .price span').html($('.t1 .price span').html());
            var arr1 = data.FirstLevelAttrList;
            var arr2 = data.SecondLevelAttrList;
            var box = $('.skuBox');
            box.html('');
            if (arr1.length > 0) {
                $.each(arr1, function (i, v) {
                    box.append(' <div class="p2">\n' + '                        <p>' + v.attrName + '</p>\n' + '                        <p class="p2List" data-id="' + v.attrId + '"></p>\n' + '                    </div>');
                });
            } else {
                base.tip.tipsFn('商品没有规格名，请联系管理员');
            }
            var arr3 = box.find('.p2List');
            if (arr2.length > 0) {
                $.each(arr3, function (i, v) {
                    $.each(arr2, function (j, q) {
                        if (q.attrId == $(v).attr('data-id')) {
                            $(v).append('<span class="pItem" onclick="detail.m.check(this)" data-id="' + q.attrValueId + '" data-attrid="' + q.attrId + '">' + q.attrValueName + '</span>');
                        }
                    });
                });
                //默认选中一个不是0的
                $.each(data.mallGoodsSkuList, function (i, v) {
                    if (v.stock != '0') {
                        $.each(v.mallGoodsSkuAttrList, function (j, q) {

                            $.each($('.pItem'), function (w, z) {
                                if (q.attrValueId == $(z).attr('data-id') && !$(z).hasClass('on')) {
                                    detail.m.check(z);
                                }
                            });
                        });

                        return false;
                    }
                });
            } else {
                base.tip.tipsFn('商品没有规格属性，请联系管理员');
            }
        },
        priceView: function priceView(data) {
            sessionStorage.setItem('skuId', data.mallGoodsSku.id);
            if (data.mallGoodsSku.stock == '0') {
                $('.toBuy').addClass('out').html('已售罄');
            } else {
                $('.toBuy').removeClass('out').html('确定');
            }
            $('.specCont .price span').html(data.mallGoodsSku.retailPrice);
        }
    },
    c: {
        init: function init() {
            if (base.GTUrlParam().id) {
                detail.m.query(base.GTUrlParam().id);
            } else {
                base.tip.tipsFn('获取不到商品ID');
            }
        }
    }
};