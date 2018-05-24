layui.use(['table','laypage'], function(){
    var table = layui.table,
            $= layui.jquery,form = layui.form,laypage = layui.laypage;
    var beginTime,endTime;
    var laydate = layui.laydate;
    var limit=10,page=1;
    //第五种方法
    var idTmr;
    function  getExplorer() {
        var explorer = window.navigator.userAgent ;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
            return 'ie';
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
            return 'Firefox';
        }
        //Chrome
        else if(explorer.indexOf("Chrome") >= 0){
            return 'Chrome';
        }
        //Opera
        else if(explorer.indexOf("Opera") >= 0){
            return 'Opera';
        }
        //Safari
        else if(explorer.indexOf("Safari") >= 0){
            return 'Safari';
        }
    }
    function method5(tableid) {
        if(getExplorer()=='ie')
        {
            var curTbl = document.getElementById(tableid);
            var oXL = new ActiveXObject("Excel.Application");
            var oWB = oXL.Workbooks.Add();
            var xlsheet = oWB.Worksheets(1);
            var sel = document.body.createTextRange();
            sel.moveToElementText(curTbl);
            sel.select();
            sel.execCommand("Copy");
            xlsheet.Paste();
            oXL.Visible = true;

            try {
                var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
            } catch (e) {
                print("Nested catch caught " + e);
            } finally {
                oWB.SaveAs(fname);
                oWB.Close(savechanges = false);
                oXL.Quit();
                oXL = null;
                idTmr = window.setInterval("Cleanup();", 1);
            }

        }
        else
        {
            tableToExcel(tableid)
        }
    }
    function Cleanup() {
        window.clearInterval(idTmr);
        CollectGarbage();
    }
    var tableToExcel = (function() {
        var uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
                base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
                format = function(s, c) {
                    return s.replace(/{(\w+)}/g,
                            function(m, p) { return c[p]; }) }
        return function(table, name) {
            if (!table.nodeType) table = document.getElementById(table)
            var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
            window.location.href = uri + base64(format(template, ctx))
        }
    })()
    //导出的事件
    $('#outTable').click(function(){
        method5('carDetail')
    })

    laydate.render({
        elem: '#date',
        range: true
        ,ready: function(date){
            // console.log(date); //得到初始的日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
        }
        ,done: function(value, date, endDate){
            $('#date').css('width',200);
            var arrTime=value.split(' - ');
            beginTime=arrTime[0];
            endTime=arrTime[1]
        }
    });

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
                console.log(data);
                layer.msg('城市列表请求失败，请联系管理员');
            },
            success : function(data){
                console.log(data)
                if(data.success){
                    selectCityView(data.data)
                }
            }
        });
    }
    function selectCityView(data) {
        console.log(data)
        var box=$('#cityId');
        box.html('<option value="">开拍区域</option>');
        $.each(data,function(i,v){
            box.append('<option value="'+v.id+'">'+v.name+'</option>')
        })
//            表单渲染
        form.render()
    }

   /* function init() {
        selectCity();
        queryList()
    }
*/
    function init() {
        selectCity();
        //queryList()
        count(page,limit,null,null,null,null)
    }
    function count(page,limit,beginTime,endTime,title,cityId) {
        var data={
            beginTime:beginTime,
            endTime:endTime,
            page:page,
            title:title,
            cityId:cityId,
            limit:limit
        }
        function noFn(data) {
            layer.msg(data) ;
        }
        setAjax('/boss/localeAuction/hasAuctionCarList',data,countView,noFn)
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
                        queryList(beginTime,endTime,$('#tit').val(),$('#cityId').val(),obj.curr,limit)
                    }else{
                        if(data.success){
                            CarListView(data.data.list);
                        }else{
                            layer.msg(data.resultMsg);
                        }
                    }
                }
            });
        }
        else{
            layer.msg(data.resultMsg) ;
        }
    }


    function queryList(beginTime,endTime,title,cityId,page,limit){
        console.log(beginTime+''+endTime+''+title+''+cityId)
        beginTime=beginTime?beginTime:null;
        endTime=endTime?endTime:null;
        title=title?title:null;
        cityId=cityId?cityId:null;
        page=page?page:1;
        limit=limit?limit:10;
        $.ajax({
            url:basePath+'/boss/localeAuction/hasAuctionCarList',
            type:'post',
            beforeSend:beforeSend,
            async:false,
            dataType:'json',
            data:JSON.stringify({
                beginTime:beginTime,
                endTime:endTime,
                page:page,
                title:title,
                cityId:cityId,
                limit:limit
            }),
            error : function() {
                layer.msg('请求失败');
            },
            success : function(data){
                if(data.success){
                    CarListView(data.data.list);
                }else{
                    layer.msg(data.resultMsg);
                }
            }
        });
    }
    init();
    function CarListView(data) {
        console.log(data)
        var box=$('.carTable tbody')
        box.html('');
        if(data.length<1){
            layer.msg('没有参拍车辆，请核对查询信息');
            box.html('<tr><td colspan="14" style="text-align:center;height:200px">没有参拍车辆,请核对查询信息！</td></tr>');
        }else{
            $.each(data,function(i,v){
                var userNum=v.userNum?v.userNum:'暂无车商'
                box.append('<tr data-id="'+v.id+'" data-auctionId="'+v.auctionId+'">\n' +
                        '                          <td>'+timeFormat(v.startTime).slice(0,-3)+'</td>\n' +
                        '                          <td>'+v.carAutoNo+'</td>\n' +
                        '                          <td>'+v.autoInfoName+'</td>\n' +
                        '                          <td>'+v.licenseNumber+'</td>\n' +
                        '                          <td>'+v.storeName+'</td>\n' +
                        '                          <td>'+carSource(v.sourceType)+'</td>\n' +
                        '                          <td>'+v.startingPrice/10000+'</td>\n' +
                        '                          <td>'+v.reservePrice/10000+'</td>\n' +
                        '                          <td>'+v.topBidPrice/10000+'</td>\n' +
                        '                          <td>'+userNum+'</td>\n' +
                        '                          <td>'+Isstatus(v.auctionStatus).status+'</td>\n' +
                        '                          <td>'+v.publishUserName+'</td>\n' +
                        '                          <td>'+v.publishUserMobile+'</td>\n' +
                        '                       </tr>')
            })
        }
    }

    $('#search').click(function () {
        count(page,limit,beginTime,endTime,$('#tit').val(),$('#cityId').val())
        //queryList(beginTime,endTime,$('#tit').val(),$('#cityId').val())
    })
});