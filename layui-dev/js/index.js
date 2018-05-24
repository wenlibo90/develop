var tab;

layui.config({
    base: 'js/',
    version: new Date().getTime()
}).use(['element', 'layer', 'navbar', 'tab'], function () {
    var element = layui.element(),
        $ = layui.jquery,
        layer = layui.layer,
        navbar = layui.navbar();
    tab = layui.tab({
        elem: '.admin-nav-card', //设置选项卡容器
        /*maxSetting: {
        	max: 5,
        	tipMsg: '只能开5个哇，不能再开了。真的。'
        },*/
        contextMenu: true,
        onSwitch: function (data) {
        },
        closeBefore: function (obj) { //tab 关闭之前触发的事件
            //obj.title  -- 标题 obj.url    -- 链接地址 obj.id  obj.tabId  -- lay-id
            if (obj.title === 'BTable') {
                layer.confirm('确定要关闭' + obj.title + '吗?', { icon: 3, title: '系统提示' }, function (index) {
                    //因为confirm是非阻塞的，所以这里关闭当前tab需要调用一下deleteTab方法
                    tab.deleteTab(obj.tabId);
                    layer.close(index);
                });
                //返回true会直接关闭当前tab
                return false;
            }else if(obj.title==='表单'){
                layer.confirm('未保存的数据可能会丢失哦，确定要关闭吗?', { icon: 3, title: '系统提示' }, function (index) {
                    tab.deleteTab(obj.tabId);
                    layer.close(index);
                });
                return false;
            }
            return true;
        }
    });
	
    //iframe自适应
    $(window).on('resize', function () {
        var $content = $('.admin-nav-card .layui-tab-content');
        $content.height($(this).height() - 103);
        $content.find('iframe').each(function () {
            $(this).height($content.height());
        });
    }).resize();

    //设置navbar
    navbar.set({
        spreadOne: true,
        elem: '#admin-navbar-side',
        cached: true,
        data: navs
    });
    //渲染navbar
    navbar.render();
    //监听点击事件
    navbar.on('click(side)', function (data) {
        tab.tabAdd(data.field);
    });
	
    //清除缓存
    $('#clearCached').on('click', function () {
        navbar.cleanCached();
        layer.alert('清除完成!', { icon: 1, title: '系统提示' }, function () {
            location.reload();//刷新
        });
    });
	
	//问题反馈
	$('#feedBack').on('click', function () {
        layer.open({
			title: '问题反馈二维码',
			type: 1,
			content: '<img src="images/0.jpg" />',
			
			shadeClose: true
		});
    });
	
	//设置
    $('#setting').on('click', function () {
        tab.tabAdd({
            href: '/setting.html',
            icon: 'fa-gear',
            title: '设置'
        });
    });
	
	//修改密码
	$('#changePassword').on('click', function(){
		var con ='<div class="layui-field-box" style="padding:30px 40px 0 0">' +
		'<p lay-verify="required" class="layui-form-item"><span class="layui-form-label">旧密码</span><span class="layui-input-inline"><input class="layui-input" type="password" id="old_ps"></span></p>'+
					  '<p lay-verify="required" class="layui-form-item"><span class="layui-form-label">重置密码</span><span class="layui-input-inline"><input class="layui-input" type="password" id="ps1"></span></p>' +
					  '<p lay-verify="required" class="layui-form-item"><span class="layui-form-label">再次确认</span><span class="layui-input-inline"><input class="layui-input" type="password" id="ps2"></span></p>' +
				'</div>';
		layer.open({
			title: '修改密码',
			type: 1,
			shade: 0.6,
			content: con,
			btn: ['提交', '取消'],
			yes:function(index){
					var old_ps = $("#old_ps").val();
					var ps = $("#ps1").val();	
					if(ps!=$("#ps2").val()){
						layer.msg("新密码输入不一致");
						return;
					}
					var uri_ps = '/boss/managerUser/updateUserPassword';
					var data_ps = {
						"oldPassword":hex_md5(old_ps),
						"newPassword":hex_md5(ps)
					};
					
				var result_ps = sup_ajax(uri_ps,data_ps,false);
				if(result_ps==null||result_ps==""||result_ps.resultCode!=100){
					layer.msg("修改失败");
					return;
				}
				layer.msg("密码修改成功");
				layer.close(index);
			}
		});
	});

    
});

function init(){
	
	/*头像用户名 */
	var user_info = $("#user_info");
	var html;
	if(getCookie("userphoto")!=null&&getCookie("userphoto")!=""){
		html='<img src="'+getCookie("userphoto")+'" id="img_user"/>';
	}else{
		html='<img src="images/0.jpg" id="img_user"/>';
	}
	html+='<span style="margin-left:5px" id="name_user">' + getCookie("username") + ' | '+getCookie("roleName")+'</span>';
	user_info.html(html);
	/*Authorization*/
	is_legal();
	
	//退出登录
	$('#logout').on('click',function(){
		var uri_logout = '/boss/managerUser/logout';
		sup_ajax(uri_logout,{},true);
		//清除token 跳转登录
		Setcookie("token","");
		window.location.href = "login.html";
	});

}
