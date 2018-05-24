$(function () {
    var time;
    var auctionCarId,auctionId,carId,nextAuctionCarId,status;

    init();
    //等待开趴的
    $('.startBtn').click(function () {
        queryList(getUrlParam().sateId);
        $('.sateShow').hide();
        $('.wait').hide();

        //本场次状态改为正在竞拍
        startAction(getUrlParam().sateId)
    })
    /*结束本辆车*/
    $('.closeCarBtn').click(function(){
        carIsStatus(auctionCarId)
    })

    $('.nextCarBtn').click(function(){
        $(this).hide();
        $('.closeCarBtn').show();
        $('.s-c-btom').removeClass('on');
        $('#beginPrice').html('起拍价')
        $('#maxPrice').html('——')
        $('#carResult').html('<em id="startingPrice"></em>万')
        console.log(nextAuctionCarId+'下一个车的场次车辆id')
        if(nextAuctionCarId==null || nextAuctionCarId==''){
            //将本场次状态改为结束
            actionEnd(getUrlParam().sateId)
        }else{
            queryList(getUrlParam().sateId,nextAuctionCarId)
        }
    })
    function screenIsStatus() {
        $.ajax({
            url:basePath+'/boss/localeAuction/largeScreenAuctionInfo',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                //车辆场次id
                auctionId:getUrlParam().sateId
            }),
            error : function() {
                alert('请求失败');
            },
            success : function(data){
                if(data.success){
                    console.log(data.data)
                    $('.beginShade .sateName').html(data.data.title)
                    $('.beginShade .sateCarNume').html('参拍车辆：'+data.data.carNum+'辆')
                    $('.beginShade .sateStartTime').html('开拍时间：'+timeObj(data.data.startTime).h+':'+timeObj(data.data.startTime).mm)
                    $('.endShade .sateName').html('参拍车辆 : '+data.data.carNum+'辆');
                    status=data.data.status
                }else{
                    alert(data.resultMsg);
                }
            }
        });
    }
    function init(){
//            状态：1待上拍，2等待开拍，3正在竞拍，4竞拍结束
        var sateShow=$('.sateShow')
        var endShade=$('.endShade')
        var beginShade=$('.beginShade')
        screenIsStatus()
        console.log(status)
        switch (status){
            case '3':
                queryList(getUrlParam().sateId);
                break;
            case '2':
                sateShow.show();
                beginShade.show();
                endShade.hide();
                break;
            default:
                alert('当前场次不处于待开拍、正在竞拍的状态不可展示');
                $('.screenBox').animate({
                    'height':'15px',
                    'opacity':0
                })
                setTimeout(function () {
                    window.close();
                },2000)
                break
        }
    $('.screenBox').show()
    }
//        查询车辆信息
    function queryList(sateId,nextAuctionCarId) {
        nextAuctionCarId=nextAuctionCarId?nextAuctionCarId:null;
        console.log(sateId+'auctionCarId'+nextAuctionCarId)
        $('.wait').hide()
        $('.begin').show()
        $.ajax({
            url:basePath+'/boss/localeAuction/largeScreenShowCar',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionId:sateId,
                auctionCarId:nextAuctionCarId
            }),
            error : function() {
                alert('请求失败');
            },
            success : function(data){
                if(data.success){
                    screenShow(data.data)
                }else{
                    alert(data.resultMsg);
                }
            }
        });
    }

    function screenShow(data) {
console.log(data)
        $('.cost-stuts').show()
        $('.closeCarBtn').show()
        $('.nextCarBtn').hide()
        //最高价
        $('#maxPrice').html('--')
        //合手价
        $('#lastPrice').html('--')
        console.log(data)

        $('#title').html(data.title)
        $('#autoInfoName').html(data.autoInfoName)
        $('#sort').html(data.auctionCode)
        $('#beginRegisterDate').html(timeFormat(data.beginRegisterDate).slice(0,-9))
        $('#licenseNumber').html(data.licenseNumber)
		if(data.mileage%10000==0){
			$('#mileage').html(parseFloat((data.mileage/10000)).toFixed(0)+'万公里')
		}else{
			$('#mileage').html(parseFloat((data.mileage/10000)).toFixed(1)+'万公里')
		}
        
        //使用性质
        $('#useNature').html(data.useNature)

        //是否代办  1需要，2不需要
        $('#ifAgent').html(data.ifAgent==1?'是':'否')

        $('.wait').hide()
        $('.begin').show()
        //起拍价agentPrice
        $('#startingPrice').html(data.startingPrice/10000)
        $('#agentPrice').html(data.agentPrice+'元')
        $('#servicePrice').html(data.servicePrice)
        nextAuctionCarId=data.nextAuctionCarId;
        //这里需要判断一下是否为最后一辆车
        if(data.nextAuctionCarId==null){
            $('#nextAutoInfoName').html('此车为最后一辆');
        }else{
            $('#nextAutoInfoName').html("下一辆: "+data.nextAutoInfoName)
            //获取下辆车的场次车辆id
            nextAuctionCarId=data.nextAuctionCarId;
            console.log(nextAuctionCarId+'这里是查询车辆信息的下一个车辆id')
        }
        //场次车辆id
        auctionCarId=data.auctionCarId;

        $(".box-slide").html('<ul class="slide"></ul>')
        var silde=$('.slide')
        silde.html('');
        var img=new Image();

        console.log(data.carAutoPhoto)
        if(data.carAutoPhoto==null){
            alert('当前车辆没有图片');
            $(img).attr('src','images/img-1.png')
            silde.append('<li><img src="images/img-1.png" alt=""></li>')
            jQuery(".box-slide").slide({ mainCell:".slide", effect:"left", delayTime:400,autoPlay:true,easing:"easeOutCubic"})
        }else{
            $(img).attr('src',data.carAutoPhoto)
            silde.append('<li><img src="'+data.carAutoPhoto+'" alt=""></li>')
        }
        img.onload=function(){
            jQuery(".box-slide").slide({ mainCell:".slide", effect:"left", delayTime:400,autoPlay:true,easing:"easeOutCubic"})
        }
//    定时获取车辆最高价
        time=setInterval(function () {
            getMaxPrice(auctionCarId);
            console.log(1)
        },500)
    }

//        暂停按钮的事件绑定
    $('.parseBtn').click(function(){
        $('.parse-bg').show()
        $('.wait').show();
        $('.begin').hide();
        //    暂停的时候 不在请求
        clearInterval(time)
    })
//关闭暂停遮照
    $('.parse-bg').click(function(){
        $(this).hide()
        $('.wait').hide();
        $('.begin').show();
        //$('#maxPrice').html(maxPrice)
        time=setInterval(function () {
            getMaxPrice(auctionCarId)
        },500)
    });

    //竞拍结束 获取竞拍结果
    function carIsStatus(auctionCarId) {
        //确定当前车的状态 更改样式
        $.ajax({
            url:basePath+'/boss/localeAuction/largeScreenAuctionResult',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                //车辆场次id
                auctionCarId:auctionCarId
            }),
            error : function() {
                alert('请求失败');
            },
            success : function(data){
                if(data.success){
                    console.log(data)
                    clearInterval(time);
                    carResult(data.data)
                }else{
                    alert(data.resultMsg);
                }
            }
        });
    }


    //判断车辆结果
    function carResult(data) {

        $('#beginPrice').html('竞拍结果')
        $('.begin').show()
        //$('.wait').show()
        //$('p.cost-txt span.r').hide()
        $('.s-c-btom').addClass('on')
        $('.slide-hide').slideDown()
        $('.cost-stuts').hide()

        console.log(data.lastBid/10000)
        //最高价
        $('#lastPrice').html(data.combinedPrice/10000)
        //合手价
        $('#maxPrice').html(data.lastBid/10000)
        //流拍 已成交
        if(data.auctionStatus=='2'){
            $('#carResult').html( '<em>成交</em>')
        }else{
            $('#carResult').html('<em>流拍</em>')
        }

        $('.nextCarBtn').show()
        $('.closeCarBtn').hide()
    }


    function actionEnd(auctionId) {
        $.ajax({
            url:basePath+'/boss/localeAuction/largeScreenAuctionFinish',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionId:auctionId
            }),
            error : function() {
                alert('请求失败');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    $('.screenBox').animate({
                        'height':'15px',
                        'opacity':0
                    })
                    $('.sateShow').show();
                    $('.endShade').show();
                    $('.beginShade').hide();
                }else{
                    alert(data.resultMsg);
                }
            }
        });
    }
    //场次状态改为开拍
    function startAction(auctionId) {
        console.log(auctionId)
        $.ajax({
            url:basePath+'/boss/localeAuction/largeScreenStartAuction',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionId:auctionId
            }),
            error : function() {
                alert('请求失败');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    if(data.data.count==1){
                        $('.wait').hide();
                        $('.begin').show();
                    }
                }else{
                    alert(data.resultMsg);
                }
            }
        });
    }
    //   获取车辆最高价
    //var maxPrice;
    function getMaxPrice(auctionCarId) {
        $.ajax({
            url:basePath+'/boss/localeAuction/largeScreenBidPrice',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                //场次车辆id
                auctionCarId:auctionCarId
            }),
            error : function() {
                //alert('请求失败');
                $('.hideBox').show();
                $('.hideBox .tit').html('服务器连接出错，请联系管理员')
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    $('.hideBox').hide();
                    if(data.resultCode==100){
                        //默认返回数据 为 元 展示为万元
                        var maxPrice=data.data.lastBid/10000;
                        $('#maxPrice').html(maxPrice)
                    }
                }else if(data.resultCode==102){
                    console.log('没有获取到最高价')
                    $('#maxPrice').html('--')
                }else{
                    $('.hideBox').show();
                    $('.hideBox .tit').html(data.resultMsg)
                    //alert(data.resultMsg);
                }
            }
        });
    }
})