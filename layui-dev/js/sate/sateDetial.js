/*
      字段说明
      */
layui.use(['table','layer','form'], function(){
    var table = layui.table, $= layui.jquery,layer = layui.layer,laydate = layui.laydate,form = layui.form,upload = layui.upload;
    laydate.render({
        elem: '#date'
    });
    init();
    function init() {
        queryList(Number(getUrlParam().sateId))
    }
    $('#outModel').click(function(){
        window.open(basePath+'/boss/importPrice/exportCarPriceTemplate?auctionId='+Number(getUrlParam().sateId))
    })
    //导入价格
    $('#excel').change(function (e) {
        var formData = new FormData();
        formData.append('file',this.files[0])
        formData.append('auctionId',Number(getUrlParam().sateId))
        fileUpload(formData)
    })
    function fileUpload(data){
        $.ajax({
            type:'post',
            url:basePath+'/boss/importPrice/importCarPriceInfo',
            beforeSend: function(xhr){
                xhr.setRequestHeader("appId", "1234567_boss");
                if(getCookie('token')!=null||getCookie('token')!="")
                    xhr.setRequestHeader("Authorization",getCookie('token'));
                layer.load();
            },
            async:false,
            data:data,
            cache : false,
            contentType : false,
            processData : false,
            success:function(data){
                layer.closeAll('loading'); //关闭loading
                if(data.success){
                    init();
                    if(data.data.noPrice==''){
                        parent.layer.msg('价格导入成功！');
                    }else{
                        parent.layer.msg('车辆编号为'+data.data.noPrice+'价格信息未填写！');
                    }
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
            ,error:function (data) {
                layer.closeAll('loading'); //关闭loading
                parent.layer.msg('导入价格失败，请联系管理员');
            }
        })
    }

    function queryList(id){
        console.log(id)
        $.ajax({
            url:basePath+'/boss/localeAuction/getLocaleAuctionDetail',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                id:id
            }),
            error : function() {
                parent.layer.msg('请求失败');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    sateDetail(data.data.entity)
                    carDetail(data.data.entries)
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }
    function delCar(id,index) {
        $.ajax({
            url:basePath+'/boss/localeAuction/deleteAuctionCar',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionCarId:id
            }),
            error : function() {
                parent.layer.msg('请求失败');
            },
            success : function(data){
                console.log(data);
                if(data.success){
                    if(data.data.count){
                        parent.layer.msg('删除成功');
                        parent.layer.close(index);
                        init();
                    }
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }

//            操作绑定
    $('.carDetail').on('click','a',function(){
        var con;
        //id 场次车辆id
        var id=$(this).parents('tr').attr('data-id')
        //carId 车辆id
        var carId=$(this).parents('tr').attr('data-carId')
        //auctionId 场次id
        var auctionId=$(this).parents('tr').attr('data-auctionId')

        var lastBid=$(this).parents('tr').find('.lastBid').html()
        var startingPrice=$(this).parents('tr').find('.startingPrice').html()
        if($(this).hasClass('del')){
            parent.layer.confirm('是否删除车辆？',{shade:0}, function(index){
                //是，调用接口
                delCar(id,index)
            });
        }
        if($(this).hasClass('second')){
            con = '<div class="layui-field-box" style="padding:30px 40px 0 0" id="s_box">' +
                    '<p class="layui-form-item"><span class="layui-form-label">起拍价：</span><span class="layui-input-inline"><input class="layui-input startAmount" placeholder="设置起拍价/万" type="text"></span></p>' +
                    '<p class="layui-form-item"><span class="layui-form-label">保留价：</span><span class="layui-input-inline"><input class="layui-input reserveAmount" placeholder="设置保留价/万" type="text"></span></p>' +
                    '</div>';
            layer.open({
                title: '二拍',
                type: 1,
                btn: ['确定', '取消'],
                shade: 0,
                content: con,
                yes: function(index,layero){
                    console.log('second')
                    console.log(index)
                    var flag=setAgain(id,carId,layero.find('.startAmount').val(),layero.find('.reserveAmount').val(),index)
                    /*if(flag){
                       layer.msg('二拍成功');
                        layer.close(index);
                        console.log(index)
                        init();
                    }*/
                }
            });
        }
        if($(this).hasClass('complete')){
            completeView(auctionId,id,carId);
        }
        if($(this).hasClass('bid')){
            bidView(id,carId,startingPrice,auctionId,id);
        }
        if($(this).hasClass('sequence')){
            layer.open({
                title: '修改排序',
                type: 1,
                btn: ['确定', '取消'],
                shade: 0,
                yes: function(index, layero){
                    sequenceFn(layero.find('.sequence').val(),id,index)
                },
                content: '<p style="padding:30px 40px 20px 0"><span class="layui-form-label">序列号：</span><span class="layui-input-inline"><input class="layui-input sequence" placeholder="请输入序号" type="text"></span></p>'
            });
        }
    })
    function supplierShow(arr,layero) {
        console.log(arr)
        $.ajax({
            url:basePath+'/boss/localeAuction/getCustomerInfo',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            error : function() {
                parent.layer.msg('请求失败，联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    $('.CarSeller1').html('<option value="">请选择拍牌号</option>').attr('lay-search');
                    $.each(data.data,function(i,v){
                        $('.CarSeller1').append('<option value="'+v.id+'">'+v.code+'</option>').attr('lay-search');
                    })

                    for(var i=0;i<arr.length;i++){
                        if(arr[i]!==null){
                          $.each(layero.find('.layui-table tr').eq(i+1).find('option'),function () {
                              if(arr[i]==$(this).val()){
                                  $(this).attr('selected','selected')
                              }
                          })
                        }
                    }
                    form.render()
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }

    function completeView(auctionId,auctionCarId,carId) {
        var carId_=carId;
        console.log(carId_)
        $.ajax({
            url:basePath+'/boss/localeAuction/getCustomerBidPriceList',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionId:auctionId,
                auctionCarId:auctionCarId,
                carId:carId_
            }),
            error : function() {
                parent.layer.msg('请求失败，联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    console.log(data.data)
                    var data_=data.data;
                    var str='';
                    var arr=[];
                    if(data.data.length<1){
                        str='<tr class="nodata"><td colspan="3" style="text-align:center;height:200px">暂无出价记录</td></tr>'
                    }else{
                        $.each(data.data,function(i,v){
                            arr.push(v.customerId)
                            str+='<tr data-id="'+v.id+'" data-auctionId="'+v.auctionId+'" data-auctionCarId="'+v.auctionCarId+'" data-carId="'+v.carId+'">' +
                                    '<td>'+timeFormat(v.bidTime)+'</td>' +
                                    '<td>'+v.bidFee/10000+'</td> ' +
                                    '<td>' +
                                    '<div class="layui-input-inline" style="width: 100%"><div class="layui-form">' +
                                    '<select class="layui-input CarSeller1" lay-verify="required" lay-search></select>' +
                                    '</div></div>' +
                                    '</td></tr> '
                        })
                    }
                    var con='<div class="layui-field-box " id="carRecords" > ' +
                            '<table class="layui-table"> <tr> ' +
                            '<th>出价时间</th>' +
                            '<th>出价/万</th>' +
                            '<th>拍牌号</th>' +
                            '</tr>' +str+
                            '</table></div>';
                    layer.open({
                        title: '拍牌号补全 - 出价记录',
                        type: 1,
                        area: ['500px','500px'],
                        btn: ['确定', '取消'],
                        shade: 0,//不显示遮罩
                        content: con,
                        success: function(layero, index){
                            supplierShow(arr,layero);
                            form.render();
                        },
                        yes: function(index, layero){
                            var saveSuperauctionBidRecordIds='';
                            if(layero.find('.layui-table  .nodata').length){
                                parent.layer.msg('没有可操作的数据');
                            }else{
                                $.each(layero.find('.layui-table tr'),function (i, v) {
                                    console.log(layero.find('.layui-table tr'))
                                    if(i>0){
                                        saveSuperauctionBidRecordIds+=$(this).attr('data-id')+'_'+$(this).find('.CarSeller1').val()+',';
                                    }
                                })
                                saveSuper(saveSuperauctionBidRecordIds.slice(0,-1),index)
                            }
                        }
                    });
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }

    function saveSuper(auctionBidRecordIds,index) {
        console.log(index)
        $.ajax({
            url:basePath+'/boss/localeAuction/setCustomerBidNumber',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionBidRecordIds:auctionBidRecordIds
            //    竞价记录id_车商id 格式："auctionBidRecordIds":"3822478917380096_333,3822479951177728_111"
            }),
            error : function() {
                parent.layer.msg('请求失败，联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    console.log(1111)
                    parent.layer.msg('操作成功');
                    init();
                   layer.close(index)
                    console.log(index)
                }else{
                    console.log(2222)
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }

    function bidView(id,carId,startingPrice,auctionId,auctionCarId) {
        var carId_=carId;
        console.log(carId_)
        $.ajax({
            url:basePath+'/boss/localeAuction/getAuctionCarInfo',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionCarId:id
            }),
            error : function() {
                parent.layer.msg('请求失败，联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    console.log(data.data)
                    var data_=data.data;
                    var price='';
                    if(!data_.topBidPrice){
                        price=data_.startingPrice/10000;
                    }else{
                        price=data_.topBidPrice/10000;
                    }
                    var con='<div class="layui-field-box bidBox" style="padding-left: 45px;" id="s_box">\n' +
                            '              <p class="layui-form-item" style="margin-bottom: 5px;">\n' +
                            '                  <span class="layui-form-label">序号：'+data_.sort+'</span>\n' +
                            '                  <span class="layui-form-label" style="width: 170px">车辆编号：'+data_.carAutoNo+'</span>\n' +
                            '              </p>\n' +
                            '              <p class="layui-form-item">\n' +
                            '                  <span class="layui-input-inline carTit" style="width: 300px;">车辆：'+data_.autoInfoName+'</span>\n' +
                            '              </p>\n' +
                            '<p class="layui-form-item">\n' +
                            '                      <span class="layui-btn layui-btn-xs bidModel" val="0.01">100</span>\n' +
                            '                      <span class=" layui-btn layui-btn-xs bidModel" val="0.02">200</span>\n' +
                            '                      <span class=" layui-btn layui-btn-xs bidModel" val="0.03">300</span>\n' +
                            '                      <span class=" layui-btn layui-btn-xs bidModel" val="0.05">500</span>\n' +
                            '                      <span class=" layui-btn layui-btn-xs bidModel" val="0.1">1000</span>\n' +
                            '                      <span class=" layui-btn layui-btn-xs bidModel" val="0.2">2000</span>\n' +
                            '                  </p>'+
                            '              <p class="layui-form-item">\n' +
                            '                  <span class="layui-form-label">*最高出价</span>\n' +
                            '                  <span class="layui-input-inline"><input class="layui-input bidNum " placeholder="设置出价(万)" type="text" value="'+price+'"></span>\n' +
                            '              </p>\n' +
                            '              <div class="layui-form-item ">\n' +
                            '                  <span class="layui-form-label">拍牌号：</span>\n' +
                            '                  <div class="layui-input-inline "><div class="layui-form">\n' +
                            '                      <select class="layui-input CarSeller" lay-verify="required" lay-search ></select>\n' +
                            '                   </div> </div>\n' +
                            '              </div>\n' +
                            '          </div>'

                    layer.open({
                        title: '填写出价',
                        type: 1,
                        btn: ['出价','关闭','重置'],
                        shade: 0,
                        area:['370px','350px'],
                        content: con,
                        success: function(layero, index){
                            Supplier();
                            $('.bidModel').click(function () {
                                var topBid=Number(layero.find('.bidNum').val());
                                var num=Number($(this).attr('val'));
                                topBid = (num*1000+topBid*1000)/1000;
                                layero.find('.bidNum').val(topBid)
                            })
                            form.render();
                        },
                        yes: function(index, layero){
                            if(typeof Number(layero.find('.bidNum').val())=='number'){
                                if(startingPrice <= Number(layero.find('.bidNum').val())){
                                      setBid(Number(layero.find('.bidNum').val()),auctionId,carId_,$('.CarSeller').val(),auctionCarId,index)
                                }else{
                                    parent.layer.msg('出价金额不能低于起拍价格');
                                }
                            }else{
                                parent.layer.msg('只填写数字！');
                            }
                        }
                        ,btn2:function () {
                            init();
                        }
                        ,btn3: function(index, layero){
                            resetRecord(auctionId,carId_,auctionCarId,index,layero)
                            return false;
                        }
                    });
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }


    function resetRecord(auctionId,carId,auctionCarId,index,layero) {
        console.log(auctionId+' 场次id'+ carId+'车辆'  +auctionCarId+''+index)
        $.ajax({
            url:basePath+'/boss/localeAuction/cleanLastBiddenInfo',
            //url:basePath+'/boss/localeAuction/cleanBiddenInfo',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                //auctionId:auctionId,
                //carId:carId,
                auctionCarId:auctionCarId
            }),
            error : function() {
                parent.layer.msg('请求失败，联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    //if(data.data.count){
                        layer.msg('重置成功');
                        //layer.close(index);
                        init();
                        layero.find('.bidNum').val(data.data.bidFee/10000)
                    //}else{
                    //    parent.layer.msg('重置失败');
                    //}
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }

    function Supplier() {
        $.ajax({
            url:basePath+'/boss/localeAuction/getCustomerInfo',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            error : function() {
                parent.layer.msg('请求失败，联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    $('.CarSeller').html('<option value>请选择拍牌号</option>');
                    $.each(data.data,function(i,v){
                        console.log(v)
                        $('.CarSeller').append('<option value="'+v.id+'">'+v.code+'</option>').attr('lay-search')
                        //$('.CarSeller').append('<option value="'+v.code+'">'+v.name+'</option>')
                    })
                    form.render()
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }

    function setAgain(auctionCarId,carId,startAmount,reserveAmount,index) {
        console.log(auctionCarId+'auctionCarId'+carId+'carId'+startAmount+'startAmount'+reserveAmount+'reserveAmount'+index)
        $.ajax({
            url:basePath+'/boss/localeAuction/setAgainAuction',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionCarId:auctionCarId,
                carId:carId,
                startAmount:startAmount*10000,
                reserveAmount:reserveAmount*10000
            }),
            error : function() {
                parent.layer.msg('请求失败，联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    parent.layer.msg('二拍成功');
                    parent.layer.close(index);
                    console.log(index)
                    init();
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }

    function setBid(lastAmount,auctionId,carId,customerId,auctionCarId,index) {
        console.log(lastAmount+'    '+auctionId+'   '+   carId+'   '+customerId+'   '+auctionCarId)
        $.ajax({
            url:basePath+'/boss/localeAuction/saveBiddenInfo',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionId:auctionId,
                carId:carId,
                customerId:customerId,
                lastAmount:lastAmount*10000,
                auctionCarId:auctionCarId
            }),
            error : function() {
                parent.layer.msg('请求失败，联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    if(data.data.count){
                        layer.msg('出价成功');
                        //layer.close(index);
                        init();
                    }else{
                        parent.layer.msg('出价失败');
                    }
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }
    function sequenceFn(sort,id,index) {
        $.ajax({
            url:basePath+'/boss/localeAuction/adjustAuctionCarSort',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionCarId:id,
                sort:sort
            }),
            error : function() {
                parent.layer.msg('请求失败，联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    if(data.data.count){
                        layer.msg('修改成功');
                        layer.close(index);
                        init();
                    }else{
                        parent.layer.msg('排序失败');
                    }
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }
    function sateDetail(data) {
        console.log(data)
        var reg=data.regionName?data.regionName:'全部'
        var box=$('.sate-detail');
        box.html('<tr data-id="'+data.id+'"> ' +
                '<td>参与竞拍车辆数：<b style="color:orange">'+data.carNum+'辆</b></td> ' +
                '<td>竞拍成功车辆：<b style="color:orange">'+data.successNum+'辆</b></td> ' +
                '<td>成交率：<b style="color:orange">'+data.successScale+'%</b></td> ' +
                '<td>竞拍状态：<b style="color:orange">'+(statusIs(data.status)).status+'</b></td> </tr> ' +
                '<tr><td>场次编号：'+data.code+'</td> ' +
                '<td colspan="3">场次主题：'+data.title+'</td> </tr> ' +
                '<tr>' +
                '<td>可见范围：'+reg+'</td> ' +
                '<td colspan="3">拍卖地址：'+data.address+'</td> </tr> ' +
                '<tr>' +
                '<td>看车联系人：'+data.seeCarMan+'</td> ' +
                '<td>联系电话：'+data.seeCarPhone+'</td> ' +
                '<td colspan="2">看车时间：'+data.seeCarTime+'</td> </tr>')
    }
    function carDetail(data) {
        console.log(data)
        var box=$('.carDetail').find('tbody');
        box.html('');
        var str=''
        if(data.length<1){
            layer.msg('该场次没有添加任何车辆,请返回上一级添加车辆');
            box.html('<tr><td colspan="12" style="text-align:center;height:200px">该场次没有添加任何车辆,请返回上一级添加车辆</td></tr>');
        }else{
            $.each(data,function(i,v){
                if(Isstatus(v.auctionStatus).status=='待开拍'){
                    str='<td><a href="javascript:;" class="layui-btn layui-btn-primary layui-btn-xs sequence">'+v.sort+'</a></td>';
                }else{
                    str='<td>'+v.sort+'</td>'
                }
                box.append(' <tr data-id="'+v.id+'" data-auctionId="'+v.auctionId+'" data-carId="'+v.carId+'"> ' +str+
                        //'<td><a href="javascript:;" class="carCode" >'+v.carAutoNo+'</a></td> ' +
                        '<td><a href="javascript:;" class="carCode" >'+v.auctionCode+'</a></td> ' +
                        '<td>'+v.autoInfoName+'('+v.carAutoNo+')</td> ' +
                        '<td>'+v.licenseNumber+'</td> ' +
                        '<td>'+carSource(v.sourceType)+'</td> ' +
                        '<td class="startingPrice">'+v.startingPrice/10000+'</td> ' +
                        '<td style="text-align: center;color: darkred;"><sqan class="hideMoney">*</sqan><sqan class="hideMoney">'+v.reservePrice/10000+'</sqan></td> ' +
                        '<td class="lastBid">'+v.lastBidPrice/10000+'</td> ' +
                        '<td>'+timeObj(v.beginRegisterDate).y+'-'+timeObj(v.beginRegisterDate).m+'-'+timeObj(v.beginRegisterDate).d+'</td> ' +
                        '<td>'+v.auctionNum+'</td> ' +
                        '<td>'+Isstatus(v.auctionStatus).status+'</td> ' +
                        '<td>'+ Isstatus(v.auctionStatus).btns+ '</td> ' +
                        '</tr>')
                $('.hideMoney:nth-child(2)').hide()
                $('.hideMoney:nth-child(1)').show()
            })
        }
    }
    $('.showMoney').click(function () {
        $('.hideMoney').toggle();
        if($('.hideMoney:nth-child(2)').css('display')=='none'){
            $('.showMoney span').html('保留价显示')
        }else{
            $('.showMoney span').html('保留价隐藏')
        }
    })

});