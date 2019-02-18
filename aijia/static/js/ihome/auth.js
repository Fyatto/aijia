function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    $("#form-auth").submit(function(e){
        e.preventDefault();
        id_name = $("#real-name").val();
        id_card = $("#id-card").val()
    $("#form-auth").ajaxSubmit({
        url:'/user/auth/',
        dataType:'json',
        type:'POST',
        success:function(data){
            if(data.code == '200'){
                $('#form-auth input').attr('disabled','disabled')
                $('.btn-success').hide()
                alert('实名认证成功')

            }
            if(data.code == '1012'){
                alert('身份证已认证')
                $('#form-auth input').attr('disabled','disabled')
                $('.btn-success').hide()

            }
        },
        error:function(data){
            alert('实名认证失败')
        }

        })


    })

})
