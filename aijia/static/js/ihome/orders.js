//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-comment").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-comment").attr("order-id", orderId);
    });
    $.ajax({
       url:'/order/my_orders/',
       dataType:'json',
       type:'GET',
       success:function(data){
            if(data.code == '200'){
                for(var i=0;i<data.data[i].length;i++){
                    li_tr = '<li order-id=''>'
                    li_tr += '<div class="order-title">'
                    li_tr += '<h3>订单编号：'+data.data[i].order_id+'</h3>'
                    li_tr += '<div class="fr order-operate">'
                    li_tr += '<button type="button" class="btn btn-success order-comment"'
                    li_tr += 'data-toggle="modal" data-target="#comment-modal">发表评价</button></div></div>'
                    li_tr += '<div class="order-content">'
                    li_tr += '<img src="">'
                    li_tr += '<div class="order-text"><h3>订单</h3>'
                    li_tr += '<ul><li>创建时间：'+data.data[i].create_date+'</li>'
                    li_tr += '<li>入住日期：'+data.data[i].begin_date+'</li>'
                    li_tr += '<li>离开日期：'+data.data[i].end_date+'</li>'
                    li_tr += '<li>合计金额：'+data.data[i].amount+'元(共'data.data[i].days+'晚)</li>'
                    li_tr += '<li>订单状态：<span>'+data.data[i].status+'</span></li>'
                    li_tr += '<li>我的评价：'+data.data[i].comment+'</li>'
                    li_tr += '<li>拒单原因：</li></ul></div></div></li>'
                }

            }
       }

    })
});