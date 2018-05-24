layui.use(['table','layer'], function(){
    var table = layui.table;
    var laydate = layui.laydate,
            $= layui.jquery;
    var layer = layui.layer;
    var beginTime,endTime;
//        日期范围获取
    laydate.render({
        elem: '#date',
        range: true
        ,ready: function(date){
            // console.log(date); //得到初始的日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
        }
        ,done: function(value, date, endDate){
            $('#date').css('width',200)
            var arrTime=value.split(' - ');
            beginTime=arrTime[0]
            endTime=arrTime[1]
            console.log(arrTime)
        }
    });
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        return y+"-"+m+"-"+d;
    }
    //场次列表查询
    function queryList(endTimestatus,title,beginTime,endTime,page,limit){
        endTimestatus=endTimestatus?endTimestatus:'';
        title=title?title:'';
        beginTime=beginTime?beginTime:timeFormat(Date.parse(new Date())).slice(0,-9);
        endTime=endTime?endTime:GetDateStr(1) ;
        page=page?page:1;
        limit=limit?limit:10;
        console.log(endTime+'结束时间')
        console.log('状态'+endTimestatus+'场次名称'+title+'开始时间'+beginTime+'结束时间'+endTime+'页数'+page+'limit'+limit);
        $.ajax({
            url:basePath+'/boss/localeAuction/largeScreenDisplay',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                status:endTimestatus,
                title:title,
                beginTime:beginTime,
                endTime:endTime,
                page:page,
                limit:limit
            }),
            error : function() {
                layer.msg('请求失败');
            },
            success : function(data){
                if(data.success){
                    sateListView(data.data.list,beginTime,endTime);
                }else{
                    layer.msg(data.resultMsg);
                }
            }
        });
    }
    function sateListView(data,beginTime,endTime) {
        var box=$('.sateTable tbody');
        box.html('');
        if(data.length<1){
            box.append('<tr><td colspan="7" style="text-align:center;height:200px">当前没有大屏场次信息！</td></tr>')
        }else{
            //status状态：1待上拍，2等待开拍，3正在竞拍，4竞拍结束
            $.each(data,function(i,v){
                var str='';
                switch (Number(v.status)){
                    case 2:
                        str='<td>' +
                                '<a href="scene.html?sateId='+v.id+'&sateCode='+v.code+'" target="_blank" class="layui-btn layui-btn-sm">大屏显示</a>' +
                                '<a href="javascript:void(0)" data-id="'+v.id+'" class="layui-btn layui-btn-normal layui-btn-sm clearBtn">清除缓存</a>' +
                                '</td>'
                        break;
                    case 3:
                        str='<td>' +
                                '<a href="scene.html?sateId='+v.id+'&sateCode='+v.code+'" target="_blank" class="layui-btn layui-btn-sm">大屏显示</a>' +
                                '<a href="javascript:void(0)" data-id="'+v.id+'" class="layui-btn layui-btn-normal layui-btn-sm clearBtn">清除缓存</a>' +
                                '</td>'
                        break;
                    default:
                        str ='';
                        break;
                }
                box.append('<tr> ' +
                        '<td>'+v.code+'</td> ' +
                        '<td>'+v.title+'</td> ' +
                        '<td>'+v.address+'</td>' +
                        ' <td>'+v.seeCarMan+'</td> ' +
                        '<td>'+v.seeCarPhone+'</td>' +
                        '<td>'+timeFormat(v.startTime).slice(0,-3)+'</td>' +str+
                        //'<td><a href="scene.html?sateId='+v.id+'&sateCode='+v.code+'&status='+v.status+'" target="_blank" class="layui-btn layui-btn-sm">大屏显示</a></td> ' +
                        '</tr>')
            })

            $('.clearBtn').click(function () {
                clearCarInfo($(this).attr('data-id'))
            })
        }
    }
    function clearCarInfo(sateid) {
        $.ajax({
            url:basePath+'/boss/localeAuction/clearLargeScreenAuctionCar',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionId:sateid
            }),
            error : function() {
                layer.msg('请求失败');
            },
            success : function(data){
                if(data.success){
                    if(data.data.count==1){
                        layer.msg('车辆缓存已清除');
                    }else{
                        layer.msg(data.resultMsg);
                    }
                }else{
                    layer.msg(data.resultMsg);
                }
            }
        });
    }
    $('#search').click(function(){
        queryList($('.status').val(),$('.theme').val(),beginTime,endTime)
        console.log($('.status').val()+$('.theme').val()+beginTime+endTime)
    })
    function init() {
        queryList()
    }
    init();
});