//var basePath='http://test.yuntongauto.com';
var basePath='http://yth.yuntongauto.com';
//var basePath='http://192.168.22.143:8089';
var load=$('.loadBox');
function noFn() {
    $('.msg').html('服务器异常').fadeIn(100).delay(1500).hide()
}
var appArr=["wx017397a5a78e210a","wxe4d40c4f7c1cc642", "wx73a6b0cd4e18583d", "wx4281be3d95bcf378", "wxaf424323472e4f17", "wx9e46235e9f68570b", "wx08b8f737fe2d1d6e", "wx25a2c792508fcf03", "wxc85d76e10935b756", "wx228e8bb30039ca29", "wx4b6f87aee17940ea", "wx8aabb67352be0285", "wx61802b87feaadf86", "wxfd83aab5df9d5072", "wx01d8a4dcbe19d30a", "wx79a9bcf7ba8ad6a1", "wx0c133041c8e6225a", "wx76b0702d5311b9fe", "wx1d3a42d3a46f3ff6", "wxad930b7d460dba4d", "wx4f3373e75fd4c2f2", "wx211aa119bd4c7674", "wx41583bdd1d4c0182", "wxe3acb9a4822b796e", "wx2575457b40f240b5", "wxbe378bba45be67bb", "wx5df73cdeba858e8f", "wx2a0be4164f321f6e", "wx4f5752b36758e10b", "wx979843a2ac91b627", "wx1bbbb1692fcf9ee8", "wx1a737e13c8cc9f0e", "wx4715195028e145fc", "wx5113e99b2029b2b9", "wx90a428146e3f985e", "wxc0bbedec1975e953", "wxc306c949f04eda8b", "wxca3d334834fde21c", "wx536b0593a0571e3f", "wxfff28e028bb53b89", "wx4473949c80deb86b", "wx56155b194db0ead1", "wxb19d367be22ac40e", "wx4639c95a9eea606d", "wx93920208beaaf6d5", "wxc1373a32bc8be3b3", "wx8be265c7ebd45a77", "wx2eafd82666110208", "wx71c63353f20ddc74", "wx325671e9cf22d55f", "wxfe0beaf154896b9f", "wx6bca2ead9d859df2", "wxfec5d6e59c267eab", "wx5e7d8a38f4ec914c", "wxc7a75b0d2f4abe04", "wxb0ce484a7ff9810d", "wxf12613315b07750c", "wx8159f7794b0153e7", "wx2d74cfdfc3eb30ff", "wxb88ea046b8a3abd0", "wx14809e3559fd74e7"]
function setAjax(url,data,okFn){
    $.ajax({
        type:'post',
        url:basePath+url,
        data:data,
        xhrFields: {
            withCredentials: true
        },
        beforeSend:function (xhr) {
            load.show()
        },
        complete:function () {
            load.hide()
        },
        success:function(data){
            okFn(data)
        },
        error:function(data){
            noFn(data);
        }
    });
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
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}
//登录
//验证码
$('.yzm').click(function () {
    setMsg();
})
//关闭
$('.close').click(function () {
    $(this).parents('.loginBox').hide()
})
//竞猜记录
$('.record').click(function () {
    if(loginObj.isLogin()){
        window.location.href='groupRecord.html'
    }
})
//登录
var loginBtn=$('.loginBtn');

loginBtn.click(function () {
    var uName=$('#uName').val()
    var uCall=$('#uCall').val()
    var uCode=$('#uCode').val()
    loginObj.userPhone=uCall;
    loginObj.uName=uName;
    loginObj.uCode=uCode;
    loginObj.loginCheck();
})
var loginObj={
    loginUrl:basePath+'/GuessMan/guessManLogin',
    //用户手机号
    userPhone:null,
    //验证码
    uCode:null,
    //用户姓名
    uName:null,
    loginCallback:function(data){
        if(data.code==0){
            cookie.setCookie('token',data.data);
            cookie.setCookie('userId',data.userId)
            if(cookie.getCookie('token')){
                $(".msg").html('登录成功').show().delay(2000).hide()
            }
        }else{
            $(".msg").html(data.msg).stop().slideDown().delay(2000).slideUp()
        }
    },
    isLogin:function(){
        if(cookie.getCookie('token')){
            return true;
        }else{
            $('.loginBox').show();
            return false;
        }
    },
    //将手机利用ajax提交到后台的发短信接口
    sendMsg:function (url,data) {
        console.log(url,data)
        var that=this;
        $.ajax({
            url:url,
            type:'post',
            xhrFields: {
                   withCredentials: true
               },
              /* crossDomain: true,*/
            beforeSend:function () {
                //load.show()
            },
            complete:function () {
                //load.hide()
            },
            data:data,
            error : function() {// 请求失败处理函数
                load.hide()
                $(".msg").html('服务器走丢了').stop().slideDown().delay(2000).slideUp();
            },
            success : function (data) {
                load.hide()
                if(data.success){
                    //cookie.setCookie('JSESSIONID',data.result)  不需要写进cookie
                }else{
                    $(".msg").html(data.message).stop().slideDown().delay(2000).slideUp();
                }
            }
        });
    },
//        手机号验证
    checkPhone:function(){
        var userPhone = this.userPhone;
        console.log(this.userPhone)
        var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(16[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(userPhone==null||userPhone==""){
            $(".msg").html('请输入手机号!').stop().slideDown().delay(2000).slideUp();
            return false;
        }
        if(!myreg.test(userPhone)){
            $(".msg").html('请输入有效的手机号!').stop().slideDown().delay(2000).slideUp();
            return false;
        }
        return true;
    },
    /*登陆*/
    loginCheck:function(){
        if(this.checkPhone()){
            if(this.uCode){
                if(this.uName){
                    this.loginFn(this.loginUrl,{
                        customerNumber:this.uCode,
                        petName:this.uName,
                        telPhone:this.userPhone
                    })
                }else{
                    $(".msg").html('请输入姓名!').stop().slideDown().delay(2000).slideUp();
                }
            }else{
                $(".msg").html('请输入验证码!').stop().slideDown().delay(2000).slideUp();
            }
        }
    },
    loginFn:function(url,MsgParam){
        var that=this;
        $.ajax({
            url:url,
            type:'post',
            dataType:'json',
            xhrFields: {
                  withCredentials: true
            },
              //crossDomain: true,
            data:MsgParam,
            beforeSend:function(XHR){
                load.show()
            },
            complete:function () {
                load.hide()
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {// 请求失败处理函数
                console.log(XMLHttpRequest+' XMLHttpRequest  '+textStatus+'textStatus   '+errorThrown+'  ');
                $(".msg").html('服务器走丢了').stop().slideDown().delay(2000).slideUp();
            },
            success : function (data) {
                if(data.success){
                    //$(".msg").html('登录成功').stop().slideDown().delay(1500).slideUp();

                    $('.loginBox').hide();
                    that.loginCallback(data.result)
                }else{
                    $(".msg").html(data.message).stop().slideDown().delay(2000).slideUp();
                }
            }
        });
    }
}


function setMsg() {
    //调用短信发送接口
    var uCall=$('#uCall').val();
    var uName=$('#uName').val()
    var uCode=$('#uCode').val()
    loginObj.userPhone=uCall;
    loginObj.uName=uName;
    loginObj.uCode=uCode;
    if(loginObj.checkPhone()){
        var time=60;
        time=Number(time)
        var yzm=$('.yzm');
        if(yzm.html()=='获取验证码'){

            var a=setInterval(function () {
                time--;
                yzm.html(time+'s后重发')
                if(time <= 0){
                    yzm.html('获取验证码')
                    clearInterval(a)
                }
            },1000);
           setTimeout(function () {
               loginObj.sendMsg(basePath+'/GuessMan/get_validate_code',{
                   telPhone:uCall
               })
           },1200)
        }else{
            $('.msg').html('验证码正在发送中').fadeIn(100).delay(1500).fadeOut()
        }
    }
}
//获取地址栏参数
function getUrlParam() {
    var arr=window.location.search.slice(1).split('&');
    var obj={};
    for(var i=0;i<arr.length;i++){
        var arr1=arr[i].split('=');
        obj[arr1[0]]=arr1[1];
    }
    return obj;
}


if (/Android/gi.test(navigator.userAgent)) {
    window.addEventListener('resize', function () {

        if (document.activeElement.id == 'uCode') {
            window.setTimeout(function () {
                document.activeElement.scrollIntoViewIfNeeded();
            }, 0);
        }
    })
}

