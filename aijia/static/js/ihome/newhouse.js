function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');
        $("#form-house-image").show()
        $("#form-house-info").submit(function(e){
        e.preventDefault();
        })
        $.ajax({
            url:'/home/area_facility/',
            dataType:'json',
            type:'GET',
            success:function(data){
                if(data.code == '200'){
                    for(var i=0;i<data.areas.length; i++){
                        console.log(data.areas[i])
                        area_str = '<option value="'+data.areas[i].id +'">'+ data.areas[i].name+ '</option>'
                        $('#area-id').append(area_str)
                    }
                    for(var j=0;j<data.facilitys.length;j++){
                        facility_str = '<li><div class="checkbox"<label>'
                        facility_str += '<input type="checkbox"name="facility"'
                        facility_str += 'value=">'+data.facilitys[j].id+ '">'+ data.facilitys[j].name
                        facility_str += '</label></div></li>'

                        $('.house-facility-list').append(facility_str)
            }
                }

            }

        })
        $(".houses-list").ajaxSubmit({
            url:'/home/newhouse/',
            dataType:'json',
            type:'PATCH',
            success:function(data){
                if(data.code == '200'){
//                    $("#form-house-info").hide()
//                    $("#form-house-image").show()
                    alert('提交成功')
                }
            },
            error:function(data){
                alert('请求失败')
            }

            })
        $("#form-house-image").submit(function(e){
            e.preventDefault();

            $(this).ajaxSubmit({
                url:'/home/newhouse_img/',
                dataType:'json',
                type:'PATCH',
                success:function(data){
                    if(data.code == '200'){
                    $(".house-image-cons").append($('<img src="">').attr('src','/static/'+data.data))
//                    location.href = '/home/myhouse/'

                    }
                },
                 error:function(data){
                    alert('请求失败')
                }


            })
        })

})