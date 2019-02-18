function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

$(document).ready(function(){
    id = decodeQuery()['id']

    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        paginationType: 'fraction'
    })
    $(".book-house").show();

//    $.get('/home/detail/'+id+'/',function(data){
//    })
    $.ajax({
        url:'/home/detail/'+id+'/',
        dataType:'json',
        type:'GET',
        success:function(data){
             if(data.code == '200'){
                li_tr = '<ul class="swiper-wrapper">'
                li_tr += '<li class="swiper-slide"><img src="/static/'+ data.data.image+ '"></li></ul>'
                li_tr += '<div class="swiper-pagination"></div>'
                li_tr += '<div class="house-price">￥<span>'+ data.data.price+'</span>/晚</div>'
//                li_tr += '<a class="book-house" href="/home/booking/'+data.data.id+'">即刻预定</a>'
                $('.swiper-container').append(li_tr)
                $('.book-house').attr('href','/home/booking/?id='+data.data.id)
                }
//               if(data.code == '200'){
//                    li-str = '<a class="book-house" href="/home/booking/'+data.data.id+'">即刻预定</a>'
//                    $('.book-house').append(li-str)
//               }
        },
        error: function(result){
            console.log(result)
        }

    })
})