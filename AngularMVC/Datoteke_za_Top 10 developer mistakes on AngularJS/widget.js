var WidgetCore=function(){var e={handler:{getPrice:".serviceBtn",getLogin:".loadLoginPanel",resetLang:".lang-reset",getContact:"#contactUsBtn",getHelp:".widget-help-btn",getTips:".btn-widget-tips, .btn-widget-tips *",getAddTool:"#addTool-logo i"}};return e.fixes=function(){$('.top-panel-link[href="../user/devpoints"]').click(function(e){e.preventDefault(),"undefined"==typeof Reflex&&Main.install("../js/helper/reflex.js"),Reflex.fire({type:"click",name:"rem",elem:"#edit-ball",page:"../dashboard/index"})})},e.init=function(){$.each(e.handler,function(e,t){$(t).click(function(e){e.preventDefault()})}),e.fixes()},e.init(),e.getPrice=function(e){0==$("#pricelist").size()?(Main.install("../system/services/payment/pricelist/main.js?v=1"),Pricelist.init()):Pricelist.show()},e.getLogin=function(e){Main.install("../system/services/login/main.js?v=1"),Login.complect("pay"),Login.st="menu"},e.resetLang=function(e){var t=e.data("type");document.URL.indexOf("/en/")>-1?location.href=document.URL.replace("/en/","/"+t+"/"):document.URL.indexOf("/ru/")>-1&&(location.href=document.URL.replace("/ru/","/"+t+"/"))},e.getContact=function(e){$("#contact-box").size()||Main.install("contacts/main",1),Contacts.init()},e.getHelp=function(e){var t=e.attr("data-target").split("/");"undefined"==typeof Help&&(Main.install("../system/services/help/app.js?v=1"),Help.init(t[0],t[1])),Help.show(t[0],t[1])},e.getTips=function(e){e=e.is(".btn-widget-tips")?e:e.closest(".btn-widget-tips");var t=e.attr("data-dir").split("/");"undefined"==typeof Tips&&Main.install("tips/app",1),"undefined"==typeof Tips[Main.capOne(t[1])]&&Main.install("tips/storage/"+t[0]+"/"+t[1]+"/main",1)},e.getAddTool=function(e){Main.getAsync("page/addTool/main",1,function(){AddTool.init()})},$("body").click(function(t){t=$(t.target),$.each(e.handler,function(n,i){t.is(i)&&e[n](t)})}),e}();