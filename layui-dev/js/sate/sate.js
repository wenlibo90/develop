/**
 * Created by tingguo on 2018/3/17.
 */
/**/
//基础配置
//var basePath='http://192.168.100.30:8081';
//var basePath='http://192.168.100.103:8081';
//var basePath='http://39.107.75.63';
var basePath='http://111.202.186.103:8081';
//var basePath='http://192.168.100.13:8081';
//时间戳转化
function add0(m){return m<10?'0'+m:m }
function timeFormat(needTime)
{
    //needTime是整数，否则要parseInt转换
    var time = new Date(needTime);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}
/*ajax封装*/
function setAjax(url,data,okFn,noFn){
    $.ajax({
        type:'post',
        url:basePath+url,
        data:JSON.stringify(data),
        beforeSend:function(xhr){
            xhr.setRequestHeader("appId", "1234567_boss");
            xhr.setRequestHeader("Content-Type", "application/json");
            if(getCookie('token')!=null||getCookie('token')!="")
                xhr.setRequestHeader("Authorization",getCookie('token'));
        },
        success:function(data){
            okFn(data)
        },
        error:function(data){
            noFn(data);
        }
    });
}
function closeNowIframe() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index)
}

function getUrlParam() {
    var arr=window.location.search.slice(1).split('&');
    var obj={};
    for(var i=0;i<arr.length;i++){
        var arr1=arr[i].split('=');
        obj[arr1[0]]=arr1[1];
    }
    return obj;
}
function statusIs(obj){
    obj=Number(obj);
    var myObj={};
    switch (obj){
        case 1:
            myObj.status='待上拍';
            myObj.btns=
                '<a href="javascript:;" class="layui-btn layui-btn-xs edit">编辑</a>' +
                '<a href="javascript:;" class="layui-btn layui-btn-xs addcar" >添加车辆</a>' +
                '<a href="javascript:;" class="layui-btn layui-btn-xs detail" >竞拍详情</a>' +
                '<a href="javascript:;" class="layui-btn layui-btn-warm layui-btn-xs arsis" >上拍</a>'+
                '<a href="javascript:;" class="layui-btn layui-btn-xs layui-btn-danger del" >删除</a>'
            return myObj;
            break;
        case 2:
            myObj.status='等待开拍';
            myObj.btns=
                '<a href="javascript:;" class="layui-btn layui-btn-xs addcar" >添加车辆</a>' +
                '<a href="javascript:;" class="layui-btn layui-btn-xs detail" >竞拍详情</a>' +
                '<a href="javascript:;" class="layui-btn layui-btn-normal layui-btn-xs downbeat" >下拍</a>'
            return myObj;
            break;
        case 3:
            myObj.status='正在竞拍';
            myObj.btns='<a href="javascript:;" class="layui-btn layui-btn-xs detail" >竞拍详情</a>';
            return myObj;
            break;
        case 4:
            myObj.status='<span style="color: #FF5722">竞拍结束</span>';
            myObj.btns='<a href="javascript:;" class="layui-btn layui-btn-xs detail" >竞拍详情</a>'
            return myObj;
            break;
        default:
            layer.msg('状态值错误，请联系管理员');
            break;
    }

}
//车辆来源
function carSource(num) {
    num=Number(num);
    switch (num){
        case 1:
            return '个人车辆';
            break;
        case 2:
            return '公务车';
            break;
        case 3:
            return '4S店置换';
            break;
        case 4:
            return '店铺车';
            break;
        case 5:
            return '试乘试驾车';
            break;
        default:
            return '未知状态';
            break;
    }
}
function timeObj(needTime)
{
    //needTime是整数，否则要parseInt转换
    var time = new Date(needTime);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return {
        y:y,
        m:add0(m),
        d:add0(d),
        h:add0(h),
        mm:add0(mm),
        s:add0(s)
    };
}
function Isstatus(num) {
    num=Number(num);
    var obj={};
    switch (num){
        case 0:
            obj.status='待开拍';
            obj.btns='<a href="javascript:;" class="layui-btn layui-btn-danger layui-btn-xs del" >删除</a>'
            break;
        case 1:
            obj.status= '拍卖中';
            obj.btns='<a href="javascript:;" class="layui-btn layui-btn-xs complete" >拍牌号补全</a> <a href="javascript:;" class="layui-btn layui-btn-xs bid" >填写出价</a> '
            break;
        case 2:
            obj.status= '已成交';
            obj.btns='<a href="javascript:;" class="layui-btn layui-btn-xs complete" >拍牌号补全</a>'
            break;
        case 3:
            obj.status= '流拍';
            obj.btns='<a href="javascript:;" class="layui-btn layui-btn-xs second" >二拍</a> <a href="javascript:;" class="layui-btn layui-btn-xs complete" >拍牌号补全</a>'
            break;
        case 4:
            obj.status= '已二拍';
            obj.btns='<a href="javascript:;" class="layui-btn layui-btn-danger layui-btn-xs" >不可操作</a>'
            break;
        default:
            obj.status= '未知状态';
            obj.btns='<a href="javascript:;" class="layui-btn layui-btn-danger layui-btn-xs" >不可操作</a>'
            break;
    }
    return obj;
}
function beforeSend(xhr){
    xhr.setRequestHeader("appId", "1234567_boss");
    xhr.setRequestHeader("Content-Type", "application/json");
    if(getCookie('token')!=null||getCookie('token')!="")
        xhr.setRequestHeader("Authorization",getCookie('token'));
}


