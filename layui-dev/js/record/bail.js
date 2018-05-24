layui.use(['table','laypage'], function(){
    var table = layui.table,laypage = layui.laypage;
    var form = layui.form
    var $ = layui.$;
    var laydate = layui.laydate;
    var beginTime,endTime;
    var limit=10,page=1;
//        日期范围获取
    laydate.render({
        elem: '#date',
        range: true
        ,ready: function(date){}
        ,done: function(value, date, endDate){
            $('#date').css('width',200)
            var arrTime=value.split(' - ');
            beginTime=arrTime[0]
            endTime=arrTime[1]
        }
    });
    laydate.render({
        elem: '#date1',
        range: true
        ,ready: function(date){}
        ,done: function(value, date, endDate){
            $('#date1').css('width',200)
            var arrTime=value.split(' - ');
            beginTime=arrTime[0]
            endTime=arrTime[1]
        }
    });
    $('.layui-tab-title li').click(function () {
        if($(this).index()=='1'){
            console.log('冻结')
            count1(page,limit,$('.frozen .searchName').val(),$('.frozen .shop').val(),beginTime,endTime)
        }else{
            count(page,limit,$('.pay .searchName').val(),$('.pay .shop').val(),beginTime,endTime)
        }
    })
    init();
    function init() {
        shop();
        count(page,limit,$('.pay .searchName').val(),$('.pay .shop').val(),beginTime,endTime)
    }
    function count(page,limit,searchName,customerStoreId,beginTime,endTime) {
        var data={
            page:page?page:1,
            limit:limit?limit:10,
            searchName:searchName?searchName:null,
            customerStoreId:customerStoreId?customerStoreId:null,
            beginTime:beginTime?beginTime:null,
            endTime:endTime?endTime:null
        }
        function noFn(data) {
            layer.msg(data) ;
        }
        setAjax('/boss/deposit/getDepositDetailList',data,countView,noFn)
    }
    function count1(page,limit,searchName,customerStoreId,beginTime,endTime) {
        var data={
            page:page?page:1,
            limit:limit?limit:10,
            searchName:searchName?searchName:null,
            customerStoreId:customerStoreId?customerStoreId:null,
            beginTime:beginTime?beginTime:null,
            endTime:endTime?endTime:null
        }
        function noFn(data) {
            layer.msg(data) ;
        }
        setAjax('/boss/deposit/getDepositFreezeList',data,countView1,noFn)
    }
    function countView1(data) {
        if(data.success){
            var myData=data.data;
            var mycount= myData.count;
            laypage.render({
                elem: 'page1' //注意，这里的 test1 是 ID，不用加 # 号
                ,count: mycount //数据总数，从服务端得到
                ,limit:limit
                ,jump: function(obj, first){
                    if(!first){
                        queryList1(page,limit,$('.frozen .searchName').val(),$('.frozen .shop').val(),beginTime,endTime)
                    }else{
                        tableView1(data)
                    }
                }
            });
        }
        else{
            layer.msg(data.resultMsg) ;
        }
    }
    function countView(data) {
        if(data.success){
            var myData=data.data;
            var mycount= myData.count;
            laypage.render({
                elem: 'page' //注意，这里的 test1 是 ID，不用加 # 号
                ,count: mycount //数据总数，从服务端得到
                ,limit:limit
                ,jump: function(obj, first){
                    //obj包含了当前分页的所有参数，比如：
                    console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    console.log(obj.limit); //得到每页显示的条数
                    if(!first){
                        queryList(obj.curr,limit,$('.pay .searchName').val(),$('.pay .shop').val(),beginTime,endTime)
                    }else{
                        tableView(data)
                    }
                }
            });
        }
        else{
            layer.msg(data.resultMsg) ;
        }
    }
    //
    function queryList(page,limit,searchName,customerStoreId,beginTime,endTime) {
        var data={
            page:page?page:1,
            limit:limit?limit:10,
            searchName:searchName?searchName:null,
            customerStoreId:customerStoreId?customerStoreId:null,
            beginTime:beginTime?beginTime:null,
            endTime:endTime?endTime:null
        }
        console.log(data+'缴纳')
        function noFn(data) {
            layer.msg(data) ;
        }
        setAjax('/boss/deposit/getDepositDetailList',data,tableView,noFn)
    }
    function tableView(data) {
        console.log(data);
        if(data.success){
            var myData=data.data;
            if(myData.list.length<1){
                layer.msg('没有缴纳明细,请核对查询信息！')
                $('.pay table tbody').html('<tr><td colspan="9" style="text-align:center;height:200px">没有缴纳明细,请核对查询信息！</td></tr>')
            }else{
                $('.pay table tbody').html('');
                $.each(myData.list,function(i,v){
                    $('.pay table tbody').append(' <tr>\n' +
                            '                            <td>'+v.userCode+'</td>\n' +
                            '                            <td>'+v.userNum+'</td>\n' +
                            '                            <td>'+v.username+'</td>\n' +
                            '                            <td>'+v.mobile+'</td>\n' +
                            '                            <td>'+v.customerStoreName+'</td>\n' +
                            '                            <td>'+v.payTime+'</td>\n' +
                            '                            <td>'+getType(v.payType)+'</td>\n' +
                            '                            <td>'+v.logNo+'</td>\n' +
                            '                            <td>'+v.payFee+'</td>\n' +
                            '                        </tr>')
                })
            }
        }
        else{
            layer.msg(data.resultMsg) ;
        }
    }

    function queryList1(page,limit,searchName,customerStoreId,beginTime,endTime) {
        var data={
            page:page?page:1,
            limit:limit?limit:10,
            searchName:searchName?searchName:null,
            customerStoreId:customerStoreId?customerStoreId:null,
            beginTime:beginTime?beginTime:null,
            endTime:endTime?endTime:null
        }
        console.log(data+'冻结')
        function noFn(data) {
            layer.msg(data) ;
        }
        setAjax('/boss/deposit/getDepositFreezeList',data,tableView1,noFn)
    }
    function tableView1(data) {
        console.log(data);
        if(data.success){
            var myData=data.data;
            if(myData.list.length<1){
                layer.msg('没有冻结明细,请核对查询信息！')
                $('.frozen table tbody').html('<tr><td colspan="8" style="text-align:center;height:200px">没有冻结明细,请核对查询信息！</td></tr>')
            }else{
                //执行一个laypage实例
                laypage.render({
                    elem: 'page1' //注意，这里的 test1 是 ID，不用加 # 号
                    ,count: myData.count //数据总数，从服务端得到
                });
                $('.frozen table tbody').html('');
                $.each(myData.list,function(i,v){
                    $('.frozen table tbody').append(' <tr>\n' +
                            '                            <td>'+v.userCode+'</td>\n' +
                            '                            <td>'+v.userNum+'</td>\n' +
                            '                            <td>'+v.username+'</td>\n' +
                            '                            <td>'+v.mobile+'</td>\n' +
                            '                            <td>'+v.customerStoreName+'</td>\n' +
                            '                            <td>'+v.freezeTime+'</td>\n' +
                            '                            <td>'+v.remark+'</td>\n' +
                            '                            <td>'+v.depositAmount+'</td>\n' +
                            '                        </tr>')
                })
            }
        }
        else{
            layer.msg(data.resultMsg) ;
        }
    }

    function shopView(data) {
        var shop=$('.shop');
        if(data.data.length<1){
            layer.msg('店铺列表为空！')
        }else{
            shop.html('<option value="">会员所属店铺</option>')
            $.each(data.data,function(i,v){
                shop.append('<option value="'+v.id+'">'+v.name+'</option>')
            })
            form.render();
        }
    }
    function shop() {
        var data={};
        function noFn1(data) {
            layer.msg('店铺列表获取失败，请联系管理员！')
        }
        setAjax('/boss/carStore/selectAllStore',data,shopView,noFn1)
    }

    function getType(num) {
        num=Number(num);
        //1支付方式  现金，2银行卡，3支付宝，4微信，5其他
        switch (num){
            case 1:
                return '现金';
                break;
            case 2:
                return '银行卡';
                break;
            case 3:
                return '支付宝';
                break;
            case 4:
                return '微信';
                break;
            default:
                return '其他';
                break;
        }
    }

    $('#search').click(function(){
        count(page,limit,$('.pay .searchName').val(),$('.pay .shop').val(),beginTime,endTime)
    })
    $('#search1').click(function(){
        count1(page,limit,$('.frozen .searchName').val(),$('.frozen .shop').val(),beginTime,endTime)
    })
});