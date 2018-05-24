/*jquery ajax辅助库*/
var base_url = "http://111.202.186.103:8081";
//var base_url = "http://192.168.100.13:8081";
//var base_url = "http://192.168.100.103:8081";
var ck_time = 300 * 60 * 1000;

function sup_ajax(uri, data, single) {
	
	var result;
	$ = layui.jquery;

	/*参数获取并转换为String类型*/
	var connect_url = base_url + uri.toString(); /*连接url*/
	var connect_id = "1234567_boss"; /*appid*/
	var connect_type = "post"; /*连接方式   如 post get header delete */
	var connect_data = JSON.stringify(data);

	if(single) {
		connect_data = data;
	}

	/*调用第三方接口进行数据的获取*/
	$.ajax({
		type: connect_type,
		url: connect_url,
		data: connect_data,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("appId", connect_id);
			xhr.setRequestHeader("Content-Type", "application/json");
			if(getCookie('token') != null && getCookie('token') != "")
				xhr.setRequestHeader("Authorization", getCookie('token'));
		},
		dataType: "json",
		success: function(key) {
			/*在此处书写登录成功后的逻辑*/
			if(key.resultCode==210){
				//权限不够
				layer.msg(key.resultMsg);
			}else{
				result = key;
			}
			
		},
		error: function(key) {
			/*接口错误的处理方式*/
			layui.use('table', function(){
				var layer = layui.layer;
				layer.msg("服务接口存在问题，请稍后再试！");
			})
			
			return result;
		}
	});
	return result;
}
/*ajax多条件灵活调用*/
function ajax_sup(url, app_id, type, data, single) {
	var result;

	var connect_url = url.toString(); /*连接url*/
	var connect_id = "1234567_boss"; /*appid*/
	var connect_type = type.toString(); /*连接方式   如 post get header delete */
	var connect_data = JSON.stringify(data);

	if(single) {
		connect_data = data;
	}

	$.ajax({
		type: connect_type,
		url: connect_url,
		data: connect_data,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("appId", connect_id);
			xhr.setRequestHeader("Content-Type", "application/json");
			if(getCookie('token') != null || getCookie('token') != "")
				xhr.setRequestHeader("Authorization", getCookie('token'));

		},
		dataType: "json",
		success: function(key) {
			/*在此处书写登录成功后的逻辑*/
			result = key;
		},
		error: function(key) {
			/*登录失败的处理方式*/
			return result;
		}
	});
	return result;
}
/*url地址解析*/
function url_sup(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
/*时间戳格式转换*/
function add0(m) {
	return m < 10 ? '0' + m : m
}

function timeFormat(needTime) {
	//needTime是整数，否则要parseInt转换
	var time = new Date(needTime);
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm);
}
/*设置cookie*/
function Setcookie(name, value)

{
	name = escape(name);
	value = escape(value);
	//设置名称为name,值为value的Cookie
	var expdate = new Date(); //初始化时间
	expdate.setTime(expdate.getTime() + ck_time); //时间
	document.cookie = name + "=" + value + ";expires=" + expdate.toGMTString() + ";path=/";

	//即document.cookie= name+"="+value+";path=/";   时间可以不要，但路径(path)必须要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！~
}
/*获取指定cookie*/
function getCookie(c_name) {
	if(document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=")
		if(c_start != -1) {
			c_start = c_start + c_name.length + 1
			c_end = document.cookie.indexOf(";", c_start)
			if(c_end == -1) c_end = document.cookie.length
			return unescape(document.cookie.substring(c_start, c_end))
		}
	}
	return ""
}

/*检查是否含有指定cookie*/
function checkCookie() {
	username = getCookie('username')
	if(username != null && username != "") {
		alert('Welcome again ' + username + '!')
	} else {
		username = prompt('Please enter your name:', "")
		if(username != null && username != "") {
			setCookie('username', username, 365)
		}
	}
}
/*删除cookie*/
function delCookie(name) {
	var exp = new Date();  
    exp.setTime(exp.getTime() - 1000);  
    var cval=getCookie(name);  
    if(cval!=null)  
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();  
}
//删除cookie中所有定变量函数    
function delAllCookie() {
	var myDate = new Date();
	myDate.setTime(-1000); //设置时间    
	var data = document.cookie;
	var dataArray = data.split("; ");
	for(var i = 0; i < dataArray.length; i++) {
		var varName = dataArray[i].split("=");
		document.cookie = varName[0] + "=''; expires=" + myDate.toGMTString();
	}
}

	/*渲染函数*/
	function modif(pre_modify, aft_modify, mid_modify, modify_name, modify_type, val_in) { /*表格前后缀修饰*/
		var fix = "";
		switch(modify_type) {
			case "pre":
				/*前缀*/
				fix += 'pre_modify' + "." + modify_name;

				if(eval(fix) != null) {
					var temp_fix = fix + ".value";
					if(eval(temp_fix) != null) {
						temp_fix = fix + ".way";
						if(eval(temp_fix) != null) {
							switch(eval(temp_fix)) {
								case "normal":
									temp = fix + ".value";
									return(eval(temp));
									break;
							}
						}
					}
				}
				break;
			case "aft":
				/*后缀*/
				fix += 'aft_modify' + "." + modify_name;
				if(eval(fix) != null) {
					var temp_fix = fix + ".value";
					if(eval(temp_fix) != null) {
						temp_fix = fix + ".way";
						if(eval(temp_fix) != null) {
							switch(eval(temp_fix)) {
								case "normal":
									temp = fix + ".value";
									return(eval(temp));
									break;
							}
						}
					}
				}
				break;
			case "middle":
				/*中间值*/
				fix += 'mid_modify' + "." + modify_name;

				if(eval(fix) != null) {
					var temp_fix = fix + ".value";
					if(eval(temp_fix) != null) {
						temp_fix = fix + ".way";
						if(eval(temp_fix) != null) {
							switch(eval(temp_fix)) {
								case "normal":
									temp = fix + ".value";
									return(eval(temp));
									break;
								case "replace":
									var num = parseInt(val_in);
									temp = fix + ".value";
									return(eval(temp + "[num-1]"));
									break;
								case "split_prefix":
									temp = fix + ".value";
									var temp_sp = eval(temp + ".sp"); /*临时分隔符*/
									var temp_pr = eval(temp + ".pr");
									var temp_str = val_in.replace(temp_sp, temp_pr + temp_sp);
									return(temp_str + temp_pr);
									break;
								case "const_st":
									temp = fix + ".value";
									switch(eval(temp)) {
										case "timestamp":
											return timeFormat(val_in);
											break;
									}
							}
						}
					}
				}
				return val_in;
				break;
		}
		return "";
	}

	/*ajax上传文件*/
	function up_ajax(url) {
		var formData = new FormData();
		var name = "okokokokok";
		formData.append("file", $("#upload").files);
		formData.append("name", name);
		$.ajax({
			url: url,
			type: 'POST',
			data: formData,
			// 告诉jQuery不要去处理发送的数据
			processData: false,
			// 告诉jQuery不要去设置Content-Type请求头
			contentType: false,
			beforeSend: function() {
				console.log("正在进行，请稍候");
			},
			success: function(responseStr) {
				alert(JSON.stringify(responseStr));
				if(responseStr.status === 0) {
					console.log("成功" + responseStr);
				} else {
					console.log("失败");
				}
			},
			error: function(responseStr) {
				console.log("error");
			}
		});
	}
	
	function is_legal(){
		if(getCookie('token')==null||getCookie('token')==""){
			layer.msg('未登录，请重新登录！',{time:1500,shade:0.8},function(){
				window.location.href="login.html";
			});
		}
	}
	
	function check_str(str_obj,str_type){
		switch(str_type){
			case 'result':
				if(str_obj==null||str_obj==""||str_obj.resultCode!=100){
					return false;
				}
				return true;
				break;
			case 'str':
				if(str_obj==null||str_obj==""){
					return false;
				}
				return true;
				break;
		}
	}
