$(document).ready(function(){
    $.ajax({
        url:'/home/myhouse_info/',
        dataType:'json',
        type:'GET',
        success:function(data){
            if(data.code == '200'){
                $('.auth-warn').hide()
            }
            if(data.code == '1111'){
                $(".auth-warn").show();

            }
        },
        error:function(data){
            $(".auth-warn").show();
        }

    })
    $.get('/home/newhouse_info/',function(data){
        if(data.code == '200'){
            for(var i=0;i<data.data.length;i++){
            li_tr = '<li><a href="/home/detail/?id='+data.data[i].id +'">'
            li_tr += '<div class="house-title">'
            li_tr += '<h3>房屋ID:'+data.data[i].id +'——'+ data.data[i].title+ '</h3>'
            li_tr += '</div><div class="house-content">'
            li_tr += '<img src="/static/'+ data.data[i].image+'">'
            li_tr += '<div class="house-text">'
            li_tr += '<ul><li>位于：'+ data.data[i].area+ '</li>'
            li_tr += '<li>价格：￥'+ data.data[i].price+ '/晚</li>'
            li_tr += '<li>发布时间：'+ data.data[i].create_time+ '</li></ul>'
            li_tr += '</div></div></a></li>'
            $('#houses-list').append(li_tr)
            }
//            for(var i=0;i<data.data.length; i++){
//                area_str = '<option value="'+data.data[i].id +'">'
//                $('#area-id').append(area_str)
//            }
            }

            })

//            for(var j=0;j<data.facilitys.length;j++){
//                facility_str = '<li><div class="checkbox"<label>'
//                facility_str += '<input type="checkbox"name="facility">'
//                facility_str += '</label></div></li>'
//
//                $('.house-facility-list').append(facility_str)
//            }
//        }
//    });
//    $.ajax({
//        url:'/home/newhouse_info/',
//        dataType:'json',
//        type:'GET',
//        success:function(data){
//                console.log(data)
//
//        }
//
//
//    })

    })




