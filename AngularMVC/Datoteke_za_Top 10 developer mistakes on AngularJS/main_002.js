$(function(){
    $('.moreZero').hover(function(){
        if($(this).children('.userLikes').size()==0){
            var id=parseInt($(this).closest('li').attr('id')), ths=$(this);
            $.ajax({
                type: "POST",
                dataType: "json",
                data:'id='+id+'&pref='+ini_this_type,
                beforeSend: function(x) {if(x && x.overrideMimeType) {x.overrideMimeType("application/json;charset=UTF-8");}},
                url: ini_this_dir+'../userLike/ajaxCore.php',
                success: function(data) {
                    if(data && data.length>0){ 
                        var tmp = '';
                        for(var i=0,c=data.length;i<c;i++){
                            tmp+="<img id='"+data[i].user_id+"ucml' src='"+data[i].img+"' title='"+data[i].name+" "+data[i].surname+"'/>";
                        }
                        $("<div class='userLikes'>"+tmp+"</div>").appendTo(ths);
                        $('.userLikes').children('img').on('click',(function(){
                            var id=parseInt($(this).attr('id'));
                            if(id>0) location.href="../users/user-"+id;
                        }));
                    }
                },
                error:function(){
                    $("<div class='userLikes'></div>").appendTo(ths);
                }
            });
        } else {
            $(this).children('.userLikes').css({'display':'block','opacity':0.0}).animate({'opacity':1.0},100,'easeInCirc'); 
        }
    },function(){
        $(this).children('.userLikes').animate({'opacity':0.0},100,'easeOutCirc',function(){
            $(this).css({'display':'none','opacity':0.0});
        });
    });
});