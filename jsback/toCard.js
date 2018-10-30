let payEnd={
    m:{
        rechargeCard:function () {
            switch ($('.cBox .btn').html().trim()){
                case '充入会员卡':
                    payEnd.m.toCardFn()
                    break;
                case '申请会员卡':
                    window.location.href=payEnd.c.applyMemberCardUrl
                    break;
                default:
                    base.tip.tipsFn('未知错误！<br> 请联系管理员！')
                    break
            }
        },
        toCardFn:function () {
            base.GTsetAjax('post','orderinsertmemberapi/insertmemberorder',{
                orderId:base.GTUrlParam().orderid?base.GTUrlParam().orderid:base.GTUrlParam().orderId,
                memberId:$('.swiper-slide-active').attr('data-memberId')
            },function (data) {
                //base.tip.tipsFn('充入成功')
                let id=base.GTUrlParam().orderid?base.GTUrlParam().orderid:base.GTUrlParam().orderId
                window.location.href='cardEnd.html?orderid='+id
            })
        },
        query:function () {
            base.GTsetAjax('get','mallorderapi/getmallorderdetail',{
                orderId:base.GTUrlParam().orderid?base.GTUrlParam().orderid:base.GTUrlParam().orderId
            },function (data) {
                payEnd.v.initView(data)
            })
        }
    },
    v:{
        initView:function (data) {

            $('.back').attr('href',data.mallOrderListUrl)
            payEnd.c.mallOrderListUrl=data.mallOrderListUrl;
            payEnd.c.applyMemberCardUrl=data.applyMemberCardUrl;


            let cBox=$('.cBox')
            if(data.memberList.length>0){
                let box=$('.swiper-wrapper');
                let str=''
                box.html('')
                $.each(data.memberList,function (i, v) {
                    str+=' <div class="swiper-slide" data-memberId="'+v.autoInfo.memberId+'">\n' +
                            '                    <h2>'+v.serviceNetwork.name+'</h2>\n' +
                            '                    <p class="t1">卡号：'+v.memberCardNo+'</p>\n' +
                            '                    <div class="person">\n' +
                            '                        <div class="l">\n' +
                            '                            <span class="name">'+v.memberName+'</span>\n' +
                            '                            <p>'+v.autoInfo.autoStyleName+' '+v.autoInfo.plateNum+'</p>\n' +
                            '                        </div>\n' +
                            '                        <div class="r">\n' +
                            '                            <img src="'+v.serviceNetwork.serviceNetworkBanner[0].bannerPhoto+'" class="brandLogo">\n' +
                            '                        </div>\n' +
                            '                    </div>\n' +
                            '                </div>'
                })
                box.html(str)

                $('#toCard').attr('href',payEnd.c.applyMemberCardUrl)

                if(data.memberList.length ==1){
                    new Swiper('.swiper-container', {
                        slidesPerView:1.1,
                        spaceBetween: 40,
                        freeMode: true
                    });
                }else{
                    new Swiper('.swiper-container', {
                        slidesPerView: 1.15,
                        spaceBetween: 40,
                        freeMode: true
                    });
                }
                $('.swiper-slide').click(function () {
                    $(this).addClass('swiper-slide-active').siblings().removeClass('swiper-slide-active')
                })
                $('.cardBox').show()
            }else{
                $('.cardBox').hide()
                cBox.find('.t3').hide()
                $('.tmsg').html('感谢您的购买！该商品为套餐商品，需要 <br/>  \n' +
                        '充入会员卡中，您还不是本店的会员，咱<br/>\n' +
                        '们来申请个会员吧')
                cBox.find('.btn').html('申请会员卡').css('margin-top','100px')
            }
            $('.loader').hide()
        },

        msgFn:function (msg) {
            $('.tmsg').html(msg)
        },
        goodsTypeFn:function (num,flag) {
            //虚拟商品 1
            // 到店安装 2
            // 邮寄商品 3
            let cardBox=$('.cBox')
            let btnBox=$('.btnBox')
            let getAdr=$('.getAdr')
            $('.cont1').hide()
            switch (Number(num)){
                case 1:
                    cardBox.show()
                    payEnd.v.msgFn(' 感谢您的购买！<br> 请您尽快将所购买的产品充入到您的会员卡中吧！')
                    break;
                case 2:
                    btnBox.show();
                    $('.tit').html('支付失败')
                    payEnd.v.msgFn('感谢您的购买！该商品为精品配件，请您<br>尽快<span style="color: #FF6A20;">到店安装</span>吧！')
                    break;
                case 3:
                    getAddr.c.init();
                    getAdr.show()
                    getAddr.v.txtFn();

                    payEnd.v.msgFn('感谢您的购买！请填写您的地址，我们<br>会尽快给您邮寄！')
                    break;
                default:
                    base.tip.tipsFn();
                    break;
            }
            if(flag==2){
                getAdr.hide()
                btnBox.hide()
                cardBox.hide()
                payEnd.v.msgFn('支付失败，请重新支付')
            }
        }
    },
    c:{
        init:function () {
            let id=base.GTUrlParam().orderid?base.GTUrlParam().orderid:base.GTUrlParam().orderId

            if(id){
                payEnd.m.query()
            }else{
                payEnd.v.msgFn('订单来源获取失败，请联系管理员')
            }
        },
        mallOrderListUrl:'',
        //申请会员卡地址
        applyMemberCardUrl:'http://test.yuntongauto.com/member/go_apply'
    }
}