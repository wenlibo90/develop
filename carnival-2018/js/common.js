var load=$('.loadBox');
var base={
    //path:'http://172.16.107.47:8080',
    appIdArr:["wx017397a5a78e210a","wxe4d40c4f7c1cc642", "wx73a6b0cd4e18583d", "wx4281be3d95bcf378", "wxaf424323472e4f17", "wx9e46235e9f68570b", "wx08b8f737fe2d1d6e", "wx25a2c792508fcf03", "wxc85d76e10935b756", "wx228e8bb30039ca29", "wx4b6f87aee17940ea", "wx8aabb67352be0285", "wx61802b87feaadf86", "wxfd83aab5df9d5072", "wx01d8a4dcbe19d30a", "wx79a9bcf7ba8ad6a1", "wx0c133041c8e6225a", "wx76b0702d5311b9fe", "wx1d3a42d3a46f3ff6", "wxad930b7d460dba4d", "wx4f3373e75fd4c2f2", "wx211aa119bd4c7674", "wx41583bdd1d4c0182", "wxe3acb9a4822b796e", "wx2575457b40f240b5", "wxbe378bba45be67bb", "wx5df73cdeba858e8f", "wx2a0be4164f321f6e", "wx4f5752b36758e10b", "wx979843a2ac91b627", "wx1bbbb1692fcf9ee8", "wx1a737e13c8cc9f0e", "wx4715195028e145fc", "wx5113e99b2029b2b9", "wx90a428146e3f985e", "wxc0bbedec1975e953", "wxc306c949f04eda8b", "wxca3d334834fde21c", "wx536b0593a0571e3f", "wxfff28e028bb53b89", "wx4473949c80deb86b", "wx56155b194db0ead1", "wxb19d367be22ac40e", "wx4639c95a9eea606d", "wx93920208beaaf6d5", "wxc1373a32bc8be3b3", "wx8be265c7ebd45a77", "wx2eafd82666110208", "wx71c63353f20ddc74", "wx325671e9cf22d55f", "wxfe0beaf154896b9f", "wx6bca2ead9d859df2", "wxfec5d6e59c267eab", "wx5e7d8a38f4ec914c", "wxc7a75b0d2f4abe04", "wxb0ce484a7ff9810d", "wxf12613315b07750c", "wx8159f7794b0153e7", "wx2d74cfdfc3eb30ff", "wxb88ea046b8a3abd0", "wx14809e3559fd74e7"],
    path:'http://test.yuntongauto.com',
    //    ajax 封装
    /*
    * ajax  请求调用说明
    * @param type  类型 post/get/delete require
    * @param url   地址 '/boss/byid'  require
    * @param data  参数 {key:value}  require
    * @param beforeFn 请求之前的回调 function(xhr){}
    * @param okFn  请求成功的回调   require
    * @param noFn  请求失败的回调   require
    * */
    setAjax:function (url,data,okFn,beforeFn){
        $.ajax({
            type:'get',
            url:base.path+url,
            dataType:'jsonp',
            data:data,
            jsonpCallback:'callback',
            beforeSend:function(xhr){
                if(beforeFn || beforeFn != null){
                    beforeFn(xhr)
                }
            },
            success:function(data){
                if(okFn || okFn != null){
                    if(data.code == '0'){
                        $('.popLoginBox').show();
                    }else{
                        okFn(data)
                    }
                }
            },
            error:function(){
                $('.msg').html('服务器异常').fadeIn(100).delay(1500).hide()
            }
        });
    },
    cookie:{
        //获取cookie
        getCookie:function (objName) {
            var arr = document.cookie.match(new RegExp("(^| )"+objName+"=([^;]*)(;|$)"));
            if(arr != null) {return unescape(arr[2]); }
            return null;
        },
        //添加cookie
        /*
        * setCookie  请求调用说明
        * @param objName  名  require
        * @param objValue   值   require
        * @param objHours  时间（天）
        * */
        setCookie:function (objName,objValue,objHours){
            var str = objName + "=" + escape(objValue);
            if(!objHours || objHours == null || objHours < 0){ objHours =7;}
            var date = new Date();
            date.setTime(date.getTime() + objHours*24*60*60*1000);
            document.cookie = objName + "="+ escape (objValue) + ";expires=" + date.toGMTString();
        },
        //删除cookie
        delCookie:function (objName) {
            var date = new Date();
            date.setTime(date.getTime() - 1);
            var cval=base.cookie.getCookie(objName);
            if(cval!=null) {
                document.cookie= objName + "="+cval+";expires="+date.toGMTString();
                return true
            }else{
                return false
            }
        },
        //删除根目录cookie
        delCookieByPath:function (objName) {
            var cval=base.cookie.getCookie(objName);
            var objHours=-1;
            if(cval!=null) {
                var str = objName + "=" + escape('');
                var date = new Date();
                date.setTime(date.getTime() + objHours*24*60*60*1000);
                document.cookie = str + ";path=/;expires=" + date.toGMTString();
                return true
            }else{
                return false
            }
        }
    },

    timeEnd:function(timerid,needTime)
    {
        function add0(m){return m<10?'0'+m:m }
        var leftTime = (new Date(needTime)) - new Date(); //计算剩余的毫秒数
        var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
        var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
        var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
        days = add0(days);
        hours = add0(hours);
        minutes = add0(minutes);
        seconds = add0(seconds);
       console.log(days + "天" + hours + "小时" + minutes + "分" + seconds + "秒")
        if (days >= 0 || hours >= 0 || minutes >= 0 || seconds >= 0) return {
            days:days, hours :hours,minutes:minutes,seconds:seconds
        };
        if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
            window.clearInterval(timerid);
            timerid = null;
        }
    }
}
var loginObj={
    loginUrl:base.path+'/carnival/carnivalLogin',
    //用户手机号
    userPhone:null,
    //验证码
    uCode:null,
    //用户姓名
    uName:null,
    loginCallback:function(data){
        console.log(data)
        load.hide()
        if(data.code==200){
            base.cookie.setCookie('token',data.token);
            base.cookie.setCookie('userId',data.customerId)
            console.log(base.cookie.getCookie('token'))
            if(base.cookie.getCookie('token')){
                $(".msg").html('登录成功').show().delay(2000).hide()
                window.location.reload();
            }
        }else{
            $(".msg").html(data.msg).stop().slideDown().delay(2000).slideUp()
        }
    },
    isLogin:function(){
        if(base.cookie.getCookie('token')){
            return true;
        }else{
            $('.popLoginBox').show();
            return false;
        }
    },
    //将手机利用ajax提交到后台的发短信接口
    sendMsg:function (url,data) {
        console.log(url,data)
        var that=this;
        $.ajax({
            url:url,
            type:'get',
            dataType:'jsonp',
            jsonpCallback:'callback',
            xhrFields: {
                withCredentials: true
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
    loginCheck:function(carnivalProductId){
        if(this.checkPhone()){
            if(this.uCode){
                if(this.uName){
                    var serviceNetWorkId=2981510004500480;
                    if(sessionStorage.getItem('appId') == 'wxe4d40c4f7c1cc642'){
                        console.log(111)
                        serviceNetWorkId=$('.shopListBtn select').val()
                    }
                    this.loginFn(this.loginUrl,{
                        customerNumber:this.uCode,
                        chinaeseName:this.uName,
                        customerPhone:this.userPhone,
                        appId:sessionStorage.getItem('appId'),
                        serviceNetWorkId:serviceNetWorkId,
                        carnivalProductId:carnivalProductId
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
        console.log(MsgParam)
        $.ajax({
            url:url,
            type:'get',
            dataType:'jsonp',
            jsonpCallback:'callback',
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
                    $('.popLoginBox').hide();
                    that.loginCallback(data.result)
                }else{
                    $(".msg").html(data.message).stop().slideDown().delay(2000).slideUp();
                }
            }
        });
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

function setMsg() {
    //调用短信发送接口
    var uCall=$('#uCall').val();
    var uName=$('#uName').val().trim()
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
                loginObj.sendMsg(base.path+'/earnestLogin/get_validate_code',{
                    telPhone:uCall
                })
            },1200)
        }else{
            $('.msg').html('验证码正在发送中').fadeIn(100).delay(1500).fadeOut()
        }
    }
}
//验证码
$('.yzm').click(function () {
    setMsg();
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
    var productId=sessionStorage.getItem('productId')?sessionStorage.getItem('productId'):null
    loginObj.loginCheck(productId);
})

$('.close').click(function () {
    $(this).parents('.pop').hide()
})
