
//var basePath='http://192.168.100.13:8081'
var basePath='http://39.107.75.63'
function getUrlParam() {
    var arr=window.location.search.slice(1).split('&');
    var obj={};
    for(var i=0;i<arr.length;i++){
        var arr1=arr[i].split('=')
        obj[arr1[0]]=arr1[1];
    }
    return obj;
}
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
    return {y:y, m:add0(m), d:add0(d), h:add0(h), mm:add0(mm), s:add0(s)}
}
//判断是否在微信
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
$('.download').click(function(){
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        if(is_weixin()){
            $('.load').show()
        }else{
            $('.load').hide();
            window.open('http://static.yuntongauto.com/web/llemon/liemon_buyer_V1.0.apk')
        }
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        window.open('https://itunes.apple.com/cn/app/%E6%9F%A0%E6%AA%AC%E7%AB%9E%E4%BB%B7-%E8%AE%A9%E4%BA%8C%E6%89%8B%E8%BD%A6%E4%B9%B0%E5%8D%96%E6%9B%B4%E8%BD%BB%E6%9D%BE/id1370802527?mt=8')
    }
});
function beforeSend(xhr) {
    //xhr.setRequestHeader("appId", "1234567_boss");
    xhr.setRequestHeader("appId", "bdce67a4230d20f2a14e72a2670cbd42");
    xhr.setRequestHeader("Content-Type", "application/json");
}
$('.loadBtm').click(function () {
    $('.load').hide();
})