function hrefBack() {
    history.go(-1);
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

function showErrorMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    id = decodeQuery()['id']
    $.ajax({
        url:'/home/booking/'+id+'/',
        dataType:'json',
        type:'GET',
        success:function(data){
            if(data.code == '200'){
            li_tr = '<img src="/static/'+data.data.image+'">'
            li_tr += '<div class="house-text">'
            li_tr += '<h3>'+data.data.title+'</h3>'
            li_tr += '<p>￥<span>'+data.data.price+'</span>/晚</p></div>'
            $('.house-info').append(li_tr)
            }
        }

    })
    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    $(".input-daterange").on("changeDate", function(){
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();

        if (startDate && endDate && startDate > endDate) {
            showErrorMsg();
        } else {
            var sd = new Date(startDate);
            var ed = new Date(endDate);
            days = (ed - sd)/(1000*3600*24) + 1;
            var price = $(".house-text>p>span").html();
            var amount = days * parseFloat(price);
            $(".order-amount>span").html(amount.toFixed(2) + "(共"+ days +"晚)");
        }
    });
    $('.submit-btn').click(function(){
        var begin_date = $('#start-data').val()
        var end_data = $('#end-data').val()
        data = {'begin_date':begin_date,'end_data':end_data}
        $.post('/home/booking_info/',data,function(data){
                location.href = '/order/orders/'
        });
    });

})
