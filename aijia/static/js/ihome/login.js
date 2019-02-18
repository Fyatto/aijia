function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function() {
    $("#mobile").focus(function(){
        $("#mobile-err").hide();
    });
    $("#password").focus(function(){
        $("#password-err").hide();
    });
    $(".form-login").submit(function(e){
        e.preventDefault();
        mobile = $("#mobile").val();
        passwd = $("#password").val();
        if (!mobile) {
            $("#mobile-err span").html("请填写正确的手机号！");
            $("#mobile-err").show();
            return;
        } 
        if (!passwd) {
            $("#password-err span").html("请填写密码!");
            $("#password-err").show();
            return;
        }

//    异步请求
   $.ajax({
        url:'/user/my_login/',
        type:'GET',
        data:{
            'phone': mobile,
            'pwd': passwd
          },
        dataType:'json',
        success:function(data){
            console.log(data)
            if(data.code == '200'){
                location.href = '/user/my/'
            }
            if(data.code == '1007'){
            $('#mobile-err span').html('该账号没注册，请去注册');
            $('#mobile-err').show();
             }
            if(data.code == '1008'){
            $('#password-err span').html('密码不正确');
            $('#password-err').show();
            }
        },
        error:function(data){
            alert('error')
        }
        })

    });

})