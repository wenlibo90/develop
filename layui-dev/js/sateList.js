layui.use(['table','layer'], function(){
    var table = layui.table, $= layui.jquery,layer = layui.layer,laydate = layui.laydate;
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
        }
    });

    //现场车商报到

    var adduser_html='<div class="layui-form" style="padding:32px 0 0 23px">' +
            '<div class="layui-form-item">' +
            '<label class="layui-form-label">车商姓名：</label>' +
            '<div class="layui-input-inline"><input placeholder="请输入车商姓名" class="layui-input" type="text" id="uName"></div>' +
            '<div class="layui-form-mid layui-word-aux">不超过8个字</div>' +
            '</div>' +
            '<div class="layui-form-item">' +
            '<label class="layui-form-label">手机号：</label>' +
            '<div class="layui-input-inline"><input placeholder="请输入车商联系电话" class="layui-input" type="text" maxlength="11" id="phone"></div>' +
            '</div>' +
            '<div class="layui-form-item">' +
            '<label class="layui-form-label">拍牌号：</label>' +
            '<div class="layui-input-inline"><input placeholder="请输入拍牌号" class="layui-input" type="text"  maxlength="5" id="code"></div>' +
            '</div>' +
            '<div class="layui-form-item">' +
            '<label class="layui-form-label">保证金：</label>' +
            '<div class="layui-input-inline"><input placeholder="请输入保证金金额" class="layui-input" type="text" maxlength="11" id="money"></div>' +
            '<div class="layui-form-mid layui-word-aux">单位：元</div>' +
            '</div>' +
            '</div>'

    $("#sale-adduser").on('click', function(){
        parent.layer.open({
            title: '现场车商报到',
            type: 1,
            btn: ['保存', '取消'],
            area: ['465px', '346px'],
            content: adduser_html,
            yes: function(index, layero){
                var flag;
                //非空判断
                for(var i=0;i<layero.find('input').length;i++){
                    flag=isNull(layero,layero.find('.layui-form-item').eq(i).find('input').attr('id'))
                    if(!flag){
                        return null;
                    }
                }
                if(!(/^1[3,4,5,6,7,8,9]\d{9}$/.test(layero.find('#phone').val()))){
                    parent.layer.msg('请输入正确的手机号');
                    return null;
                }
                var money=layero.find('#money').val();
                var ival = parseInt(money);//如果变量val是字符类型的数则转换为int类型 如果不是则ival为NaN
                if(isNaN(ival)){
                    parent.layer.msg('保证金金额只输入数字');
                    return null;
                }
                addUser(layero.find('#code').val(),layero.find('#uName').val(),layero.find('#phone').val(),layero.find('#money').val(),index)
            }
        });
    });
    function addUser(auctionPlateNum,name,mobile,depositAmount,index) {
        $.ajax({
            url:basePath+'/boss/user/simpleSaveUser',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                auctionPlateNum:auctionPlateNum,
                name:name,
                mobile:mobile,
                depositAmount:depositAmount
            }),
            error : function() {
                parent.layer.msg('请求失败');
                parent.layer.close(index)
            },
            success : function(data){
                if(data.success){
                    parent.layer.msg('添加成功');
                    parent.layer.close(index)
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }



    function isNull(layero,objName){
        var key=layero.find('#'+objName).val();
        console.log(key)
        if(key=='' || !key || key==null){
            switch (objName){
                case  'uName':
                    parent.layer.msg('车商姓名不能为空');
                    break;
                case  'code' :
                    parent.layer.msg('拍牌号不能为空');
                    break;
                case  'phone':
                    parent.layer.msg('手机号不能为空');
                    break;
                case  'money':
                    parent.layer.msg('保证金不能为空');
                    break;
            }
            return false;
        }else{
            return true;
        }
    }

//        新增按钮事件
    $("#sale-addlist").on('click', function(){
        layer.full(layer.open({
            title: '新增拍卖场次',
            type: 2,
            shade: 0,//不显示遮罩
            content: 'sale-addlist.html'
        }));
    });
    //场次列表查询
    function queryList(endTimestatus,title,beginTime,endTime,page,limit){
        endTimestatus=endTimestatus?endTimestatus:'';
        title=title?title:'';
        beginTime=beginTime?beginTime:'';
        endTime=endTime?endTime:'';
        page=page?page:1;
        limit=limit?limit:15;
        console.log('状态'+endTimestatus+'场次名称'+title+'开始时间'+beginTime+'结束时间'+endTime+'页数'+page+'limit'+limit);
        $.ajax({
            url:basePath+'/boss/localeAuction/getLocaleAuctionList',
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

                    if(data.data.list.length<1){
                        layer.msg('目前没有该条件的场次信息，请添加');
                        var box=$('#sate tbody');
                        box.html('');
                        box.append('<tr><td colspan="9" style="text-align:center;height:200px">没有场次信息！</td></tr>')
                    }else{
                        tableView(data.data.list);
                    }
                }else{
                    layer.msg(data.resultMsg);
                }
            }
        });
    }
//     表格渲染
    function tableView(data) {
        var box=$('#sate tbody');
        box.html('');

        $.each(data,function(i,v){
            var obj=statusIs(v.status)
            box.append('<tr data-id="'+v.id+'" data-code="'+v.code+'">' +
                    '<td>'+v.code+'</td> ' +
                    '<td>'+v.title+'</td> ' +
                    '<td>'+v.address+'</td> ' +
                    '<td>'+timeFormat(v.startTime).slice(0,-3)+'</td> ' +
                    '<td>联系人:'+v.seeCarMan+'<br/>联系电话:'+v.seeCarPhone+'</td> ' +
                    '<td>'+v.carNum+'(辆)</td> ' +
                    '<td>'+obj.status+'</td> ' +
                    '<td>创建人：'+v.createPersonName+'<br/>时间：'+timeFormat(v.createTime).slice(0,-3)+'</td> ' +
                    '<td>' + obj.btns + '</td> ' + '</tr>')
        })
    }
//操作
    $('#sate').on("click","a", function(obj){
        var sateId,sateCode;
        sateCode=$(this).parents('tr').attr('data-code');
        sateId=$(this).parents('tr').attr('data-id');
        if($(this).hasClass('edit')){
            layer.full(layer.open({
                title: '编辑场次信息',
                type: 2,
                shade: 0,//不显示遮罩
                content: 'sale-addlist.html?sateCode='+sateCode+'&sateId='+sateId
            }));
        }else if($(this).hasClass('arsis')){
            parent.layer.confirm('上拍后该场次信息，以及该场次下的车辆信息将展示在APP界面，是否上拍？',{btn: ['确定', '取消']}, function(index){
                arsis(sateId)
                parent.layer.close(index);
            },function(index){
                parent.layer.close(index);
            });
        }else if($(this).hasClass('detail')){
            layer.full(layer.open({
                title: '竞拍详情',
                type: 2,
                shade: 0,//不显示遮罩
                content: 'sale-detail.html?sateId='+sateId
            }));
        }else if($(this).hasClass('addcar')){
            layer.full(layer.open({
                title: '添加车辆',
                type: 2,
                shade: 0,
                content: 'sale-addcar.html?sateId='+sateId
            }));
        }else if($(this).hasClass('downbeat')){
            parent.layer.confirm('下拍后该场次信息，以及该场次下的车辆信息将无法在在APP界面显示，是否下拍？',{btn: ['确定', '取消']},function(index){
                downbeat(sateId)
                parent.layer.close(index);
            },function(index){
                parent.layer.close(index);
            });
        }else if($(this).hasClass('del')){
            parent.layer.confirm('删除后该场次信息，以及该场次下的车辆信息将销毁，是否删除？',{btn: ['确定', '取消']},function(index){
                del(sateId)
                parent.layer.close(index);
            },function(index){
                parent.layer.close(index);
            });
        }
    });
    function del(sateId) {
        $.ajax({
            url:basePath+'/boss/localeAuction/deleteLocaleAuction',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                id:sateId
            }),
            error : function() {
                layer.msg('请求失败');
            },
            success : function(data){
                if(data.success){
                    layer.msg('删除成功');
                    init();
                }else{
                    layer.msg(data.resultMsg);
                }
            }
        });
    }
//        查询按钮
    $('#search').click(function(){
        queryList($('.stutas').val(),$('.theme').val(),beginTime,endTime)
    })
//        上拍
    function arsis(sateId) {
        $.ajax({
            url:basePath+'/boss/localeAuction/setUpAuction',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                id:sateId
            }),
            error : function() {
                layer.msg('请求失败');
            },
            success : function(data){
                if(data.success){
                    layer.msg('上拍成功');
                    init();
                }else{
                    layer.msg(data.resultMsg);
                }
            }
        });
    }
//        下拍
    function downbeat(sateId) {
        $.ajax({
            url:basePath+'/boss/localeAuction/setDownAuction',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                id:sateId
            }),
            error : function() {
                layer.msg('请求失败');
            },
            success : function(data){
                if(data.success){
                    layer.msg('下拍成功');
                    init();
                }else{
                    layer.msg(data.resultMsg);
                }
            }
        });
    }
//初始化
    function init(){
//	    初始化表格
        queryList();
    }
    init();
});