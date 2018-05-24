//JavaScript Document
/*
 * 服务名称：登录相关组件
 * author：zhaoyang
 */

		  function loginHelper(){
		  	 var result ;
		  	 var userName = $("#userName").val();
		  	 var passWord = $("#passWord").val();
		  	var data ={
		  		userKey:userName,
		  		userPassword:hex_md5(passWord)
		  	};
		  	$.ajax({
		  		type:"post",
		  		//url:"http://192.168.100.13:8081/boss/managerUser/userLogin",
		  		//url:"http://192.168.100.103:8081/boss/managerUser/userLogin",
		  		url:"http://111.202.186.103:8081/boss/managerUser/userLogin",
		  		async:false,
		  		beforeSend:function(xhr){
		  			 xhr.setRequestHeader("appId", "1234567_boss");
		  			 xhr.setRequestHeader("Content-Type", "application/json");
		  		},
	            dataType:"json",
		  		data:JSON.stringify(data),
		  		success:function(key){
		  			if(key.resultCode==100){
		  				Setcookie("token",JSON.stringify(key.data.id)+"_"+key.data.token);/*登陆表示 用于获取信息*/
		  				var username_text = JSON.stringify(key.data.userName);  
		  				var userphoto_text = JSON.stringify(key.data.userPhoto);     
		  				Setcookie("username",username_text.substring(1,username_text.length-1));
						if(key.data.userPhoto!=null||key.data.userPhoto!=""){
							Setcookie("userphoto",userphoto_text.substring(1,userphoto_text.length-1));
						}
		  				Setcookie("roleName",key.data.roleName);
		  				result ={
		  					code:"00",
		  					msg:"登陆成功"
		  				}
		  			}else{
		  				result ={
		  					code:"01",
		  					msg:"账号或者密码错误"
		  				};
		  			}
		  			
		  			
		  		},
		  		error:function(key){
		  		   /*登录失败的处理方式*/
		  		result ={
		  					code:"02",
		  					msg:"服务器连接失败"
		  				}
		  		}
		  	});
		  		return result;
		  };
	
		
