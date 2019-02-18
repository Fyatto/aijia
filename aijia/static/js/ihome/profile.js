function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });

}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}
$(document).ready(function(){
    $("#form-avatar").submit(function(e){
        e.preventDefault();
        avatar = $("#user-avatar").val();
        $("#form-avatar").ajaxSubmit({
        url:'/user/user_profile/',
        dataType:'json',
        type:'PATCH',
        success:function(data){
//        {'code': 200, 'msg':'请求成功', avatar: 'upload/123.png'}
            if(data.code == '200'){
                $('#user-avatar').attr('src','/static/'+data.data)
            }
        },
        error:function(data){
            alert('请求失败')
        }

        })


    })
    $("#form-name").submit(function(e){
        e.preventDefault();
        name = $("#form-name input[name=name]").val();
        if (!name) {
            $("#name-err span").html("请填写用户名");
            $("#name-err").show();
            return;
        }
    $.ajax({
    url:'/user/user_profile/',
    data:{'name':name},
    dataType:'json',
    type:'PATCH',
    success:function(data){
        console.log(data)
        if(data.code == '200'){
            location.href = '/user/my/'
        }

    }


    })
    })
})
