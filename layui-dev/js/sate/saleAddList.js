layui.use(['table','form','upload'], function(){
    var form = layui.form,laydate = layui.laydate, $= layui.jquery,upload = layui.upload;
    form.render();
    laydate.render({
        elem: '#startTime',
        type: 'datetime'
    });
    $('.cancel').click(function(){
        closeNowIframe()
    })
//	  公共  新增 修改都可以用的
    //图片上传
    var uploadInst = upload.render({
        elem: '#poster' //绑定元素
        ,url: basePath+'/boss/localeAuction/uploadImage'//上传接口
        ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致
            layer.load(); //上传loading
        }
        ,done: function(res){
            //上传完毕回调
            if(res.success){
                layer.closeAll('loading'); //关闭loading
                $('.layui-upload .myimg').attr('src',res.data.url)
                $('#posterImg').val(res.data.url)
            }
        }
        ,error: function(res){
            //请求异常回调
            layer.closeAll('loading'); //关闭loading
        }
    });
    //自定义验证规则
    form.verify({
        title: function(value){
            if(value.length < 5){
                return '场次主题至少5个字符';
            }
            if(value.length>20){
                return '场次主题至多20个字符';
            }
        },
        phone:function (value) {
            if(!(/^1[3,4,5,6,7,8,9]\d{9}$/.test(value))){
                return '请输入正确的手机号';
            }
        }
    });
    form.on('submit(*)', function(data){
        queryList(getVal('sateId'),getVal('title'),getResid('selectGroup'),getVal('cityId'),getVal('posterImg'),getVal('startTime'),getVal('corporateAgent'),getVal('address'),getVal('seeCarMan'),getVal('seeCarPhone'),getVal('seeCarTime'))
        return false; //阻止表单跳转。
    });
    //场次更新 和 新增
    function queryList(code,title,regionId,cityId,poster,startTime,corporateAgent,address,seeCarMan,seeCarPhone,seeCarTime){
        regionId=regionId?regionId:null;
        if(regionId!=null){
            if(regionId.indexOf('all')>-1){
                regionId=null;
//                全部情况下 传过去null
            }
        }
        seeCarTime=seeCarTime?seeCarTime:'随时可看车';

        var url;
        var data={};
        if(getUrlParam().sateId){
            url=basePath+'/boss/localeAuction/updateLocaleAuction';
            data={
                id:getUrlParam().sateId,
                //code:code,//场次编号
                title:title,//场次主题
                regionId:regionId,//可见范围，客户组id
                cityId:cityId,//场次所在城市
                poster:poster,//封面图片
                startTime:startTime,//开拍时间
                corporateAgent:corporateAgent,//代办公司
                address:address,//拍卖地址
                seeCarMan:seeCarMan,//看车联系人
                seeCarPhone:seeCarPhone,//看车联系电话 seeCarPhone
                seeCarTime:seeCarTime//看车时间
            }
        }else{
            url=basePath+'/boss/localeAuction/saveLocaleAuction';
            data={
                //code:code,//场次编号
                title:title,//场次主题
                regionId:regionId,//可见范围，客户组id
                cityId:cityId,//场次所在城市
                poster:poster,//封面图片
                startTime:startTime,//开拍时间
                corporateAgent:corporateAgent,//代办公司
                address:address,//拍卖地址
                seeCarMan:seeCarMan,//看车联系人
                seeCarPhone:seeCarPhone,//看车联系电话 seeCarPhone
                seeCarTime:seeCarTime//看车时间
            }
        }
        console.log('场次编号'+code+'场次主题'+title+'可见范围'+regionId+'场次所在城市'+cityId+
                '封面图片'+poster+'开拍时间'+startTime+'代办公司'+corporateAgent+'看车联系电话'+seeCarPhone+
                '拍卖地址'+address+'看车联系人'+seeCarMan+'看车时间'+seeCarTime);
        $.ajax({
            url:url,
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify(data),
            error : function() {
                parent.layer.msg('请求失败');
            },
            success : function(data){
                if(data.success){
                    closeNowIframe();
                    parent.location.href="sale-list.html";
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }
// 得到对应id的Input的val
    function getVal(id){
        return $('#'+id).val()
    }
//自定义获取复选框选中结果 以字符串形式拼接
    function getResid(id) {
        var eles=$('#'+id).find('.layui-form-checked').prev();
        var str='';
        for(var i=0;i<eles.length;i++){
            str+=eles.eq(i).val()+','
        }
        return str.slice(0,-1);

    }

//        代办公司列表
    function selectAgentCompany() {
        $.ajax({
            url:basePath+'/boss/agentCompany/selectAllAgentCompany',
            type:'post',
            beforeSend:beforeSend,
            dataType:'json',
            error : function() {
                parent.layer.msg('代办公司列表请求失败，请联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    console.log('代办公司列表'+data)
                    selectAgentView(data.data)
                }

            }
        });
    }
//        会员分组
    function selectGroup() {
        $.ajax({
            url:basePath+'/boss/localeAuction/getCustomerGroupList',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            error : function(data) {
                parent.layer.msg('会员分组列表请求失败，请联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    selectGroupView(data.data)
                }
            }
        });
    }
//        获取城市
    function selectCity() {
        $.ajax({
            url:basePath+'/boss/localeAuction/getCity',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({}),
            error : function(data) {
                console.log(data)
                parent.layer.msg('城市列表请求失败，请联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    selectCityView(data.data)
                }
            }
        });
    }
//        view层渲染
    function selectCityView(data) {
        var box=$('#cityId');
        box.html('');
        $.each(data,function(i,v){
            box.append('<option value="'+v.id+'">'+v.name+'</option>')
        })
        form.render()
    }
    function selectGroupView(data) {
        var box=$('#selectGroup');
        box.html('<input title="全部" type="checkbox" value="all" lay-filter="selectGroup" name="regionId">');
        $.each(data,function(i,v){
            box.append('<input title="'+v.groupName+'" type="checkbox" value="'+v.id+'" lay-filter="selectGroup" name="regionId">')
        })
        form.render()
    }
    //监听复选框
    form.on('checkbox(selectGroup)', function(data){
        if(data.value=='all'){
            if(data.elem.checked){
                $('#selectGroup .layui-form-checkbox').addClass('layui-form-checked')
            }else{
                $('#selectGroup .layui-form-checkbox').removeClass('layui-form-checked')
            }
        }
    });
    function selectAgentView(data) {
        var box=$('#corporateAgent');
        box.html('');
        $.each(data,function(i,v){
            box.append('<option value="'+v.id+'">'+v.name+'</option>')
        })
//            表单渲染
        form.render()
    }
//新增场次 生成场次编号
    function setCode() {
        $.ajax({
            type:'post',
            beforeSend:beforeSend,
            url:basePath+'/boss/localeAuction/getLocaleAuctionSessionNo',
            data:JSON.stringify({}),
            success:function(data){
                if(data.success){
                    $('#sateId').val(data.data.sessionNo).parent().css('width',220)
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            },
            error:function(data){
                parent.layer.msg('请求失败');
            }
        })
    }
    function getSateData(myid) {
        $.ajax({
            url:basePath+'/boss/localeAuction/getLocaleAuctionById',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                id:myid
            }),
            error : function() {
                parent.layer.msg('请求失败');
            },
            success : function(data){
                if(data.success){
                    setSateView(data.data)
                }else{
                    parent.layer.msg(data.resultMsg);
                }
            }
        });
    }
//将本来信息带入 用于修改更新场次信息
    function setSateView(data) {
        setVal('sateId',data.code)
        setVal('title',data.title)
        getRegionId(data.regionId)
        getCity(data.cityId)
        setVal('posterImg',data.poster)
        $('.myimg').attr('src',data.poster)
        setVal('startTime',timeFormat(data.startTime))
        getCorAgent(data.corporateAgent)
        setVal('address',data.address)
        setVal('seeCarMan',data.seeCarMan)
        setVal('seeCarPhone',data.seeCarPhone)
        setVal('seeCarTime',data.seeCarTime);
    }
    function getCity(data){
        var box=$('#cityId option');
        for(var j=0;j<box.length;j++){
            if(box.eq(j).val() == data){
                box.eq(j).attr('selected','selected')
            }
        }
        form.render()
    }
    function getRegionId(str) {
        var box=$('#selectGroup input');
        if(str == null){
            box.eq(0).attr('checked','checked')
        }else{
            var arr=str.split(',');
            for(var j=0;j<box.length;j++){
                $.each(arr,function(i,v){
                    if(box.eq(j).val()==v){
                        box.eq(j).attr('checked','checked')
                    }
                })
            }
        }
        form.render();
    }
    function getCorAgent(myid) {
        var box=$('#corporateAgent option');
        for(var j=0;j<box.length;j++){
            if(box.eq(j).val()==myid){
                box.eq(j).attr('selected','selected')
            }
        }
        form.render()
    }
    // 得到对应id的Input的val
    function setVal(id,cont){
        $('#'+id).val(cont)
    }
    function init() {
        selectAgentCompany();
        selectGroup();
        selectCity();
        if(getUrlParam().sateId){
//                更新
            getSateData(getUrlParam().sateId)
        }else{
//                新增
            setCode()
        }
    }
    init();
});