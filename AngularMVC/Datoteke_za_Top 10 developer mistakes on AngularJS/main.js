$(function(){
$.getScript('../../../../js/cursor.js');
$('#editor').html('');
var set={
  tag:['[code] [/code]','[strong] [/strong]','[a href=""] [/a]','[img src="" /]'],
  edit:false,
  tags:['<code></code>','<strong></strong>'],
  sort:[],
  user:[],
  curent:false,
  names:['Базовый','Бронзовый','Серебрянный','Золотой','Платиновый']
}
var eSet = {
    list:['<b>','</b>','<i>','</i>','<strike>','</strike>','<u>','</u>'],
    id:false,
    com:[]
}

if(typeof setImg != 'undefined'){
  set.img=setImg; set.name=setName
}

$('#commentList > li').each(function(){
    set.sort.push(parseFloat($(this).children('.vote').children('span').text())+','+parseInt($(this).attr('id')));
});

/* sorting by value */
$('#sortByValue').click(function(){
    var tmp=set.sort.sort(function(a,b){return parseFloat(b)-parseFloat(a);});
    var obj = $('#commErr');
    if($(this).hasClass('sortByValue')){
        tmp=set.sort.sort(function(a,b){return a.split(',')[1]-b.split(',')[1];});
        $(this).removeClass('sortByValue');
        $(this).children('p').text(ini_loc.i[1]);
    } else {
        $(this).addClass('sortByValue');
        $(this).children('p').text(ini_loc.i[2]);
    }
    for(var i=0,c=set.sort.length;i<c;i++){
        $('#'+tmp[i].split(',')[1]+'com').insertBefore(obj);
    }
});

$('#commentList > li > p > code').each(function(){
    var cont=$(this).text();
    $(this).html('<pre class="brush:php;">'+cont+'</pre>');
});


$('#commentList').find('pre').each(function(){
  if(typeof $(this).attr('class') != 'undefined'){
    var c = $(this).attr('class').split(':')[1].replace(';','')
  } else c = 'php'
  var t = $(this).html()
  $(this).html('<code class="'+c+'">'+t+'</code>').attr('class','')
})

hljs.initHighlightingOnLoad()

// SyntaxHighlighter.config.clipboardSwf = 'script/clipboard.swf';
// SyntaxHighlighter.all();

/*DP*/
$('.dissItem:odd').addClass('oddItem'); $('.commNum:odd').addClass('oddNum');
$('#commentList').children('li').each(function(){
    var c=$(this).children('p').children('code');
    if(c.width()>$(this).children('p').width()){
        c.addClass('codeAMore');
    } else {c.css({'display':'block','width':'105%','marginLeft':'-3%'});}
});

$('.up[vote="1"],.down[vote="1"]').css({'opacity':'1.0'});
/* END DP */

$('#editor').one('click','',function(){
  if($(this).attr('id')=='editor'){
    $(this).animate({'height':250},200,function(){
      $('#sendCom,.formDesc').css('display','block').animate({'opacity':1.0},100);
    });
  }
});

$('#formCom').submit(function(e){
  e.preventDefault();
  if($(this).attr('id')=='formCom'){
    $('#commErr').text('').css({'display':'none','opacity':0.0});
    var c=false;
    var commText='', commTmp=$('#editor').html().toString();
    for(var i=0,c=commTmp.length;i<c;i++){
        if(commTmp[i]!=='<' && commTmp[i]!=='>'){
            commText+=commTmp[i];
        } else if(commTmp[i]=='<'){
            var e=strpos(commTmp,'>',i);
            var name = commTmp.substr(i,(e-i)+1).toLowerCase();
            if(inArray(name,eSet.list)){
                commText+=name;
            } else if(name=='<div>' || name.substr(1,3)=='pre'){commText+='\n'; }
            i+=name.length-1;
        }
    }
    if(commText.length<3){$('#commErr').prepend(ini_loc.i[3]);c=true;}
    if(c==true){
        $('#commErr').css({'display':'block','opacity':1.0});
    } else {
     var res=$.ajax({type: "POST",url:ini_this_dir+"ajaxCore.php",data:({'prefix':ini_this_type,get:'nc','id':idPage,'t':/*decodeURIComponent(*/commText/*)*/}),dataType:"html",async:false}).responseText;
     if(res){
        res=JSON.parse(res);
        var ls=res.length;
        if(ls>0){
          $('.desPoint:last').children('span').eq(1).text(parseInt($('.desPoint:last').children('span').eq(1).text())+1);
          cleanForm();
          res[1]=nl2br(res[1]).replace(/\\/g, '');
          var o = $('<li uc="'+res[0]+'com"><span class="commNum">'+($('#commentList').children('li').size()+1)+'</span><img src="'+set.img+'" alt=""/><div class="commInfo"><span class="commUname">'+ini_loc.i[2]+'</span><span class="commDate" my="1">'+res[2]+'</span></div><p>'+res[1]+'</p><div class="vote"><span class="minZero">0</span><i class="icon-pencil editMyComment"></i></div></li>').insertBefore($('#commErr'));
          var c=o.children('p').children('code');
            if(c.width()>o.children('p').width()){
                c.addClass('codeAMore');
            } else {c.css({'display':'block','width':'95%'});}
        } else {cleanForm(); alert(ini_loc.i[4]);}
      }
    }
  }
});

$('.vote > .up').on('click',(function(){
    var id=parseInt($(this).closest('li').attr('id'));
    if(typeof $(this).attr('vote')!='undefined'){
      var res=$.ajax({type: "POST",url:ini_this_dir+"ajaxCore.php",data:({'prefix':ini_this_type,get:'unup','i':id}),dataType:"html",async:false}).responseText;
      if(res=='OK'){
        $(this).removeAttr('vote').removeAttr('style');
        setNum($(this).closest('.vote').children('span').children('.numDiv'),-0.1);
      }
    } else {
      var res=$.ajax({type: "POST",url:ini_this_dir+"ajaxCore.php",data:({'prefix':ini_this_type,get:'up','i':id}),dataType:"html",async:false}).responseText;
      if(res=='OK'){
    	if(typeof $(this).closest('.vote').children('.down').attr('vote')!='undefined'){var des=0.2;}else{var des=0.1;}
        setNum($(this).closest('.vote').children('span').children('.numDiv'),des);
        $(this).attr('vote',1).css('opacity',1.0);
        if(typeof $(this).next('i').attr('vote')!='undefined'){
            $(this).next('i').removeAttr('vote').removeAttr('style');
        }
      }
    }
}));
$('.vote > .down').on('click',(function(){
    var id=parseInt($(this).closest('li').attr('id'));
    if(typeof $(this).attr('vote')!='undefined'){
      var res=$.ajax({type: "POST",url:ini_this_dir+"ajaxCore.php",data:({'prefix':ini_this_type,get:'undown','i':id}),dataType:"html",async:false}).responseText;
      if(res=='OK'){
        $(this).removeAttr('style').removeAttr('vote');
        setNum($(this).closest('.vote').children('span').children('.numDiv'),0.1);
      }
    } else {
      var res=$.ajax({type: "POST",url:ini_this_dir+"ajaxCore.php",data:({'prefix':ini_this_type,get:'down','i':id}),dataType:"html",async:false}).responseText;
      if(res=='OK'){
        if(typeof $(this).closest('.vote').children('.up').attr('vote')!='undefined'){var des=-0.2;}else{var des=-0.1;}
        setNum($(this).closest('.vote').children('span').children('.numDiv'),des);
    	$(this).attr('vote',1).css('opacity',1.0);
        if(typeof $(this).prev('i').attr('vote')!='undefined'){
            $(this).prev('i').removeAttr('vote').removeAttr('style');
        }
      }
    }
}));

$('.userCommImg').click(function(){
  if(typeof set.img!=='undefined'){
    var id=parseInt($(this).attr('type'));
    if(id>0 && set.curent!=id){
        location.href='../dashboard/profile-'+id
        /*set.curent=id;
        if(typeof set.user[id]!=='undefined'){
            setUserData(set.user[id]);
        } else {
            $.ajax({
                type: "POST",
                dataType: "json",
                data: "get=user&i="+id+"&prefix="+ini_this_type,
                beforeSend: function(x) {if(x && x.overrideMimeType) {x.overrideMimeType("application/json;charset=UTF-8");}},
                url: ini_this_dir+'ajaxCore.php',
                success: function(data) {
                  if(data){
                    set.user[id]=data;
                    setUserData(set.user[id]);
                  }
                }
            });
        }*/
    }
    /*$('#userBox').css({'display':'block'}).animate({'opacity':1.0},200);
    $('#userBoxFon').css({'display':'block'}).animate({'opacity':0.5},100);*/
  }
});

function setUserData(data){
    var o=$('#userBox');
    var list=o.children('#userInfoBox').children('li').children('span');
    var source=$('.userCommImg[type="'+set.curent+'"]');
    o.children('header').children('img:nth-child(2)').attr('src',source.attr('src')).next('span').text(source.attr('title'));
    list.eq(0).text(data.user_info[0].country[0].name);
    list.eq(1).text(data.pos.ball+' Dev Points');
    list.eq(2).text(data.user_info[0].interestings);
    list.eq(3).text(set.names[data.userLabel]);
    list.eq(4).text(data.pos.global[0].c+'-й среди пользователей сервиса');
    list.eq(5).text(data.pos.country[0].c+'-й в своей стране');
    list.eq(6).text(data.user_info[0].about);
    o.children('#userDetails').attr('href','../dashboard/profile-'+set.curent);
}

function setNum(e,num){
    var t=parseFloat(e.text()),dir=['outZero','minZero','moreZero'];
    var o=$('#cacheVal');c=parseFloat(o.text());c=c+num; c=Number((c).toFixed(1));
    o.text(c);
    t=Number((t+num).toFixed(1));
    if(t>0){dir=dir[2];}else if(t<0){dir=dir[0]}else if(t==0){dir=dir[1];}
    e.text(t).parent('span').removeAttr('class').attr('class',dir);
    if(e.next('.userLikes').size()==1){
        var el=e.next('.userLikes'),u=parseFloat(scrIdent);
        if(num==-0.1 || num==-0.2){
            if(el.children('.'+u+'ucml').size()==1){
               el.children('.'+u+'ucml').remove();
            }
        } else if(num==0.1 || num==0.2){
            if(el.children('.'+u+'ucml').size()==0){
               if(el.children('img').size()>6) el.children('img').eq(0).remove();
               el.append('<img src="'+set.img+'" title="'+set.name+'" class="'+u+'ucml"/>');
            }
        }
    }
}
function cleanForm(){
    $('#editor').html('');
    $('#commErr').text('').css({'display':'none','opacity':0.0});
}

$('.editMyComment').on('click',(function(){
  var el = $(this).closest('li'); var n=el.attr('id');
  if(eSet.id!==el.attr('id')){
    if(eSet.id!==false){
        $('#commErr'+eSet.id+',#formCom'+eSet.id+',.formDesc'+eSet.id).css('display','none');
        $('#editor'+eSet.id).html('');
        $('#'+eSet.id).children('p').css({'display':'block','opacity':1.0});
    }
    eSet.id = n;

    el.children('p').css({'display':'none','opacity':'0.0'});
    if(el.children('form').size()==0){
        $.ajax({
            type: "POST", url:ini_this_dir+"ajaxCore.php",data:({'prefix':ini_this_type,get:'ecom','id':parseInt(n)}),
            dataType:"html", async:false,
            success: function(e){
                $('#commErr,#formCom,.formDesc').clone(true).appendTo(el);
                el.children('#commErr').attr('id','commErr'+n);
                var f = el.children('#formCom').css('display','block').attr('id','formCom'+n);el.children('.formDesc').css('display','block').attr('class','formDesc'+n);
                //set comment text from db to #editor-n
                f.children('.container').children('.btn-toolbar').attr('data-target','editorComm'+n).next('#editor').attr('id','editor'+n).html(e);
                f.children('.container').children('.btn-toolbar').children('#voiceBtn').remove();
                f.children('.btn').remove(); $('<input class="btn editBtn saveComm" type="submit" id="editCom'+n+'" value="'+ini_loc.i[5]+'"><input class="btn editBtn cancelComm" type="reset" id="resetCom'+n+'" value="'+ini_loc.i[6]+'">').appendTo(f);
                eSet.com[parseInt(n)]=e;
            }
        }).responseText;
    } else {
        el.children('#commErr'+n+',#formCom'+n+',.formDesc'+n).css({'display':'block','opacity':'1.0'});
        $('#editor'+n).html(eSet.com[parseInt(n)]);
    }
    $('#commErr,#formCom,.formDesc').css('display','none');
  }
}));

// cancel and send comm editing
$('form[id^="formCom"]').on('click',(function(e){
    var el = $(this).closest('li'); var id = el.attr('id');
    // cancel
    if(e.target.className=='btn editBtn cancelComm'){
        $('#commErr'+id+',#formCom'+id+',.formDesc'+id).animate({'opacity':'0.0'},200,'easeInCirc',function(){
            $(this).css('display','none');
            eSet.id = false;
            el.children('p').css({'display':'block','opacity':'1.0'});
        });
        $('#commErr,#formCom,.formDesc').css('display','block');
    }
    // send
    if(e.target.className=='btn editBtn saveComm'){
        var comm = parseInt(id);
        $('#commErr'+id).text('').css({'display':'none','opacity':0.0});
        var c=false;
        var commText='', commTmp=$('#editor'+id).html().toString();
        for(var i=0,c=commTmp.length;i<c;i++){
            if(commTmp[i]!=='<' && commTmp[i]!=='>'){
                commText+=commTmp[i];
            } else if(commTmp[i]=='<'){
                var e=strpos(commTmp,'>',i);
                var name = commTmp.substr(i,(e-i)+1).toLowerCase();
                if(inArray(name,eSet.list)){
                    commText+=name;
                } else if(name=='<div>' || name.substr(1,3)=='pre'){commText+='\n'; }
                i+=name.length-1;
            }
        }
        if(commText.length<3){$('#commErr'+id).prepend(ini_loc.i[3]);c=true;}
        if(c==true){
            $('#commErr'+id).css({'display':'block','opacity':1.0});
        } else {
         var res=$.ajax({type: "POST",url:ini_this_dir+"ajaxCore.php",data:({'prefix':ini_this_type,get:'edit','id':comm,'t':commText}),dataType:"html",async:false}).responseText;
         if(res){
            res=JSON.parse(res);
            $('#editor'+id).html('');
            if(typeof res.text!=='undefined'){
              res.text=nl2br(res.text).replace(/\\/g, '');
              eSet.com[comm]=res.text;
              $('#resetCom'+id).trigger('click').fadeTo(100,1.0,function(){
                el.children('p').html(res.text).css({'display':'block','marginLeft':100}).animate({'opacity':1.0,'marginLeft':60},400,'easeOutCirc');
              });
            } else { alert(ini_loc.i[4]);}
          }
        }
    }
}));

function strpos( haystack, needle, offset){
	var i = haystack.indexOf( needle, offset );
	return i >= 0 ? i : false;
}

});
