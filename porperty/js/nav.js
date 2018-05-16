/**
 * Created by GT on 2018/3/1.
 */
$('.nav .index').hover(function(){
    $(this).find('.hide-box').show()
},function(){
    $(this).find('.hide-box').hide()
})
/*$('.nav li').click(function(){
 $(this).addClass('on').siblings().removeClass('on')
 })*/

/*首页
 关于晟邦
 发展印记
 新闻栏目
 诚聘英才
 联系我们*/
function init(){
    var link=['index','about','delop','new','recruit','contact']
    var keyword;
    for(var i=0;i<=link.length-1;i++){
        keyword=window.location.href.lastIndexOf(link[i])
        if(keyword>=0){
            change(i)
            return null
        }
    }
}

function change(key){
    $('.nav>li').eq(key).addClass('on').siblings().removeClass('on')
}


//首页隐藏div的hover切换
$('.itemlist li').hover(function(){
    $(this).addClass('on').siblings().removeClass('on');
    var index=$(this).index();
    var data=[{
        'imgSrc':'wy1.jpg',
        'area':'1.1',
        'barea':'8.8',
        'detail':'林肯公园位于北京市顺义区赵全营镇中心西部创业天乘产业基地内，北临北高路，西侧和南侧天承环路。'
    },{
        'imgSrc':'wy1.jpg',
        'area':'3.3',
        'barea':'8.8',
        'detail':'林肯公寓位于北京市顺义区赵全营镇中心西部创业天乘产业基地内，北临北高路，西侧和南侧天承环路。'
    },{
        'imgSrc':'wy1.jpg',
        'area':'3.3',
        'barea':'8.8',
        'detail':'君安国际位于北京市顺义区赵全营镇中心西部创业天乘产业基地内，北临北高路，西侧和南侧天承环路。'
    },{
        'imgSrc':'wy1.jpg',
        'area':'3.3',
        'barea':'8.8',
        'detail':'君悦国际位于北京市顺义区赵全营镇中心西部创业天乘产业基地内，北临北高路，西侧和南侧天承环路。'
    },{
        'imgSrc':'wy1.jpg',
        'area':'3.3',
        'barea':'8.8',
        'detail':'星悦国际位于北京市顺义区赵全营镇中心西部创业天乘产业基地内，北临北高路，西侧和南侧天承环路。'
    },{
        'imgSrc':'wy1.jpg',
        'area':'3.3',
        'barea':'8.8',
        'detail':'尚峯国际位于北京市顺义区赵全营镇中心西部创业天乘产业基地内，北临北高路，西侧和南侧天承环路。'
    },{
        'imgSrc':'wy1.jpg',
        'area':'3.3',
        'barea':'8.8',
        'detail':'宾士国际北临北高路，西侧和南侧天承环路。'
    }]
    $('.hidebox .txt').html('<img src="img/'+data[index].imgSrc+'" alt=""/> ' +
    '<p style="margin-top: 5px;">占地面积：'+data[index].area+'万平方米</p> ' +
    '<p>建筑面积：'+data[index].barea+'万平方米</p> ' +
    '<div class="t-detail">'+data[index].detail+'</div>')
})

init()