layui.use(['table','laypage'], function(){
    var table = layui.table,laypage = layui.laypage;
    var form = layui.form
    var $ = layui.$;
    var laydate = layui.laydate;
    var beginTime,endTime;
    var limit=5,page=1;
    $('#outModel').click(function () {
        var form=$('#formOut');
        var searchName=$('#searchName').val()?$('#searchName').val():null;
        var carSearchName=$('#carSearchName').val()?$('#carSearchName').val():null;
        var customerStoreId=$('#customerStoreId').val()?$('#customerStoreId').val():null;
        var carStoreId=$('#carStoreId').val()?$('#carStoreId').val():null;
        beginTime=beginTime?beginTime:null;
        endTime=endTime?endTime:null;
        $('input[name=searchName]').val(searchName)
        $('input[name=carSearchName]').val(carSearchName)
        $('input[name=customerStoreId]').val(customerStoreId)
        $('input[name=carStoreId]').val(carStoreId)
        $('input[name=beginTime]').val(beginTime)
        $('input[name=endTime]').val(endTime)
        console.log(searchName+'   '+carSearchName+' '+customerStoreId+'  '+carStoreId+''+beginTime+endTime)
        form.attr('action',basePath+'/boss/bid/exportBidRecordList')
        form.submit();
    })
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
    init()
    function init() {
        shop()
        count(page,limit,$('#searchName').val(),$('#carSearchName').val(),$('#customerStoreId').val(),$('#carStoreId').val(),2,beginTime,endTime)
    }
    function count(page,limit,searchName,carSearchName,customerStoreId,carStoreId,auctionType,beginTime,endTime) {
        var data={
            page:page?page:1,
            limit:limit?limit:10,
            searchName:searchName?searchName:null,
            carSearchName:carSearchName?carSearchName:null,
            customerStoreId:customerStoreId?customerStoreId:null,
            carStoreId:carStoreId?carStoreId:null,
            auctionType:auctionType?auctionType:null,
            beginTime:beginTime?beginTime:null,
            endTime:endTime?endTime:null
        }
        function noFn(data) {
            layer.msg(data) ;
        }
        setAjax('/boss/bid/getCarBidRecordList',data,countView,noFn)
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
                        queryList(obj.curr,limit,$('#searchName').val(),$('#carSearchName').val(),$('#customerStoreId').val(),$('#carStoreId').val(),2,beginTime,endTime)
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
    function queryList(page,limit,searchName,carSearchName,customerStoreId,carStoreId,auctionType,beginTime,endTime) {

        var data={
            page:page?page:1,
            limit:limit?limit:10,
            searchName:searchName?searchName:null,
            carSearchName:carSearchName?carSearchName:null,
            customerStoreId:customerStoreId?customerStoreId:null,
            carStoreId:carStoreId?carStoreId:null,
            auctionType:auctionType?2:2,
            beginTime:beginTime?beginTime:null,
            endTime:endTime?endTime:null
        }
        console.log(data)
        function noFn(data) {
            layer.msg(data) ;
        }
        setAjax('/boss/bid/getCarBidRecordList',data,tableView,noFn)
    }
    function tableView(data) {
        console.log(data.data.list);
        if(data.success){
            var myData=data.data;

            if(myData.list.length<1){
                layer.msg('没有出价记录,请核对查询信息！')
                $('table tbody').html('<tr><td colspan="12" style="text-align:center;height:200px">没有出价记录,请核对查询信息！</td></tr>')
            }else{
                $('table tbody').html('')
                $.each(myData.list,function(i,v){
                    $('table tbody').append(' <tr>\n' +
                            '                          <td>'+v.userCode+'</td>\n' +
                            '                          <td>'+v.userNum+'</td>\n' +
                            '                          <td>'+v.username+'</td>\n' +
                            '                          <td>'+v.mobile+'</td>\n' +
                            '                          <td>'+v.userStoreName+'</td>\n' +
                            '                          <td>'+v.carAutoNo+'</td>\n' +
                            '                          <td>'+v.autoInfoName+'</td>\n' +
                            '                          <td>'+v.carStoreName+'</td>\n' +
                            '                          <td>'+getType(v.auctionType)+'</td>\n' +
                            '                          <td>'+v.startingPrice/10000+'</td>\n' +
                            '                          <td>'+v.bidTime+'</td>\n' +
                            '                          <td>'+v.bidFee/10000+'</td>\n' +
                            '                      </tr>')
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
            $('#carStoreId').html('<option value="">车辆所属店铺</option>')
            $('#customerStoreId').html('<option value="">会员所属店铺</option>')
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
        switch (num){
            case 2:
                return '现场竞拍';
                break;
            case 1:
                return '线上竞拍';
                break;
            default:
                return '未知';
                break;
        }
    }
    $('#search').click(function(){
        count(page,limit,$('#searchName').val(),$('#carSearchName').val(),$('#customerStoreId').val(),$('#carStoreId').val(),2,beginTime,endTime)
    })
});