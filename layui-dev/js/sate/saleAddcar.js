layui.use(['table','form','upload','layer'], function(){
    var form = layui.form,laydate = layui.laydate, $= layui.jquery,upload = layui.upload;
    var layer = layui.layer;
    form.render();
    $('.all').click(function () {
        $(this).toggleClass('on')
        if($(this).hasClass('on')){
            $('table input[type=checkbox]').attr('checked',true)
            $('table .layui-form-checkbox').addClass('layui-form-checked')
        }else{
            $('table input[type=checkbox]').attr('checked',false)
            $('table .layui-form-checkbox').removeClass('layui-form-checked')
        }
        //form.render();
    })
    function queryList(searchParam){
        searchParam?searchParam:null;
        console.log(searchParam)
        $.ajax({
            url:basePath+'/boss/localeAuction/getLocaleAuctionCar',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                searchParam:searchParam
            }),
            error : function() {
                parent.layer.msg('请求失败');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    carListView(data.data)

                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }
    function carListView(data) {
        $('.carList tbody').html('');
        if(data.length<1){
            parent.layer.msg('没有该数据，请核对查询信息！');
            $('.carList tbody').html('<tr>\n' +
                    '                    <td colspan="10" style="text-align:center;height:200px">没有参拍车辆，请添加</td>\n' +
                    '                    </tr>')
        }
        $.each(data,function(i,v){
            $('.carList tbody').append('<tr data-id="'+v.id+'"> ' +
                    '<td><input lay-skin="primary" type="checkbox" value="'+v.id+'"></td> ' +
                    '<td>'+v.carAutoNo+'</td> ' +
                    '<td>'+v.autoInfoName+'</td> ' +
                    '<td>'+v.startingPrice+'</td> ' +
                    '<td>'+v.reservePrice+'</td> ' +
                    '<td>'+timeFormat(+v.beginRegisterDate)+'</td> ' +
                    '<td>'+ carSource(v.sourceType)+'</td> ' +
                    '<td>'+v.auctionNum+'</td> ' +
                    '<td>'+v.publishUserName+'</td> ' +
                    '<td>'+getType(Number(v.auctionType))+'</td> ' +
                    '</tr>')
        })
        form.render();
        //车辆来源：1个人车源，2公务车，3 4S店置换，4店铺车，5试乘试驾车
    }

    function getType(num) {
        switch (num){
            case 2:
                return '现场竞拍';
                break;
            case 1:
                return '线上竞拍';
                break;
            default:
                return '未知';
                break;
        }
    }

    function init() {
        queryList();
    }
    init();

    $('.cancel').click(function(){
        closeNowIframe();
    })
    $('.save').click(function(){
        console.log(getUrlParam().sateId)
        addCar(getUrlParam().sateId,getResid('carList'));
    })

    function getResid(id) {
        var eles=$('#'+id).find('.layui-form-checked').prev();
        var str='';
        for(var i=0;i<eles.length;i++){
            str+=eles.eq(i).val()+','
        }
        return str.slice(0,-1);
    }


    $('.search').click(function () {
        queryList($('#searchParam').val())
    })
    function addCar(auctionId,carIds) {
        console.log(carIds)
        var url=basePath+'/boss/localeAuction/saveLocaleAuctionCar';
        $.ajax({
            url:url,
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionId:auctionId,
                carIds:carIds
            }),
            error : function() {
                parent.layer.msg('请求失败');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    if(data.data.count){
                        closeNowIframe();
                        parent.location.href="sale-list.html";
                    }
                }else{
                    parent.layer.msg(data.resultMsg);
                }

            }
        });
    }
});